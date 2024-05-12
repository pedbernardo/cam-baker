import { camundaStop } from './camunda-run.mjs'
import { exit } from 'node:process'

async function onExit (enableCamundaRun) {
  console.info('Gracefully shutting down. Please wait...')
  if (enableCamundaRun) await camundaStop()
  console.log('Stopped...')

  process.on('SIGINT', () => {
    console.info('Force-closing all open sockets...')
    exit(0)
  })
}

function registerCloseListener (enableCamundaRun) {
  let run = false

  const wrapper = () => {
    if (!run) {
      run = true
      onExit(enableCamundaRun)
    }
  }

  process.on('SIGINT', wrapper)
  process.on('SIGTERM', wrapper)
  process.on('exit', wrapper)
}

export function watchShutdown (config) {
  registerCloseListener(config.enableCamundaRun)
}
