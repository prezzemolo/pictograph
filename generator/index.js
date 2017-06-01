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
  const {commit, hash, emoji} = await pack()
  // create release directory
  await makor(release)
  // duplicate check
  if (!force && await checker(path.join(release, 'index.js')) && require(release).version === commit) {
    return console.log(`already generated from gemoji, the commit hash ${commit}.`)
  }
  // render index.js.tpl
  const index = await render(path.join(templates, 'index.js.tpl'), {
    version: commit,
    hash,
    emoji
  })
  // save
  await saver(path.join(release, 'index.js'), index)
  console.log(`successfully create minimalized emoji.json generated from gemoji, the commit hash ${commit}.`)
}

main().catch(reason => {
  console.error(reason.stack)
  process.exit(1)
})
