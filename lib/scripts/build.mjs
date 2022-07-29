import fs from 'node:fs'
import { resolveBuildConfig } from '../config.mjs'
import { buildJavascript } from './javascript.mjs'
import { buildSass } from './sass.mjs'
import { buildHtml } from './html.mjs'

/**
 * Initialize project build
 * @param {BakerConfig} config - project config options
 */
export function build ({ config }) {
  const builds = resolveBuildConfig({ config })

  if (!builds.length) return

  fs.rmSync(config.outDir, { recursive: true, force: true })
  builds.forEach(targets => buildFolder({ targets, config }))
}

async function buildFolder ({ targets, config }) {
  const js = !targets.js
    ? ''
    : buildJavascript({
      target: targets.js,
      outDir: config.outDir,
      variables: config.env.bundleVariables
    })

  const css = !targets.css
    ? ''
    : buildSass({
      target: targets.css,
      outDir: config.outDir
    })

  const [jsResult, cssResult] = await Promise.all([js, css])

  if (targets.css) {
    fs.rmSync(`${config.outDir}/${targets.css.output}`)
  }
  if (targets.js) {
    fs.rmSync(`${config.outDir}/${targets.js.output}`)
  }

  buildHtml({
    target: targets.html,
    outDir: config.outDir,
    js: jsResult.toString(),
    css: cssResult.toString()
  })
}
