exports.dic = require('./pictograph.js')
exports.decode = (text) => typeof text === 'string' ? text.replace(/:([a-zA-Z0-9+-_]*?):/g, (match, emoji) => exports.dic[emoji] || match) : text
exports.version = '{{version}}'
exports.hash = '{{hash}}'
exports.meta = {
  version: '{{mv}}'
}
