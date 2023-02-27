import { defineConfig } from './lib/config.mjs'

export default defineConfig({
  camundaRun: {
    autoDeploy: true,
    autoMigration: true
  }
})
