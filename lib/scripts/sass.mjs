import { readFile } from 'node:fs/promises'
import shell from 'shelljs'
import { resolveSourceConfig } from '../config.mjs'
import { logger } from '../logger.mjs'

function bundle ({ target, outDir, sourcemap = true }, onFileBuild) {
  /**
   * Using shell to avoid saving css output and source maps
   * manually when using sass JS API `compile` method
   */
  shell.exec(
    `sass ${target.entry} ${outDir}/${target.output} --style=compressed ${!sourcemap ? '--no-source-map' : ''}`,
    (code, stdout, stderr) => {
      if (code !== 0) {
        const [errorMessage] = stderr.toString().split('\n')
        logger(errorMessage, {
          level: 'error',
          entry: target.entry,
          script: 'lib\\scripts\\sass.mjs',
          printStackError: false
          // sass already has great error infos on logging stdout
        })
        return
      }
      onFileBuild && onFileBuild(`${outDir}/${target.output}`)
    })
}

/**
 * Handles sass files changes from watch
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 */
export function onSassChange ({ filepath, config }) {
  const targets = resolveSourceConfig({ filepath, config })

  if (!targets || !targets.length) return

  targets.forEach(target =>
    bundle({
      target,
      outDir: config.publicDir
    }, output => logger('✨ [artifact] bundled to [output]', {
      output,
      artifact: 'css'
    }))
  )
}

/**
 * Compile Sass files using DartSass
 * @param {Object[]|Object} target - entry files and outputs filepaths
 * @param {String} outDir - output directory for css files
 * @returns {Promise} DartSass `compile` result
 */
export function buildSass ({ target, outDir }) {
  const { output } = target

  return new Promise((resolve) => {
    bundle({
      target,
      outDir,
      sourcemap: false
    }, () => resolve(readFile(`${outDir}/${output}`)))
  })
}
