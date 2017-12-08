#!/bin/bash

set -eu

IFS=',' A_DEBUG=(${DEBUG:-})
function debug () {
	local show=false
	local i
	for ((i=0; i < ${#A_DEBUG[@]}; i++))
	do
		local v=${A_DEBUG[$i]}
		if [[ $v == '*' ]] || [[ $v == 'pictograph' ]] || [[ $v == 'pictograph:*' ]] || [[ $v == 'pictograph:tag' ]]
		then
			show=true
		fi
	done
	if [[ $show == true ]]
	then
		local now=$(date -uIs)
		echo "${now:0:-6}Z pictograph:tag $@" >&2
	fi
}

# get absolute pathes
SCRIPT=$(readlink -f $BASH_SOURCE)
DIR=${SCRIPT%/*}

# decrypt deploy key
dk="$(mktemp)"
debug key: $dk
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
debug com: $GIT_SSH_COMMAND

# run build
npm run build --silent

# get gemoji commit from latest git tag
c_tag=$(git tag -l | tail -n 1 | cut -d+ -f2)
debug "c_tag: $c_tag"
# get gemoji commit from builted
c_built=$(node -e "console.log(require('$DIR/../release').version)")
debug c_built: $c_built
c_built_round=$(node -e "console.log(require('$DIR/../release').version.substr(0, 7))")
debug c_built_round: $c_built_round
# get current meta package version from npm
v_current=$(npm info pictograph version --silent)
debug v_current: $v_current

if [ "$c_tag" != "$c_built_round" ]
then
	# generate version will be tagged
	v_release_pre=$(npm run semver --silent -- $v_current -i patch)
	debug v_release_pre: $v_release_pre
	v_release="$v_release_pre+$c_built_round"
	debug v_release: $v_release
	# override package.json's version
	debug override package version
	node $DIR/override-package-version.js $v_release
	# stage pacakge.json
	debug add package.json to stage
	git add $DIR/../package.json
	# create commit summary
	c_file=$(mktemp)
	debug c_file: $c_file
	cat > $c_file <<- EOM
		:package: up to $v_release

		auto release with https://github.com/github/gemoji/commit/$c_built
		EOM
	# commit, tag
	git commit -F $c_file \
		--author='prezzemolo <git@prezzemolo.ga>'
	git tag $v_release
	# push it
	git push git@github.com:prezzemolo/pictograph.git HEAD:master $v_release
fi
