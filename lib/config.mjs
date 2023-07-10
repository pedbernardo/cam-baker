import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv-flow'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'
import { CONFIG_FILENAME } from './constants.mjs'
import { logger } from './logger.mjs'

/**
 * EntryPointsConfig
 * @typedef {Object} EntryPointsConfig
 * @property {String} [js="main.js"] - Javascript entry filename pattern (default: "main.js")
 * @property {String} [jsx="main.jsx"] - JSX entry filename pattern (default: "main.jsx")
 * @property {String} [scss="style.scss"] - Sass entry filename pattern (default: "style.scss")
 * @property {String} [html="index.html"] - HTML entry filename pattern (default: "index.html")
 */

/**
 * WatchConfig powered by chokidar node package
 * @see [chokidar]{@link https://github.com/paulmillr/chokidar}
 * @typedef {Object} WatchConfig
 * @property {Boolean} [ignoreInitial=true] - indicates whether is to ignore calling the events during the initialization (default: true)
 * @property {Boolean} [buildOnWatch=false] - indicates whether is to build forms alongside file change bundles
 * @property {Object} [awaitWriteFinish] - configuration when waiting to finish writing the files
 * @property {Number} [awaitWriteFinish.stabilityThreshold=150] - amount of time in milliseconds before emitting its event
 */

/**
 * EnvConfig powered by dotenv-flow node package
 * @see [dotenv-flow]{@link https://github.com/kerimdzhanov/dotenv-flow}
 * @typedef {Object} EnvConfig
 * @property {String} [path="./config"] - path to the .env* files directory (default: "./config")
 * @property {String} [envPrefix="PUBLIC_"] - exposed env variables prefix to esbuild (default: "PUBLIC_")
 */

/**
 * ServerConfig powered by live-server and livereload node packages
 * @see [live-server]{@link https://github.com/tapio/live-server}
 * @see [livereload]{@link https://github.com/napcs/node-livereload}
 * @typedef {Object} ServerConfig
 * @property {Number} [port=8181] - defines the server port (default: 8181)
 * @property {Boolean} [livereload=true] - indicates whether to support livereload from `outDir` files (default: true)
 */

/**
 * MockConfig powered by json-server node package
 * @see [json-server]{@link https://github.com/typicode/json-server}
 * @typedef {Object} MockConfig
 * @property {Number} [port=8282] - defines the mock server port (default: 8282)
 * @property {Number} [delayInMs=1000] - add delay to server responses (default: 1000)
 * @property {String} [route="/mocks/api"] - initial path for routes (default: "/mocks/api")
 * @property {String} [file="./db.json"] - routes and data config for json-serve (default: "./db.json")
 */

/**
 * Camunda Run powered by run-camunda node package
 * @see [run-camunda]{@link https://github.com/nikku/run-camunda}
 * @typedef {Object} CamundaRunConfig
 * @property {String} [version="7.19"] - Camunda Run version to be used (default: "7.19")
 * @property {Boolean} [autoDeploy=false] - enables auto-deploy feature (default: false)
 * @todo _property_ {Boolean} [autoMigration=false] - enables auto-migration feature (default: false)
 * @todo _property_ {Boolean} [autoPurge=false] - enables auto-purge feature, deleting non-migrated instances (default: false)
 */

/**
 * Project Configurations from `camunda.config.js` file
 * @typedef {Object} ProjectConfig
 * @property {String} [outDir] - specify the output directory of build form files (default: "dist")
 * @property {String} [publicDir] - specify the static served directory of bundled files from `src` when watching (default: "public")
 * @property {WatchConfig} [watch] - extends chokidar configuration used on watchers
 * @property {EntryPointsConfig} [entryPoints] - specify the name patterns for entry files
 * @property {EnvConfig} [env] - extends dotenv-flow configuration
 * @property {ServerConfig} [server] - enables static server hosting and livereload
 * @property {MockConfig} [mocks] - enables mock server by json-server
 * @property {CamundaRunConfig|Boolean} [camundaRun=false] - enables usage of Camunda Run directly by the CLI (default: false)
 */

/**
 * @typedef {Object} ParsedEnvConfig
 * @property {Object} [parsedVariables] - `.env*` parsed variables
 */

/** @typedef {EnvConfig & ParsedEnvConfig} InternalEnvConfig */

/**
 * Internal Configurations guards and configs
 * @typedef {Object} GuardsBakerConfig
 * @property {Boolean} [explicitMocks=false]
 * @property {Boolean} [enableCamundaRun=false]
 * @property {String} [camundaRunServer] - Camunda Run Server URL
 * @property {InternalEnvConfig} [env] - dotenv-flow configuration and parsed env variables
 */

/** @typedef {ProjectConfig & GuardsBakerConfig} BakerConfig */

/** @type {EntryPointsConfig} */
const defaultEntryPoints = {
  js: 'main.js',
  jsx: 'main.jsx',
  scss: 'style.scss',
  html: 'index.html'
}

/** @type {WatchConfig} */
const defaultWatchConfig = {
  ignoreInitial: true,
  buildOnWatch: false,
  awaitWriteFinish: {
    stabilityThreshold: 150
  }
}

/** @type {EnvConfig} */
const defaultEnvConfig = {
  path: './config',
  envPrefix: 'PUBLIC_'
}

/** @type {ServerConfig} */
const defaultServerConfig = {
  port: 8181,
  livereload: true
}

/** @type {MockConfig} */
const defaultMockConfig = {
  port: 8282,
  delayInMs: 1000,
  route: '/mocks/api',
  file: './mocks/db.json'
}

/** @type {CamundaRunConfig} */
const defaultCamundaRunConfig = {
  version: '7.19',
  autoDeploy: false
  // @todo , autoMigration: false
}

/** @type {BakerConfig} */
const DEFAULT_CONFIG = {
  outDir: './dist',
  publicDir: './public',
  explicitMocks: false,
  entryPoints: defaultEntryPoints,
  watch: defaultWatchConfig,
  env: defaultEnvConfig,
  server: defaultServerConfig,
  mocks: defaultMockConfig,
  enableCamundaRun: false,
  camundaRun: defaultCamundaRunConfig
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
 * @returns {Promise<BakerConfig>}
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
      link: 'https://cam-baker.netlify.app/guide/cli#custom-config-file'
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
 * @param {BakerConfig} localConfig - config options
 * @returns {BakerConfig} - final configuration options
 */
export function createConfig (localConfig) {
  const config = merge(
    cloneDeep(DEFAULT_CONFIG),
    (localConfig ?? {})
  )

  if (localConfig?.mocks) config.explicitMocks = true
  if (localConfig?.camundaRun) config.enableCamundaRun = true
  // inject defaults when camundaRun config is used with explicit `true`
  if (localConfig?.camundaRun === true) config.camundaRun = defaultCamundaRunConfig

  config.env.parsedVariables = parseBundleVariables(config.env.envPrefix)

  return config
}

/**
 * Returns the final configuration object, setting env references
 * and merging default and project configurations
 * @param {String} localConfigPath - locals project config file path
 * @returns {Promise<BakerConfig>} merged configuration object
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
 * Enables intellisense when declaring configuration file
 * @param {ProjectConfig} config - project configuration object
 * @returns {ProjectConfig}
 */
export function defineConfig (config) {
  return config
}
