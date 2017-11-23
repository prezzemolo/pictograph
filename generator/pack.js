const request = require('./tools/request')
const debug = require('debug')('pictograph:pack')

/**
 * wrapper of request, parse JSON data
 * @param {string} url request url
 */
const JSONrequest = async url => {
  const headers = {}

  if (url.startsWith('https://api.github.com') && process.env.GITHUB_API_USER && process.env.GITHUB_API_TOKEN) {
    const bv = Buffer.from(`${process.env.GITHUB_API_USER}:${process.env.GITHUB_API_TOKEN}`).toString('base64')
    headers.authorization = `Basic ${bv}`
  }

  const response = await request(url, headers)

  // show GitHub rate-limit in debug time
  if (url.startsWith('https://api.github.com')) {
    [ 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset' ]
      .forEach(rl => debug(`${rl}: ${response.headers[rl.toLowerCase()]}`))
  }

  if (response.statusCode >= 400) throw new Error(`status: ${response.statusCode}, body: ${response.data || 'no body'}`)
  return Object.assign(
    {},
    response,
    {
      data: JSON.parse(response.data)
    }
  )
}

module.exports = async () => {
  // url encorded gemoji database filename
  const target = encodeURIComponent('db/emoji.json')

  /**
   * get informations & contents
   * from GitHub Repositories REST API v3
   * https://developer.github.com/v3/repos/
   */
  // get informations
  const {
    data: {
      commits_url: commitsUrl,
      contents_url: contentsUrl
    }
  } = await JSONrequest('https://api.github.com/repos/github/gemoji')
  debug(`commitsUrl: ${commitsUrl}, contentsUrl: ${contentsUrl}`)
  // get the latest git commit hash of gemoji database on default branch
  const {
    data: [
      {
        sha: commit
      }
    ]
  } = await JSONrequest(commitsUrl.replace('{/sha}', `?path=${target}`))
  debug(`commit: ${commit}`)
  // get the content of gemoji database
  const {
    data: {
      encoding,
      // git object hash
      sha: hash,
      content
    }
  } = await JSONrequest(contentsUrl.replace('{+path}', target))
  // decode the content & parse
  const buffer = Buffer.from(content, encoding)
  const gemoji = JSON.parse(buffer.toString())

  // pack it
  let res = ''
  gemoji.forEach(current => {
    const {emoji} = current
    // oh, not Unicode's emoji (trollface etc)
    if (emoji === undefined) return

    /**
     * drop over 2 characters emoji. (include ligature)
     * for support surrogate pair, referenced
     *     http://qiita.com/sounisi5011/items/aa2d747322aad4850fe7#%E5%88%A5%E3%81%AE%E6%96%B9%E6%B3%95.
     */
    if (emoji.split(/(?![\uDC00-\uDFFF])/).length !== 1) return

    current.aliases.forEach(alias => {
      // check wheter alias is valid javaScript identifier
      const name = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(alias) ? alias : `"${alias}"`
      res += `${name}:"${emoji}",`
    })
  })
  // cut unneed comma
  const emoji = res.slice(0, -1)

  // return packed object
  return {
    commit,
    hash,
    emoji
  }
}
