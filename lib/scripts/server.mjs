import liveServer from 'live-server'
import livereload from 'livereload'
import { printServerHost } from '../logger.mjs'

/**
 * Initialize the static server for `outDir` files and
 * starts livereload when enabled
 * @param {import("../config.mjs").BakerConfig} config - project config options
 */
export function serve (config) {
  if (!config.server) return

  liveServer.start({
    port: config.server.port,
    root: config.publicDir,
    open: false,
    ignore: '.',
    logLevel: 0,
    // @ts-ignore (param exists but isn't declared)
    cors: true
  })

  if (config.server.livereload) {
    livereload
      .createServer()
      .watch(config.publicDir)
  }

  printServerHost({ server: config.server })
}
