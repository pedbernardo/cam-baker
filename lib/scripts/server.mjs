import liveServer from 'live-server'
import livereload from 'livereload'
import { printServerHost } from '../logger.mjs'

/**
 * Initialize the static server for `outDir` files and
 * livereload when enabled
 *
 * @param {BakerConfig} config - project config options
 */
export function serve ({ config }) {
  liveServer.start({
    port: config.server.port,
    root: config.outDir,
    open: false,
    cors: true,
    ignore: '.',
    logLevel: 0
  })

  if (config.server.livereload) {
    livereload
      .createServer()
      .watch(config.outDir)
  }

  printServerHost({ server: config.server })
}
