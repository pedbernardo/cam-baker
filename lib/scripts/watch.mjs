import { WATCH_GLOBS } from '../constants.mjs'
import { watcher } from '../watcher.mjs'
import { onHtmlChange } from './html.mjs'
import { onJavascriptChange } from './javascript.mjs'
import { onSassChange } from './sass.mjs'
import { onBpmnChange, onBpmnFormChange } from './bpmn.mjs'
import { build } from './build.mjs'

/**
 * Initialize all common watchers, used locally or remotely
 * @param {BakerConfig} config - project config options
 */
function startCommonWatchers (config) {
  watcher.watch(WATCH_GLOBS.html, config.watch)
    .on('all', (event, filepath) => onHtmlChange({ filepath, config }))

  watcher.watch(WATCH_GLOBS.js, config.watch)
    .on('all', (event, filepath) => onJavascriptChange({ filepath, config }))

  watcher.watch(WATCH_GLOBS.sass, config.watch)
    .on('all', (event, filepath) => onSassChange({ filepath, config }))

  if (config.camundaRun?.autoDeploy) {
    watcher.watch(WATCH_GLOBS.bpmn, config.watch)
      .on('all', (event, filepath) => onBpmnChange({ filepath, config }))

    watcher.watch(WATCH_GLOBS.html, config.watch)
      .on('all', (event, filepath) => onBpmnFormChange({ filepath, config }))
  }

  if (config.watch.buildOnWatch) {
    watcher.watch(WATCH_GLOBS.any, config.watch)
      .on('all', (event, filepath) => build({ filepath, config }))
  }
}

/**
 * Initialize `src` project watchers
 * @param {BakerConfig} config - project config options
 */
export function watch ({ config }) {
  startCommonWatchers(config)
}
