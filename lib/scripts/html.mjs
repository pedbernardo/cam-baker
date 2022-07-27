import { readFile, writeFile } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import htmlnano from 'htmlnano'
import posthtml from 'posthtml'
import include from 'posthtml-include'
import expressions from 'posthtml-expressions'
import { insertAt } from 'posthtml-insert-at'
import { resolveSourceConfig } from '../config.mjs'
import { logger } from '../logger.mjs'

const POST_HTML_PLUGINS = [
  htmlnano({
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeOptionalTags: true,
    removeAttributeQuotes: true,
    minifyCss: false,
    minifyJs: false,
    minifySvg: false
  }),
  include({
    root: './src'
  }),
  expressions({
    locals: {
      env: process.env.NODE_ENV ?? 'local'
    }
  })
]

function setupDevScript ({ port, baseName }) {
  return `
  <script src="http://127.0.0.1:35729/livereload.js"></script>
  <script cam-script type="text/form-script">
    (async () => {
      try {
        const main = await import('http://127.0.0.1:${port}/${baseName}.js')
        main.default({ camForm, $scope, inject })
      } catch (error) {
        console.error(error)
      }
    })()
  </script>`
}

function getPostHtmlPlugins ({ js, css, port, baseName }, target) {
  return [
    ...POST_HTML_PLUGINS,
    insertAt({
      selector: 'form',
      behavior: 'inside',
      prepend: target === 'build'
        ? css ? `<style>${css}</style>` : ''
        : `<link rel="stylesheet" href="http://127.0.0.1:${port}/${baseName}.css">`,
      append: target === 'build'
        ? js ? `<script cam-script type="text/form-script">${js}</script>` : ''
        : setupDevScript({ port, baseName })
    })
  ]
}

/**
 * Handles sass files changes from watch
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 */
export function onHtmlChange ({ filepath, config }) {
  const targets = resolveSourceConfig({ filepath })

  if (!targets && !targets.length) return

  targets.forEach(target =>
    bundle({
      target,
      outDir: config.outDir,
      port: config.server.port
    }, output => logger('✨ [artifact] bundled to [output]', {
      output,
      artifact: 'form'
    }))
  )
}

function bundle ({ target, outDir, port }, onFileBuild) {
  const { entry, output } = target
  const baseName = output.split('.')[0]
  const postHtmlConfig = getPostHtmlPlugins({ port, baseName })

  let html

  readFile(entry)
    .then(filebuffer =>
      compile({
        html: `<form role="form">${filebuffer.toString()}</form>`,
        config: postHtmlConfig
      })
    )
    .then(content => (html = content.html))
    .then(() => saveOnDisk({ html, output, outDir }))
    .then(() => onFileBuild(`${outDir}/${output}`))
    .catch(error => logger(error.message, {
      level: 'error',
      error,
      entry,
      script: 'lib\\scripts\\form.mjs'
    }))
}

export function bundleHtml ({ target, outDir, config, js, css }, onFileBuild) {
  const { entry, output } = target
  const postHtmlConfig = getPostHtmlPlugins({ js, css })

  let html

  readFile(entry)
    .then(filebuffer =>
      compile({
        html: `<form role="form">${filebuffer.toString()}</form>`,
        config: postHtmlConfig
      })
    )
    .then(content => (html = content.html))
    .then(() => saveOnDisk({ html, output, outDir }))
    .then(() => onFileBuild(`${outDir}/${output}`))
    .catch(error => logger(error.message, {
      level: 'error',
      error,
      entry,
      script: 'lib\\scripts\\form.mjs'
    }))
}

function compile ({ html, config }) {
  return posthtml(config)
    .process(html, {
      lowerCaseTags: true
    })
}

function saveOnDisk ({ html, output, outDir }) {
  if (!existsSync(outDir)) mkdirSync(outDir)
  writeFile(`${outDir}/${output}`, html)
}
