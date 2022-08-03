import fs from 'node:fs'
import { resolveBuildConfig } from '../config.mjs'
import { buildJavascript } from './javascript.mjs'
import { buildSass } from './sass.mjs'
import { buildHtml } from './html.mjs'

let CACHED_JS = ''
let CACHED_CSS = ''

/**
 * Initialize project build
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 */
export function build ({ filepath, config }) {
  const builds = resolveBuildConfig({ filepath, config })

  if (!builds.length) return

  fs.rmSync(config.outDir, { recursive: true, force: true })
  builds.forEach(targets => buildFolder({ targets, config }))
}

async function buildFolder ({ targets, config }) {
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

  buildHtml({
    target: targets.html,
    outDir: config.outDir,
    js: CACHED_JS,
    css: CACHED_CSS
  })
}
