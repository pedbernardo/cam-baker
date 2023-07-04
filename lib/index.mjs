import { resolveConfig } from './config.mjs'
import { printDevWelcome, printEnvironment } from './logger.mjs'
import { watch } from './scripts/watch.mjs'
import { serve } from './scripts/server.mjs'
import { mock } from './scripts/mock.mjs'
import { camundaRun, camundaStop } from './scripts/camunda-run.mjs'
import { build } from './scripts/build.mjs'
import { autodeploy } from './scripts/deploy.mjs'

export { defineConfig } from './config.mjs'

export async function startDevCommand (configFile) {
  const config = await resolveConfig(configFile)

  printDevWelcome()
  printEnvironment()

  serve(config)
  mock(config)

  await camundaRun(config)

  /** add an empty line before watch logs */
  console.log()

  watch(config)
  autodeploy(config)
}

export async function startBuildCommand (configFile) {
  const config = await resolveConfig(configFile)

  build({ config })
}

export async function startStopCommand () {
  await camundaStop()
}
