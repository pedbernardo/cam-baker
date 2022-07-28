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

  if (!builds || !builds.length) return

  fs.rmSync(config.outDir, { recursive: true, force: true })
  builds.forEach(target => buildFolder({ target, config }))
}

async function buildFolder ({ target, config }) {
  const js = !target.js
    ? ''
    : buildJavascript({
      target: target.js,
      outDir: config.outDir,
      variables: config.env.bundleVariables
    })

  const css = !target.css
    ? ''
    : buildSass({
      target: target.css,
      outDir: config.outDir
    })

  const [jsResult, cssResult] = await Promise.all([js, css])

  buildHtml({
    target: target.html,
    outDir: config.outDir,
    js: jsResult.toString(),
    css: cssResult.toString()
  })
}
