import prompts from 'prompts'
import colors from 'colors'
import { createRequire } from 'module'
import { fileURLToPath } from 'node:url'
import { existsSync, readdirSync, statSync, mkdirSync, rmSync, readFileSync, copyFileSync, writeFileSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { TEMPLATE_PATH } from '../constants.mjs'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export function create () {
  prompts([{
    type: 'text',
    name: 'project',
    message: 'Choose your project name:',
    initial: 'cam-baker-project',
    format: value => value.trim()
  }, {
    type: prev => prev === '.' ? 'confirm' : null,
    name: 'cwd',
    message: () => `You want to use the current directory? ${basename(process.cwd())}`
  }, {
    /** abort if previous (cwd) question is not confirmed  */
    type: (prev, { cwd }) => {
      if (cwd === false) throw new Error('Creation cancelled')
      return null
    },
    name: 'cwdChecker'
  }, {
    type: (prev, { project }) => existsSync(project) && !isDirEmpty(project) ? 'confirm' : null,
    name: 'overwrite',
    message: `The chosen directory is not empty. Can I ${colors.red.bold('delete(!)')} existing files and continue?`
  }, {
    /** abort if previous (overwrite) question is not confirmed  */
    type: (prev, { overwrite }) => {
      if (overwrite === false) throw new Error('Creation cancelled')
      return null
    },
    name: 'overwriteChecker'
  }, {
    type: (prev, { project }) => getPackageName(project) !== project ? 'text' : null,
    name: 'packageName',
    message: 'Choose your package name:',
    initial: (prev, { project }) => getPackageName(project)
  }], {
    onCancel: () => {
      throw new Error('Creation cancelled')
    }
  })
    .then(createProject)
    .catch(error => console.log(error.message))
}

function createProject (config) {
  config.packageName = config.packageName ?? getPackageName(config.project)
  config.fullDir = join(process.cwd(), config.packageName)
  config.templateDir = resolve(fileURLToPath(import.meta.url), '../../..', TEMPLATE_PATH)
  config.version = pkg.version

  if (!config.cwd && !config.overwrite) mkdirSync(config.fullDir, { recursive: true })
  if (config.overwrite) emptyDir(config.fullDir)

  console.log(`\nScaffolding project in ${colors.grey(config.fullDir)}`)

  createTemplateCopy(config)
  createPackageJson(config)

  console.log(`${colors.green('Done √')}. Finish installing npm dependencies and run start command.\n`)
  if (!config.cwd) console.log(`  cd ${config.packageName}`)
  console.log('  npm install')
  console.log('  npm run dev\n')
}

function createTemplateCopy ({ templateDir, fullDir }) {
  const files = readdirSync(templateDir)
    .filter(name => name !== 'package.json')

  files.forEach(filename =>
    copy(
      join(templateDir, filename),
      join(fullDir, filename.replace('_gitignore', '.gitignore'))
    )
  )
}

function createPackageJson ({ templateDir, packageName, version, fullDir }) {
  const packageJson = JSON.parse(
    readFileSync(join(templateDir, 'package.json'), 'utf-8')
  )

  packageJson.name = packageName
  packageJson.devDependencies['cam-baker'] = `^${version}`

  writeFileSync(
    join(fullDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  )
}

function getPackageName (rawProjectName) {
  const projectName = rawProjectName === '.'
    ? basename(process.cwd())
    : rawProjectName

  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}

function isDirEmpty (path) {
  if (!existsSync(path)) return
  return readdirSync(path)?.length === 0
}

function emptyDir (path) {
  if (!existsSync(path)) return
  for (const file of readdirSync(path)) {
    rmSync(resolve(path, file), { recursive: true, force: true })
  }
}

function copy (src, dest) {
  const stat = statSync(src)

  stat.isDirectory()
    ? copyDir(src, dest)
    : copyFileSync(src, dest)
}

function copyDir (srcDir, destDir) {
  mkdirSync(destDir, { recursive: true })

  for (const file of readdirSync(srcDir)) {
    copy(
      resolve(srcDir, file),
      resolve(destDir, file)
    )
  }
}
