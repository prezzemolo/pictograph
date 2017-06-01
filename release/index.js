exports.dic = require('./pictograph.json')
exports.decode = (text) => typeof text === 'string' ? text.replace(/:([a-zA-Z0-9+-_]*?):/g, (match, emoji) => exports.dic[emoji] || match) : text
exports.version = '61e16ae891b942738a2cf6bda7b3cbe3143d8521'
exports.hash = 'b23b355776c725f31eb5f42093d6a2b5025ea796'
