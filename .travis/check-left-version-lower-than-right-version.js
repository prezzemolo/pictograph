/**
 * return 'true' to console, if process.argv[2] lower than process.argv[3]
 */

try {
  const semver = require('semver')
  console.log(semver.lt(process.argv[2], process.argv[3]))
} catch (e) {
  console.error(e.stack)
  process.exit(1)
}

