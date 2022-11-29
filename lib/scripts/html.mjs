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
    },
    delimiters: ['{{{', '}}}'],
    unescapeDelimiters: ['{{{{', '}}}}']
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

function setupBuildScript (jsContent) {
  if (!jsContent) return ''
  return `<script cam-script type="text/form-script">${jsContent}init.default({ camForm, $scope, inject })</script>`
}

function getPostHtmlPlugins ({ js, css, port, baseName }, type) {
  return [
    ...POST_HTML_PLUGINS,
    insertAt({
      selector: 'form',
      behavior: 'inside',
      prepend: type === 'build'
        ? css ? `<style>${css}</style>` : ''
        : `<link rel="stylesheet" href="http://127.0.0.1:${port}/${baseName}.css">`,
      append: type === 'build'
        ? setupBuildScript(js)
        : setupDevScript({ port, baseName })
    })
  ]
}

function bundle ({ target, outDir, port, js, css, type }, onFileBuild) {
  const { entry, output } = target
  const [baseName] = output.split('.')
  const postHtmlConfig = getPostHtmlPlugins({ port, baseName, js, css }, type)

  let html

  readFile(entry)
    .then(filebuffer =>
      compile({
        html: `<form role="form" name="task">${filebuffer.toString()}</form>`,
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

/**
 * Handles HTML files changes from watch
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 */
export function onHtmlChange ({ filepath, config }) {
  const targets = resolveSourceConfig({ filepath, config })

  if (!targets || !targets.length) return

  targets.forEach(target =>
    bundle({
      target,
      outDir: config.publicDir,
      port: config.server.port
    }, output => logger('✨ [artifact] bundled to [output]', {
      output,
      artifact: 'form'
    }))
  )
}

/**
 * Build HTML files using PostHTML
 * @param {Object} target - entry file and output filepath
 * @param {String} outDir - output directory for HTML file
 * @param {String} js - bundled javascript to inject on HTML
 * @param {String} css - compiled css to inject on HTML
 */
export function buildHtml ({ target, outDir, js, css }) {
  bundle({
    target,
    outDir,
    js,
    css,
    type: 'build'
  }, output => logger('🎉 [artifact] build to [output]', {
    output,
    artifact: 'form'
  }))
}
