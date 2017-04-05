const request = require("./tools/request")
const crypto = require("crypto")

module.exports = async () => {
    // get gemoji json
    const result = await request("https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json")

    // statusCode isn't 200
    if (result.statusCode !== 200) throw ("ah~~~~")

    // calculate md5 hash
    const hash = crypto.createHash("md5");
    hash.update(result.data)
    const md5hash = hash.digest("hex")

    // parse to JavaScript object
    const emojis = JSON.parse(result.data)

    // responce dict object
    const responce = {}

    // pack it
    emojis.forEach(current => {
        const emoji = current.emoji
        // oh, not Unicode's emoji (trollface etc)
        if (emoji === undefined) return

        /**
         * drop over 2 characters emoji.
         * for support surrogate pair, referenced
         *     http://qiita.com/sounisi5011/items/aa2d747322aad4850fe7#%E5%88%A5%E3%81%AE%E6%96%B9%E6%B3%95.
         */ 
        if (emoji.split(/(?![\uDC00-\uDFFF])/).length !== 1) return

        current.aliases.forEach(current => {
            responce[current] = emoji
        })
    })

    // return array, first md5 hash, second responce object.
    return [md5hash, responce]
}
