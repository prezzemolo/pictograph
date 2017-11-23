#!/bin/bash

# get absolute pathes
SCRIPT=$(readlink -f $BASH_SOURCE)
DIR=${SCRIPT%/*}

# decrypt deploy key
dk="$(mktemp)"
openssl aes-256-cbc \
	-K $encrypted_a716c936a8d9_key \
	-iv $encrypted_a716c936a8d9_iv \
	-in $DIR/id_pictograph.enc \
	-out $dk \
	-d

# inject git ssh command w/ decrypted deploy key
export GIT_SSH_COMMAND=`cat << EOC
ssh \
-o StrictHostKeyChecking=no \
-o IdentitiesOnly=yes \
-i $dk
EOC
`

# run build
npm run build

# get gemoji commit from current published version
c_npm=$(npm info pictograph version | cut -d+ -f2)
# get gemoji commit from builted
c_built=$(node -e "console.log(require('$DIR/../release').version)")
c_built_round=$(node -e "console.log(require('$DIR/../release').version.substr(0, 7))")
# get current meta package version
v_meta=$(node -e "console.log(require('$DIR/../package.json').version)" | cut -d+ -f1)

if [ "$c_npm" != "$c_built_round" ]
then
	# generate version tagged
	v_release="$v_meta+$c_built_round"
	# override package.json's version
	node $DIR/override-package-version.js $v_release
	# stage pacakge.json
	git add $DIR/../package.json
	# create commit summary
	c_file=$(mktemp)
	cat > $c_file <<- EOM
		:pacakge: up to $v_release

		built with https://github.com/github/gemoji/commit/$c_built
		EOM
	# commit, tag
	git commit -F $c_file
	git tag $v_release
	# push it
	git push git@github.com:prezzemolo/pictograph.git master $v_release
fi
