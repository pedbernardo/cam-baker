import { resolveConfig } from './config.mjs'
import { watch } from './scripts/watch.mjs'
import { serve } from './scripts/server.mjs'
import { mock } from './scripts/mock.mjs'
import { build } from './scripts/build.mjs'
import { printDevWelcome, printEnvironment } from './logger.mjs'

export { defineConfig } from './config.mjs'

export async function startDevCommand (configFile) {
  const config = await resolveConfig(configFile)

  printDevWelcome()
  printEnvironment()

  if (config.server) serve({ config })

  watch({ config })
  mock({ config })

  /** add an empty line before watch logs */
  console.log()
}

export async function startBuildCommand (configFile) {
  const config = await resolveConfig(configFile)

  build({ config })
}
