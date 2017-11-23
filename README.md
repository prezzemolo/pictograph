pictograph
=====
[![][mit-badge]][mit] [![][npm-badge]][npm] [![][travis-badge]][travis] [![][greenkeeper-badge]][greenkeeper]  
minimalized gemoji dictionaly.  
reduced size by up to 90%, 300 KB to 20 KB.  
this module doesn't include ligatures emoji.

Installation
-----
```
npm install pictograph
```

Example
-----
```js
const pictograph = require("pictograph")
console.log(pictograph.dic["100"]) // '💯'
console.log(pictograph.version) // '61e16ae891b942738a2cf6bda7b3cbe3143d8521'
console.log(pictograph.decode(":+1:")) // '👍'
console.log(pictograph.meta.version) // '2.1.0'
```

Properties
-----
name|type|description
---|---|---
dic|object|minimalized gemoji dictionaly
version|string|git commit hash of contained gemoji database
hash|string|git object hash of gemoji database
decode|function|emoji code decoder
meta.version|string|pictograph pacakge version

License
-----
The MIT License. See [LICENSE](LICENSE).

[mit]: http://opensource.org/licenses/MIT
[mit-badge]:https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[npm]: https://www.npmjs.com/package/pictograph
[npm-badge]: https://badge.fury.io/js/pictograph.svg
[travis]: https://travis-ci.org/prezzemolo/pictograph/
[travis-badge]: https://travis-ci.org/prezzemolo/pictograph.svg?branch=master
[greenkeeper]: https://greenkeeper.io/
[greenkeeper-badge]: https://badges.greenkeeper.io/prezzemolo/pictograph.svg
