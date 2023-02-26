import fs from 'node:fs'
import { resolveBuildConfig, getFormEntryPaths } from '../config.mjs'
import { buildJavascript } from './javascript.mjs'
import { buildSass } from './sass.mjs'
import { buildHtml, onHtmlChange } from './html.mjs'

let CACHED_JS = ''
let CACHED_CSS = ''

/**
 * Initialize project build
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 * @returns {Promise[]}
 */
export function build ({ filepath, config }) {
  const builds = resolveBuildConfig({ filepath, config })

  if (!builds.length) return

  // avoid deleting files when running build & watch
  if (!config.watch.buildOnWatch) {
    fs.rmSync(config.outDir, { recursive: true, force: true })
  }

  return Promise.all(
    builds.map(targets => buildTargets({ targets, config }))
  )
}

/**
 * Bundles all forms entry files
 * @todo turn generic and dynamic, supporting js and css bundling too
 * @param {BakerConfig} config - project config options
 * @returns {Promise[]}
 */
export function bundle ({ config }) {
  const htmls = getFormEntryPaths(config.entryPoints.html)

  return Promise.all(
    htmls.map(filepath => onHtmlChange({ filepath, config }))
  )
}

async function buildTargets ({ targets, config }) {
  const js = !targets.js
    ? CACHED_JS
    : buildJavascript({
      target: targets.js,
      outDir: config.outDir,
      variables: config.env.bundleVariables
    })

  const css = !targets.css
    ? CACHED_CSS
    : buildSass({
      target: targets.css,
      outDir: config.outDir
    })

  const [jsResult, cssResult] = await Promise.all([js, css])

  CACHED_JS = jsResult.toString()
  CACHED_CSS = cssResult.toString()

  if (targets.css) {
    fs.rmSync(`${config.outDir}/${targets.css.output}`)
  }
  if (targets.js) {
    fs.rmSync(`${config.outDir}/${targets.js.output}`)
  }

  return buildHtml({
    target: targets.html,
    outDir: config.outDir,
    js: CACHED_JS,
    css: CACHED_CSS
  })
}
