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

/**
 * @typedef {EnvConfig & ParsedEnvConfig} InternalEnvConfig
 */

/**
 * Internal Configurations guards and configs
 * @typedef {Object} GuardsBakerConfig
 * @property {Boolean} [explicitMocks=false]
 * @property {Boolean} [enableCamundaRun=false]
 * @property {String} [camundaRunServer] - Camunda Run Server URL
 * @property {InternalEnvConfig} [env] - dotenv-flow configuration and parsed env variables
 */

/**
 * @typedef {ProjectConfig & GuardsBakerConfig} BakerConfig
 */

/**
 * BpmnData parsed object data
 * @typedef {Object} BpmnParsedData
 * @property {String} filepath - `.bpmn` origin filepath
 * @property {String} filename - `.bpmn` origin filename
 * @property {String} content - `.bpmn` origin file content
 * @property {String[]} resources - `.bpmn` external resources filenames (embedded forms and scripts)
 * @property {Boolean} hasChanged - checks if `incomingChanges` resources files are included on `.bpmn` resources
 */
