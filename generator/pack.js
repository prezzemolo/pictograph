const request = require('./tools/request')
const crypto = require('crypto')

module.exports = async () => {
  // get gemoji json
  const {data, statusCode} = await request('https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json')

  // statusCode isn't 200
  if (statusCode !== 200) throw new Error('status code is not 200')

  // calculate md5 hash
  const hash = crypto.createHash('sha1')
  hash.update(data)
  const sha1hash = hash.digest('hex')

  // parse to JavaScript object
  const gemoji = JSON.parse(data)

  // response dict object
  const res = {}

  // pack it
  gemoji.forEach(current => {
    const emoji = current.emoji
    // oh, not Unicode's emoji (trollface etc)
    if (emoji === undefined) return

    /**
     * drop over 2 characters emoji. (include ligature)
     * for support surrogate pair, referenced
     *     http://qiita.com/sounisi5011/items/aa2d747322aad4850fe7#%E5%88%A5%E3%81%AE%E6%96%B9%E6%B3%95.
     */
    if (emoji.split(/(?![\uDC00-\uDFFF])/).length !== 1) return

    current.aliases.forEach(current => {
      res[current] = emoji
    })
  })

  // return packed object.
  return {
    hash: sha1hash,
    emoji: res
  }
}
