// require modules
const http = require('http')
const https = require('https')
const URL = require('url')

// require package.json for customized user-agent
const pkg = require('../../package.json')

/**
 * http/https request sender.
 *
 * @param {string} url
 * @return {Promise<object>} custom result object that has 3 properties... data, headers and statusCode.
 */
module.exports = (url, headers) => new Promise((resolve, reject) => {
  /**
   * pack options
   */
  const urlObj = URL.parse(url)
  const options = {
    'headers': Object.assign({
      'User-Agent': `Mozilla/5.0 (compatible; ${pkg.name}/${pkg.version}; +https://www.npmjs.com/package/${pkg.name})`
    }, headers),
    'host': urlObj.hostname,
    'path': urlObj.path
  }

  /**
   * callback
   * callback of http/https module's request method.
   */
  const callback = (res) => {
    const data = []
    const result = {
      headers: res.headers,
      statusCode: res.statusCode
    }

    res.on('end', () => {
      if (data.length > 0) result.data = Buffer.concat(data)
      resolve(result)
    })
    res.on('data', (chunk) => {
      data.push(chunk)
    })
    res.on('close', (err) => {
      reject(err)
    })
  }

  /**
   * send request
   * automatic select http or https.
   */
  const req = urlObj.protocol === 'http:'
    ? http.request(options, callback)
    : urlObj.protocol === 'https:'
    ? https.request(options, callback)
    : null

  /**
   * @throws not supported protocol.
   */
  if (req === null) reject(new Error('not supported protocol.'))

    /**
     * close request
     */
  req.end()
})
