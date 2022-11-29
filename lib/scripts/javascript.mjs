import { readFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { resolveSourceConfig } from '../config.mjs'
import { logger } from '../logger.mjs'

const commonBundleConfig = {
  bundle: true,
  format: 'esm',
  sourcemap: true,
  minify: false
}

function bundle ({ target, outDir, variables, esbuildConfig = {} }, onFileBuild) {
  const { entry, output } = target

  build({
    ...commonBundleConfig,
    ...esbuildConfig,
    define: variables,
    entryPoints: [entry],
    outfile: `${outDir}/${output}`
  })
    .then(() => onFileBuild && onFileBuild(`${outDir}/${output}`))
    .catch(error => logger(error.message, {
      level: 'error',
      error,
      entry,
      script: 'lib\\scripts\\javascript.mjs',
      printStackError: false
      // esbuild already has great error infos on logging `error.message`
    }))
}

/**
 * Handles javascript files changes from watch
 * @param {String} filepath - path of the changed file
 * @param {BakerConfig} config - project config options
 */
export function onJavascriptChange ({ filepath, config }) {
  const targets = resolveSourceConfig({ filepath, config })

  if (!targets || !targets.length) return

  targets.forEach(target =>
    bundle({
      target,
      outDir: config.publicDir,
      variables: config.env.bundleVariables
    }, output => logger('✨ [artifact] bundled to [output]', {
      output,
      artifact: 'javascript'
    }))
  )
}

/**
 * Bundle Javascript files using ESBuild
 * @param {Object[]|Object} target - entry files and outputs filepaths
 * @param {String} outDir - output directory for javascript files
 * @param {String} variables - environment variables to inject on bundle
 * @returns {Promise} ESBuild `build` result
 */
export async function buildJavascript ({ target, outDir, variables }) {
  const { output } = target

  return new Promise((resolve) => {
    bundle({
      target,
      outDir,
      variables,
      esbuildConfig: {
        format: 'iife',
        globalName: 'init',
        sourcemap: false,
        minify: true
      }
    }, () => resolve(readFile(`${outDir}/${output}`)))
  })
}
