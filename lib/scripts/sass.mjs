import { readFile } from 'node:fs/promises'
import shell from 'shelljs'
import { resolveSourceConfig } from '../config.mjs'
import { logger } from '../logger.mjs'

/**
 * Handles sass files changes from watch
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 */
export function onSassChange ({ filepath, config }) {
  const targets = resolveSourceConfig({ filepath })

  if (!targets && !targets.length) return

  targets.forEach(target =>
    bundle({
      target,
      outDir: config.outDir
    }, output => logger('✨ [artifact] bundled to [output]', {
      output,
      artifact: 'css'
    }))
  )
}

function bundle ({ target, outDir }, onFileBuild) {
  /**
   * Using shell to avoid saving css output and source maps
   * manually when using sass JS API `compile` method
   */
  shell.exec(
    `sass ${target.entry} ${outDir}/${target.output} --style=compressed`,
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

export function buildSass ({ target, outDir }, onFileBuild) {
  const { entry, output } = target

  return new Promise((resolve) => {
    /**
     * Using shell to avoid saving css output and source maps
     * manually when using sass JS API `compile` method
     */
    shell.exec(
      `sass ${entry} ${outDir}/${output} --style=compressed`,
      (code, stdout, stderr) => {
        if (code !== 0) {
          const [errorMessage] = stderr.toString().split('\n')
          logger(errorMessage, {
            level: 'error',
            entry,
            script: 'lib\\scripts\\sass.mjs',
            printStackError: false
            // sass already has great error infos on logging stdout
          })
          return
        }
        onFileBuild && onFileBuild(`${outDir}/${output}`)
        resolve(readFile(`${outDir}/${output}`))
      })
  })
}
