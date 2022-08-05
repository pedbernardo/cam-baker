import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv-flow'
import glob from 'glob'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'
import { CONFIG_FILENAME, FORMS_FOLDER } from './constants.mjs'
import { logger } from './logger.mjs'

/**
 * EntryPointsConfig
 *
 * @typedef {Object} EntryPointsConfig
 * @property {String=} js - Javascript entry filename pattern (default: main.js)
 * @property {String=} jsx - JSX entry filename pattern (default: main.jsx)
 * @property {String=} scss - Sass entry filename pattern (default: style.scss)
 * @property {String=} html - HTML entry filename pattern (default: index.html)
 */

/**
 * WatchConfig powered by chokidar node package
 * @see [chokidar]{@link https://github.com/paulmillr/chokidar}
 *
 * @typedef {Object} WatchConfig
 * @property {Boolean=} ignoreInitial - indicates whether is to ignore calling the events during the initialization (default: true)
 * @property {Boolean=} buildOnWatch - indicates whether is to build forms alongside file change bundles (default: false)
 * @property {Object=} awaitWriteFinish - configuration when waiting to finish writing the files
 * @property {Number=} awaitWriteFinish.stabilityThreshold - amount of time in milliseconds before emitting its event (default: 150)
 */

/**
 * EnvConfig powered by dotenv-flow node package
 * @see [dotenv-flow]{@link https://github.com/kerimdzhanov/dotenv-flow}
 *
 * @typedef {Object} EnvConfig
 * @property {String=} path - path to the .env* files directory (default: ./config)
 * @property {String=} envPrefix - exposed env variables prefix to esbuild (default: CAMUNDA_)
 */

/**
 * ServerConfig powered by live-server and livereload node packages
 * @see [live-server]{@link https://github.com/tapio/live-server}
 * @see [livereload]{@link https://github.com/napcs/node-livereload}
 *
 * @typedef {Object} ServerConfig
 * @property {Number=} port - defines the server port (default: 8181)
 * @property {Boolean=} livereload - indicates whether to support livereload from `outDir` files (default: true)
 */

/**
 * MockConfig powered by json-server node package
 * @see [json-server]{@link https://github.com/typicode/json-server}
 *
 * @typedef {Object} MockConfig
 * @property {Number=} port - defines the mock server port (default: 8282)
 * @property {Number=} delayInMs - add delay to server responses (default: 1000)
 * @property {String=} route - initial path for routes (default: /mocks/api)
 * @property {String=} file - routes and data config for json-serve (default: ./db.json)
 */

/**
 * BakerConfig the configuration file
 *
 * @typedef {Object} BakerConfig
 * @property {String=} outDir - specify the output directory of build form files
 * @property {String=} publicDir - specify the static served directory of bundled files from `src` when watching
 * @property {WatchConfig=} watch - extends chokidar configuration used on watchers
 * @property {EntryPointsConfig=} entryPoints - specify the name patterns for entry files
 * @property {EnvConfig=} env - extends dotenv-flow configuration
 * @property {ServerConfig=} server - enables static server hosting and livereload
 * @property {MockConfig=} mocks - enables mock server by json-server
 * @property {SourceConfig=} src - artifacts (`js` | `css` | `html`) bundle config
 */

/**
 * @type {EntryPointsConfig}
 */
const defaultEntryPoints = {
  js: 'main.js',
  jsx: 'main.jsx',
  scss: 'style.scss',
  html: 'index.html'
}

/**
 * @type {WatchConfig}
 */
const defaultWatchConfig = {
  ignoreInitial: true,
  buildOnWatch: false,
  awaitWriteFinish: {
    stabilityThreshold: 150
  }
}

/**
 * @type {EnvConfig}
 */
const defaultEnvConfig = {
  path: './config',
  envPrefix: 'CAMUNDA_'
}

/**
 * @type {ServerConfig}
 */
const defaultServerConfig = {
  port: 8181,
  livereload: true
}

/**
 * @type {MockConfig}
 */
const defaultMockConfig = {
  port: 8282,
  delayInMs: 1000,
  route: '/mocks/api',
  file: './mocks/db.json'
}

/**
 * @type {BakerConfig}
 */
export const DEFAULT_CONFIG = {
  outDir: './dist',
  publicDir: './public',
  explicitMocks: false,
  entryPoints: defaultEntryPoints,
  watch: defaultWatchConfig,
  env: defaultEnvConfig,
  server: defaultServerConfig,
  mocks: defaultMockConfig
}

/**
 * @type {Number}
 * paths only support root task forms (DEEPNESS = 4)
 * @example `src/forms/<task>/<entry file>
 * or flow/context task forms (DEEPNESS = 5)
 * @example `src/forms/<context/flow>/<task>/<entry file>
 */
const MAX_PATH_DEEPNESS = 5

function getFinalFileExtension (rawExtension) {
  const exntensionMap = {
    scss: 'css',
    jsx: 'js'
  }

  const currentExtension = rawExtension.substring(1)

  return exntensionMap[currentExtension] ?? currentExtension
}

function getAllBundles ({ ext, entryPoints, taskFolder }) {
  const currentEntryPoint = entryPoints[ext.replace('.', '')]
  const contextSrc = taskFolder
    ? `${FORMS_FOLDER}/**/${taskFolder}`
    : `${FORMS_FOLDER}/**`

  const files = glob.sync(`src/${contextSrc}/${currentEntryPoint}`)

  return files.map(filepath => {
    const taskFolder = filepath.split('/').at(-2)
    const { ext } = path.parse(filepath)
    const outputExtension = getFinalFileExtension(ext)

    return {
      entry: filepath,
      output: `${taskFolder}.${outputExtension}`
    }
  })
}

function getBuildBundles ({ taskFolder, entryPoints }) {
  const contextSrc = taskFolder
    ? `${FORMS_FOLDER}/**/${taskFolder}`
    : `${FORMS_FOLDER}/**`

  const entryPatterns = Object.values(entryPoints).join(',')
  const files = glob.sync(`src/${contextSrc}/*{${entryPatterns}}`)

  const bundles = files
    .filter(filepath =>
      filepath.split('/').length <= MAX_PATH_DEEPNESS
    ).reduce((bundles, filepath) => {
      const paths = filepath.split('/')
      const taskFolder = paths.at(-2)
      const file = paths.at(-1)
      const { ext } = path.parse(file)
      const outputExt = getFinalFileExtension(ext)

      if (!bundles[taskFolder]) {
        bundles[taskFolder] = {}
      }

      // JSX entry file take precedence over JS entry file
      if (bundles[taskFolder].outputExt && ext === '.js') {
        return bundles
      }

      bundles[taskFolder][outputExt] = {
        entry: filepath,
        output: `${taskFolder}.${outputExt}`
      }

      return bundles
    }, {})

  // only build what have a HTML entry
  return Object.values(bundles)
    .filter(targets => targets.html)
}

/**
 * Parses all prefixed environment variables from `.env` files
 * @param {String} envPrefix - prefix of env variables injected on javascript build step
 * @returns {Object} bundle variables
 */
function parseBundleVariables (envPrefix) {
  return Object.entries(process.env)
    .reduce((variables, [key, value]) => {
      if (!key.includes(envPrefix)) return variables
      return {
        ...variables,
        [`process.env.${key}`]: JSON.stringify(value)
      }
    }, {})
}

/**
 * Loads the projects local configuration options
 * @param {String} localConfigPath - config file path on the project directory
 * @returns {BakerConfig}
 */
async function loadConfigFile (localConfigPath) {
  const configFile = localConfigPath || CONFIG_FILENAME
  const configFilePath = path.resolve(process.cwd(), configFile)
  const configExists = fs.existsSync(configFilePath)

  if (localConfigPath && !configExists) {
    const warn = 'Can\'t start Camunda Baker. The config file at [output] wasn\'t found.'
    const help = '💁 You can try zero-config without --config parameter and any file or create the specified file.'
    const docs = 'For more info visit the docs: [link]'

    logger(`${warn}\n\n   ${help}\n   ${docs}\n`, {
      output: configFile,
      level: 'warn',
      script: 'config',
      link: 'https://github.com/pedbernardo/cam-baker'
    })
    process.exit()
  }

  if (!configExists) return

  const config = await import(`file://${configFilePath}`)

  return config?.default
}

/**
 * Inject `process.env` variables to global scope
 * @param {String} defaultPath - default path for env files
 * @param {String} configPath - project config path for env files
 */
function loadEnvVariables (defaultPath, configPath) {
  dotenv.config({ path: configPath ?? defaultPath })
}

function isEntryFile (file, entryPoints) {
  return Object.values(entryPoints).includes(file)
}

function getFileContext ({ filepath, entryPoints }) {
  if (!filepath) return {}

  const paths = filepath.split('\\')
  const { ext, base } = path.parse(filepath)

  const pathsDeepness = paths.length
  const isFileFromForms = paths[1] === FORMS_FOLDER
  const hasContextFolder = pathsDeepness >= 5
  const taskFolder = hasContextFolder ? paths[3] : paths[2]

  const isPartialOrSharedFile =
    !isEntryFile(base, entryPoints) ||
    !isFileFromForms ||
    pathsDeepness > MAX_PATH_DEEPNESS

  return {
    ext,
    isPartialOrSharedFile,
    taskFolder: isFileFromForms ? taskFolder : null
  }
}

/**
 * Creates the final configuration object
 * @param {BakerConfig} localConfig - project config options
 * @returns {BakerConfig}
 */
export function createConfig (localConfig) {
  const config = merge(
    cloneDeep(DEFAULT_CONFIG),
    (localConfig ?? {})
  )

  if (localConfig?.mocks) {
    config.explicitMocks = true
  }

  config.env.bundleVariables = parseBundleVariables(config.env.envPrefix)

  return config
}

/**
 * Returns the final configuration object, setting env references
 * and merging default and local configurations
 * @param {String} localConfigPath - locals project config file path
 * @returns {BakerConfig} full configuration object
 */
export async function resolveConfig (localConfigPath) {
  const localConfig = await loadConfigFile(localConfigPath)

  loadEnvVariables(
    DEFAULT_CONFIG.env.path,
    localConfig?.env?.path
  )

  return createConfig(localConfig)
}

/**
 * Finds the bundle configuration from the changed file
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 * @returns {Object} - bundle config options
 */
export function resolveSourceConfig ({ filepath, config }) {
  const fileContext = getFileContext({ filepath, entryPoints: config.entryPoints })
  const outputExtension = getFinalFileExtension(fileContext.ext)

  // when the modified file doesn't match `src/forms` or
  // or the file doesn't match the `entryPoints` names pattern
  // the pattern `src/forms/<task>` or `src/forms/<context>/<task>`
  // falls back to rebuild every file with the same extension
  if (fileContext.isPartialOrSharedFile) {
    return getAllBundles({
      ext: fileContext.ext,
      entryPoints: config.entryPoints,
      taskFolder: fileContext.taskFolder
    })
  }

  return [{
    entry: filepath,
    output: `${fileContext.taskFolder}.${outputExtension}`
  }]
}

export function resolveBuildConfig ({ filepath, config }) {
  const { taskFolder } = getFileContext({ filepath, entryPoints: config.entryPoints })

  const allBundles = getBuildBundles({
    taskFolder,
    entryPoints: config.entryPoints
  })

  return allBundles
}

/**
 * Enables intellisense when declaring a configuration file
 * @param {BakerConfig} config - local configuration object
 * @returns {BakerConfig}
 */
export function defineConfig (config) {
  return config
}
