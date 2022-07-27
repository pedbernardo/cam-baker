import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv-flow'
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
 * @property {String=} outDir - specify the output directory of source files of `src` bundles
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
  explicitMocks: false,
  entryPoints: defaultEntryPoints,
  watch: defaultWatchConfig,
  env: defaultEnvConfig,
  server: defaultServerConfig,
  mocks: defaultMockConfig
}

function getFinalFileExtension (rawExtension) {
  const exntensionMap = {
    scss: 'css',
    jsx: 'js'
  }

  const currentExtension = rawExtension.substring(1)

  return exntensionMap[currentExtension] ?? currentExtension
}

function getBundlesPerFolder ({ fileExtension, entryPoints }) {
  return fs.readdirSync(`./src/${FORMS_FOLDER}`, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => ({
      folder: dirent.name,
      files: fs.readdirSync(`./src/${FORMS_FOLDER}/${dirent.name}`, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(filename => {
          const { ext } = path.parse(filename)
          const matchModifiedExt = fileExtension ? ext === fileExtension : true
          const isEntryPoint = filename === entryPoints[ext.replace('.', '')]
          return isEntryPoint && matchModifiedExt
        })
    }))
    .filter(({ files }) => files.length)
}

function getAllBundles ({ fileExtension, entryPoints }) {
  const allBundles = getBundlesPerFolder({ fileExtension, entryPoints })
    .reduce((entries, { folder, files }) => {
      const folderFiles = files.map(file => {
        const { ext } = path.parse(file)
        const outputExtension = getFinalFileExtension(ext)

        return {
          type: ext,
          entry: `src\\${FORMS_FOLDER}\\${folder}\\${file}`,
          output: `${folder}.${outputExtension}`
        }
      })

      return [
        ...entries,
        ...folderFiles
      ]
    }, [])

  return allBundles
}

function getBuildBundles ({ entryPoints }) {
  const buildBundles = getBundlesPerFolder({ entryPoints })
    .reduce((bundles, { folder, files }) => {
      const folderBundles = files.reduce((currentBundles, file) => {
        const { ext } = path.parse(file)
        const currentExt = ext.replace('.', '')
        const outputExtension = getFinalFileExtension(ext)

        // jsx overrides js bundles when exists
        // {entry}.js and {entry}.jsx inside the
        // same project folder
        if (currentExt === 'js' && currentBundles.js) {
          return currentBundles
        }

        return {
          ...currentBundles,
          [outputExtension]: {
            entry: `src\\${FORMS_FOLDER}\\${folder}\\${file}`,
            output: `${folder}.${outputExtension}`
          }
        }
      }, {})

      return [
        ...bundles,
        folderBundles
      ]
    }, [])

  return buildBundles
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
 * @param {String} artifact - config artifact (enum: js|css|form)
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 * @returns {Object} - bundle config options
 */
export function resolveSourceConfig ({ filepath, config }) {
  const paths = filepath.split('\\')
  const projectFolder = paths[2]
  const { ext } = path.parse(filepath)
  const outputExtension = getFinalFileExtension(ext)
  const isFormsSources = paths[1] === FORMS_FOLDER

  // when the modified file doesn't match `FORMS_FOLDER`
  // falls back to rebuild every file with the same extension
  if (!isFormsSources) {
    const allBundles = getAllBundles({ fileExtension: ext, entryPoints: config.entryPoints })
    return allBundles
  }

  return [{
    entry: `src\\${FORMS_FOLDER}\\${projectFolder}\\${config.entryPoints[ext.replace('.', '')]}`,
    output: `${projectFolder}.${outputExtension}`
  }]
}

export function resolveBuildConfig ({ config }) {
  const allBundles = getBuildBundles({
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
