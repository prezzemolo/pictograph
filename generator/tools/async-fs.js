const fs = require("fs")

/**
 * saver: async wrapper of fs.writeFile
 *
 * @param {string} path file path
 * @param {string|Buffer|Uint8Array} data will save this to file path
 * @return {Promise<void>}
 */
exports.saver = (path, data) => new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
        if (err) return reject(err)
        resolve()
    })
})

/**
 * loader: async wrapper of fs.readFile
 *
 * @param {string} path file path
 * @return {Promise<Buffer>}
 */
exports.loader = path => new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
        if (err) return reject(err)
        resolve(data)
    })
})

/**
 * makor: async wrapper of fs.mkdir
 *
 * @param {string} path directory path
 * @return {Promise<boolean>} false when directory already exists
 */
exports.makor = path => new Promise((resolve, reject) => {
    fs.mkdir(path, err => {
        if (!err) return resolve(true)
        if (err.code !== 'EEXIST') return reject(err)
        resolve(false)
    })
})

/**
 * checker: async checker whether path exists using fs.stat
 *
 * @param {string} path file or directory path
 * @return {Promise<boolean>} whether existence
 */
exports.checker = path => new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
        resolve(err ? false : true)
    })
})
