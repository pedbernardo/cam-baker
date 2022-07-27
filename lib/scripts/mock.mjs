import fs from 'node:fs'
import jsonServer from 'json-server'
import { logger, printMocksHost } from '../logger.mjs'

export function mock ({ config }) {
  const dbExists = fs.existsSync(config.mocks.file)

  if (!dbExists && !config.explicitMocks) return
  if (!dbExists && config.explicitMocks) {
    logger('Can\'t start Mocks Server. The config file at [output] wasn\'t found', {
      output: config.mocks.file,
      level: 'warn',
      script: 'mocks'
    })
    return
  }

  const server = jsonServer.create()
  const router = jsonServer.router(config.mocks.file)
  const middlewares = jsonServer.defaults()

  server.use((req, res, next) => setTimeout(next, config.mocks.delayInMs))
  server.use(middlewares)
  server.use(config.mocks.route, router)
  server.listen(config.mocks.port)

  printMocksHost({ mocks: config.mocks })
}
