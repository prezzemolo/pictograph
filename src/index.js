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

    // save
    try {
        fs.writeFileSync("./release/pictograph.json", JSON.stringify(emojis))
        console.log(`successfully create minimalized gemoji's emoji.json (${hash}).`)
    } catch (e) {
        console.dir(e)
    }
}).catch(e => {
    console.dir(e)
})
