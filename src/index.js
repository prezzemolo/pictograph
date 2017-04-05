const pack = require("./pack")
const fs = require("fs")

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

    // load package.json
    const package = JSON.parse(fs.readFileSync("./package.json"))

    // if already saved dic, indicate
    if (package.version === hash) {
        console.log(`minimalized gemoji's emoji.json (${hash}) has been created.`)
        // not force mode, exit.
        if (! force) return
    }

    // edit package.json
    package.version = hash

    // save package.json
    try {
        fs.writeFileSync("./release/pictograph.json", JSON.stringify(emojis))
        fs.writeFileSync("./package.json", JSON.stringify(package, null, 4))
        console.log(`successfully create minimalized gemoji's emoji.json (${hash}).`)
    } catch (e) {
        console.dir(e)
    }
}).catch(e => {
    console.dir(e)
})
