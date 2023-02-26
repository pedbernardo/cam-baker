import shell from 'shelljs'
import { join } from 'node:path'
import { existsSync, rmSync } from 'node:fs'
import { CAMUNDA_RUN_BIN_FOLDER, CAMUNDA_RUN_DEFAULT_PORT } from '../constants.mjs'
import { setBaseUrl } from '../api/http-client.mjs'
import { logger, printCamundaRun } from '../logger.mjs'
import { createRunConfig, readRunConfig, updateRunConfig } from '../camunda/run-config.mjs'

const CAMUNDA_RUN_DIR = join(process.cwd(), CAMUNDA_RUN_BIN_FOLDER)
const CAMUNDA_RUN_DIST_DIR = join(process.cwd(), `${CAMUNDA_RUN_BIN_FOLDER}/dist`)
const CAMUNDA_RUN_PID_FILE = join(process.cwd(), `${CAMUNDA_RUN_BIN_FOLDER}/run/pid`)
const isCamundaRunDownloaded = () => existsSync(CAMUNDA_RUN_DIST_DIR)
const isCamundaRunRunning = () => existsSync(CAMUNDA_RUN_PID_FILE)
const deleteCamundaRun = () => rmSync(CAMUNDA_RUN_DIR, { recursive: true, force: true })

/**
 * Download and initialize Camunda Run server
 * @param {BakerConfig} config - project config options
 * @return {Promise}
 */
export async function camundaRun ({ config }) {
  if (!config.enableCamundaRun) return

  const camundaRunConfig = {
    ...config.camundaRun,
    downloaded: isCamundaRunDownloaded(),
    printer: printCamundaRun({ camundaRun: config.camundaRun, port: CAMUNDA_RUN_DEFAULT_PORT })
  }

  try {
    if (!camundaRunConfig.downloaded) await camundaRunDownload(camundaRunConfig)
    const port = await camundaRunStart(camundaRunConfig)
    const server = `http://127.0.0.1:${port}`

    setBaseUrl(server)
    config.camundaRunServer = server
  } catch (stderr) {
    const error = stderr.toString()
    const [errorTitle] = error.split('\n')

    camundaRunConfig.printer.failed()

    deleteCamundaRun()

    logger(errorTitle, {
      level: 'error',
      script: 'lib\\scripts\\camunda-run.mjs',
      printStackError: false,
      message: error
    })
  }
}

/**
 * Downloads Camunda Run from Camunda Cloud using `run-camunda` package
 * @param {Object} printer - logger printer instance
 * @param {String} version - camunda run distribution version
 * @returns {Promise}
 */
function camundaRunDownload ({ printer, version }) {
  printer.start('downloading and starting camunda run, may take a while...')

  return new Promise((resolve, reject) => {
    /** Using shell to suppress Run Camunda console.log outputs */
    shell.exec(
      `cross-env CAMUNDA_VERSION=${version} camunda start`,
      { silent: true },
      (code, stdout, stderr) => {
        if (code !== 0) reject(stderr)
        createRunConfig()
        resolve()
      })
  })
}

/**
 * Start Camunda Run server using `run-camunda` package
 * @param {Object} printer - logger printer instance
 * @param {String} version - camunda run distribution version
 * @param {Boolean} downloaded - indicates if the Camunda Run has just been downloaded
 * @returns {Promise}
 */
function camundaRunStart ({ printer, version, downloaded }) {
  const yamlConfig = readRunConfig()
  const configPort = yamlConfig?.server?.port
  const currentPort = configPort ?? CAMUNDA_RUN_DEFAULT_PORT

  if (configPort) printer.updateHostPort(configPort)

  updateRunConfig()

  if (downloaded) {
    printer.start('starting camunda run, wait a few seconds...')
  }

  return new Promise((resolve, reject) => {
    /** Using shell to suppress Run Camunda console.log outputs */
    shell.exec(
      `cross-env CAMUNDA_VERSION=${version} camunda start`,
      { silent: true },
      (code, stdout, stderr) => {
        if (code !== 0) reject(stderr)
        printer.done()
        resolve(currentPort)
      })
  })
}

/**
 * Stop Camunda Run server using `run-camunda` package
 * @returns {Promise}
 */
export async function camundaStop () {
  const printer = printCamundaRun({ usePrefix: false })

  printer.start('Stopping Camunda Run, wait a few seconds...')

  if (!isCamundaRunRunning()) {
    printer.stop('Camunda Run is not running')
    return
  }

  return new Promise((resolve) => {
    /** Using shell to suppress Run Camunda console.log outputs */
    shell.exec(
      'camunda stop',
      { silent: true },
      (code) => {
        if (code !== 0) {
          printer.stop('Something went wrong when shutting down Camunda Run')
        } else {
          printer.stop('Camunda Run stopped')
        }
        /** always resolve */
        resolve()
      })
  })
}
