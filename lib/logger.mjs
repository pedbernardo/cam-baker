import colors from 'colors'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const cliHeader = `\n 🍞 ${colors.blue.bold('Camunda Baker')} v${pkg.version}\n`

const BASE_CONFIG = {
  default: {
    time: true,
    prefix: true,
    level: 'info',
    artifact: '',
    output: '',
    link: '',
    printStackError: true
  },
  warn: {
    time: false,
    prefix: false
  }
}

function getConfig (level, currentConfig) {
  return {
    ...BASE_CONFIG.default,
    ...(BASE_CONFIG[level] ?? {}),
    ...currentConfig
  }
}

const log = {
  info (message) {
    console.log(message)
  },

  error (message, config) {
    const script = `${colors.grey('script:')} ${config.script}`
    const entry = `${colors.grey('entry:')} ${config.entry}`

    log.info(`${config.printStackError ? `${config.error.stack}\n` : ''}`)
    log.info(message)
    log.info(`  ${script}`)
    log.info(`  ${entry}`)
  },

  warn (message, config) {
    const prefix = colors.grey(`${config.script}:`)

    log.info(`\n  ⚠️  ${prefix} ${message}`)
  }
}

function format (rawMessage, config) {
  const timeStamp = new Date().toLocaleTimeString('en', { hour12: false })
  const logStamp = config.time ? colors.grey(`[${timeStamp}]`) : ''
  const prefixColor = config.level !== 'error' ? 'blue' : 'red'
  const prefix = config.prefix ? colors.bold[prefixColor](' [camunda-baker] ') : ''

  let message = rawMessage
  message = message.replace('[artifact]', colors.green(config.artifact))
  message = message.replace('[output]', colors.grey(config.output))
  message = message.replace('[key]', colors.grey(config.key))
  message = message.replace('[link]', colors.cyan(config.link))
  message = config.level === 'error' ? colors.red(`🔥 error - ${message}`) : message

  return `${logStamp}${prefix}${message}`
}

export function logger (rawMessage, config = {}) {
  config = getConfig(config.level, config)

  const message = format(rawMessage, config)

  log[config.level](message, config)
}

export function printDevWelcome () {
  const command = ` ${colors.bgBlack(` ${colors.white.bold.underline.bgBlack('dev')} `)}`
  const welcome = `${colors.grey('command')} started ✨\n`

  console.log(`${cliHeader}${command} ${welcome}`)
}

export function printEnvironment () {
  const envConfig = `${colors.grey('→ environment')}`
  const env = `${colors.bold(process.env.NODE_ENV ?? 'local')}`

  console.log(` ${envConfig} ${env}`)
}

export function printServerHost ({ server }) {
  const serverConfig = colors.grey('→ server')
  const serverHost = colors.cyan(`http://127.0.0.1:${server.port}`)
  const serverLivereload = colors.grey(`| livereload: ${(server.livereload ? colors.bold.green('on') : colors.bold.red('off'))}`)

  console.log(` ${serverConfig} ${serverHost} ${serverLivereload}`)
}

export function printMocksHost ({ mocks }) {
  const serverConfig = colors.grey('→ mocks')
  const serverHost = colors.cyan(` http://127.0.0.1:${mocks.port}${mocks.route}`)
  const serverDelay = colors.grey(`(delay: ${colors.white(`${mocks.delayInMs}ms`)}`)
  const serverFile = colors.grey(`| file: ${colors.white(mocks.file)})`)

  console.log(` ${serverConfig} ${serverHost} ${serverDelay} ${serverFile}`)
}
