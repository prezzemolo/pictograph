const {loader} = require('./async-fs')

/**
 * template render.
 *
 * @param {string} path template path
 * @param {object} variables applies to template
 * @return {Promise<string>}
 */
module.exports = async (path, variables = null) => {
    const tpbuffer = await loader(path)
    let template = tpbuffer.toString()
    if (!variables) return template
    // get keys from variables
    const keys = Object.keys(variables)
    // replace {{hoge}} to variables.hoge
    keys.forEach(key => {
        template = template.replace(
            `{{${key}}}`,
            variables[key]
        )
    })
    return template
}
