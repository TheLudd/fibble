import { gte, major } from 'semver'

const { version } = process

if (gte(version, '20.6.0')) {
  process.stdout.write('modern\n')
  process.exit(0)
}

if (major(version) === 20) {
  process.stdout.write('unsupported\n')
  process.exit(1)
}

if (major(version) === 18) {
  if (gte(version, '18.19.0')) {
    process.stdout.write('modern\n')
  } else {
    process.stdout.write('legacy\n')
  }
  process.exit(0)
}

process.stdout.write('legacy\n')
