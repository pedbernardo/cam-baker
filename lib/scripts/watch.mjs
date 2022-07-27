import chokidar from 'chokidar'
import { WATCH_GLOBS } from '../constants.mjs'
import { onHtmlChange } from './html.mjs'
import { onJavascriptChange } from './javascript.mjs'
import { onSassChange } from './sass.mjs'

/**
 * Initialize all common watchers, used locally or remotely
 * @param {BakerConfig} config - project config options
 */
function startCommonWatchers (config) {
  chokidar.watch(WATCH_GLOBS.html, config.watch)
    .on('all', (event, filepath) => onHtmlChange({ filepath, config }))

  chokidar.watch(WATCH_GLOBS.js, config.watch)
    .on('all', (event, filepath) => onJavascriptChange({ filepath, config }))

  chokidar.watch(WATCH_GLOBS.sass, config.watch)
    .on('all', (event, filepath) => onSassChange({ filepath, config }))
}

/**
 * Initialize `src` project watchers
 * @param {BakerConfig} config - project config options
 */
export function watch ({ config }) {
  startCommonWatchers(config)
}
