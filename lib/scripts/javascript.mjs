import { readFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { resolveSourceConfig } from '../config.mjs'
import { logger } from '../logger.mjs'

const isProduction = process.env.NODE_ENV === 'production'

const commonBundleConfig = {
  bundle: true,
  sourcemap: true,
  ignoreAnnotations: !isProduction,
  minify: isProduction
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
      outDir: config.outDir,
      variables: config.env.bundleVariables
    }, output => logger('✨ [artifact] bundled to [output]', {
      output,
      artifact: 'javascript'
    }))
  )
}

export async function buildJavascript ({ target, outDir, variables }) {
  const { output } = target

  return new Promise((resolve) => {
    bundle({
      target,
      outDir,
      variables,
      format: 'iife'
    }, () => resolve(readFile(`${outDir}/${output}`)))
  })
}

function bundle ({ target, outDir, variables, format }, onFileBuild) {
  const { entry, output } = target

  build({
    ...commonBundleConfig,
    format: format ?? 'esm',
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
