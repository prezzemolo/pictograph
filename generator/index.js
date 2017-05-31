const pack = require("./pack")
const fs = require("fs")
const path = require("path")

// source directory path
const current = path.dirname(__filename)
const baseDir = path.join(current, "..")
const releaseDir = path.join(baseDir, "release")

// force mode
let force = false
process.argv.forEach(current => {
    if ("--force" === current) force = true
})

pack().then(r => {
    const hash = r[0]
    const emojis = r[1]

    // create release folder
    try {
       fs.mkdirSync("release") 
    } catch (e) {
        if (e.code !== 'EEXIST') throw e
    }

    // if already saved dic, indicate
    try {
        const pictograph = require(path.join(releaseDir, "index.js"))
        if (pictograph.version === hash) {
            console.log(`minimalized gemoji's emoji.json (${hash}) has been created.`)
            // not force mode, exit.
            if (! force) return
        }
    } catch (e) {
        // nothing do
    }

    // index.js
    const index = `\
exports.dic = require("./pictograph.json")
exports.version = "${hash}"
`

    // save
    try {
        fs.writeFileSync(path.join(releaseDir, "pictograph.json"), JSON.stringify(emojis))
        fs.writeFileSync(path.join(releaseDir, "index.js"), index)
        console.log(`successfully create minimalized gemoji's emoji.json (${hash}).`)
    } catch (e) {
        console.dir(e)
    }
}).catch(e => {
    console.dir(e)
})
