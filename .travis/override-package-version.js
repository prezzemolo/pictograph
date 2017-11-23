try {
  const path = require('path')
  const { writeFileSync } = require('fs')

  const pkgPath = path.join(__dirname, '..', 'package.json')
  const pkg = require(pkgPath)
  if (!process.argv[2]) process.exit(1)

  pkg.version = process.argv[2]

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
} catch (e) {
  console.error(e.stack)
  process.exit(1)
}
