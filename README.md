pictograph
=====
[![][mit-badge]][mit] [![][npm-badge]][npm] [![][travis-badge]][travis]  
[gemoji](https://github.com/github/gemoji) based minimum dictionaly

About
---
an emoji dictionaly based on [emoji.json](https://github.com/github/gemoji/blob/master/db/emoji.json), but only needs 10% of the capacity compared with it.

Note
---
- automatic tracking updates on gemoji with Travis CI Cron Jobs.
- this module include no ligature emoji(s).

Installing
---
Using npm:

```bash
$ npm install pictograph
```

Examples
---
```js
const pictograph = require("pictograph")
console.log(pictograph.dic["100"]) // '💯'
console.log(pictograph.version) // '61e16ae891b942738a2cf6bda7b3cbe3143d8521'
console.log(pictograph.decode(":+1:")) // '👍'
console.log(pictograph.meta.version) // '2.1.0'
```

Properties
---
name|type|description
---|---|---
dic|object|gemoji based minimum dictionaly
version|string|git commit hash of gemoji used
hash|string|git object hash of emoji.json used
decode|function|convert emoji name to emoji charactor
meta.version|string|pictograph pacakge version

License
---
The MIT License. See [LICENSE](LICENSE).

[mit]: http://opensource.org/licenses/MIT
[mit-badge]:https://img.shields.io/badge/license-MIT-444444.svg
[npm]: https://www.npmjs.com/package/pictograph
[npm-badge]: https://badge.fury.io/js/pictograph.svg
[travis]: https://travis-ci.org/prezzemolo/pictograph/
[travis-badge]: https://travis-ci.org/prezzemolo/pictograph.svg?branch=master
