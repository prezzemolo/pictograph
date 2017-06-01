const pack = require('./pack')
const {saver, makor, checker} = require('./tools/async-fs')
const render = require('./tools/render-template')
const path = require('path')

// source directory path
const current = path.dirname(__filename)
const base = path.join(current, '..')
const release = path.join(base, 'release')
const templates = path.join(current, 'templates')

// force mode
const force = process.argv[2] === '--force'

const main = async () => {
  const {hash, emoji} = await pack()
  // create release directory
  await makor(release)
  // duplicate check
  if (!force && await checker(path.join(release, 'index.js')) && require(release).version === hash) {
    return console.log(`minimalized emoji.json has been generated from gemoji ${hash}.`)
  }
  // render index.js.tpl
  const index = await render(path.join(templates, 'index.js.tpl'), {
    version: hash
  })
  // save
  await saver(path.join(release, 'index.js'), index)
  await saver(path.join(release, 'pictograph.json'), JSON.stringify(emoji))
  console.log(`successfully create minimalized emoji.json generated from gemoji (${hash}).`)
}

main().catch(reason => {
  console.error(reason.stack)
  process.exit(1)
})
