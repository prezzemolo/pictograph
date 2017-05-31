exports.dic = require('./pictograph.json')
exports.decoder = (text) => typeof text === 'string' ? text.replace(/:([a-zA-Z0-9+-_]*?):/g, (match, emoji) => exports.dic[emoji] || match) : text
exports.version = 'd9624f34f8bccebdfe69ae8508ba157995d0b320'
