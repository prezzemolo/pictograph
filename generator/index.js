const pack = require('./pack')
const {saver, makor, checker} = require('./tools/async-fs')
const render = require('./tools/render-template')
const path = require('path')
const pkg = require('../package.json')
const debug = require('debug')('pictograph:index')

// source directory path
const current = path.dirname(__filename)
const base = path.join(current, '..')
const release = path.join(base, 'release')
const templates = path.join(current, 'templates')

// force mode
const force = process.argv[2] === '--force'

const main = async () => {
  const { commit, hash, emoji } = await pack()
  // create release directory
  await makor(release)
  // duplicate check
  if (
    !force &&
      await checker(path.join(release, 'index.js')) &&
      require(release).version === commit &&
      require(release).meta &&
      require(release).meta.version === pkg.version
  ) {
    debug('already generated.')
    return
  }
  // render index.js.tpl
  const index = await render(path.join(templates, 'index.js.tpl'), {
    version: commit,
    hash,
    mv: pkg.version
  })
  // render pictograph.js.tpl
  const pictograph = await render(path.join(templates, 'pictograph.js.tpl'), {
    emoji
  })
  // save
  await saver(path.join(release, 'index.js'), index)
  await saver(path.join(release, 'pictograph.js'), pictograph)
  debug('release files generated successfully.')
}

main().catch(reason => {
  console.error(reason.stack)
  process.exit(1)
})
