import path from 'node:path'
import { globSync } from 'glob'
import { FORMS_FOLDER, WATCH_GLOBS } from './constants.mjs'

/**
 * @type {Number}
 * paths only support root task forms (DEEPNESS = 4)
 * @example `src/forms/<task>/<entry file>
 * or flow/context task forms (DEEPNESS = 5)
 * @example `src/forms/<context/flow>/<task>/<entry file>
 */
const MAX_PATH_DEEPNESS = 5

function isEntryFile (file, entryPoints) {
  return Object.values(entryPoints).includes(file)
}

function getFinalFileExtension (rawExtension) {
  const exntensionMap = {
    scss: 'css',
    jsx: 'js'
  }

  const currentExtension = rawExtension.substring(1)

  return exntensionMap[currentExtension] ?? currentExtension
}

function getBuildBundles ({ taskFolder, entryPoints }) {
  const contextSrc = taskFolder
    ? `${FORMS_FOLDER}/**/${taskFolder}`
    : `${FORMS_FOLDER}/**`

  const entryPatterns = Object.values(entryPoints).join(',')
  const files = globSync(`src/${contextSrc}/*{${entryPatterns}}`)

  const bundles = files
    .filter(filepath =>
      filepath.split('/').length <= MAX_PATH_DEEPNESS
    ).reduce((bundles, filepath) => {
      const { dir, ext } = path.parse(filepath)
      const paths = dir.split('\\')
      const taskFolder = paths.at(-1)
      const outputExt = getFinalFileExtension(ext)

      if (!bundles[taskFolder]) {
        bundles[taskFolder] = {}
      }

      // JSX entry file take precedence over JS entry file
      if (bundles[taskFolder].outputExt && ext === '.js') {
        return bundles
      }

      bundles[taskFolder][outputExt] = {
        entry: filepath,
        output: `${taskFolder}.${outputExt}`
      }

      return bundles
    }, {})

  // only builds targets with a HTML entry
  return Object.values(bundles)
    .filter(targets => targets.html)
}

function getAllBundles ({ ext, entryPoints, taskFolder }) {
  const currentEntryPoint = entryPoints[ext.replace('.', '')]
  const contextSrc = taskFolder
    ? `${FORMS_FOLDER}/**/${taskFolder}`
    : `${FORMS_FOLDER}/**`

  const files = globSync(`src/${contextSrc}/${currentEntryPoint}`)

  return files.map(filepath => {
    const { ext, dir } = path.parse(filepath)
    const taskFolder = dir.split('\\').at(-1)
    const outputExtension = getFinalFileExtension(ext)

    return {
      entry: filepath,
      output: `${taskFolder}.${outputExtension}`
    }
  })
}

function getFileContext ({ filepath, entryPoints }) {
  if (!filepath) return {}

  const paths = filepath.split('\\')
  const { ext, base } = path.parse(filepath)

  const pathsDeepness = paths.length
  const isFileFromForms = paths[1] === FORMS_FOLDER
  const hasContextFolder = pathsDeepness >= 5
  const taskFolder = hasContextFolder ? paths[3] : paths[2]

  const isPartialOrSharedFile =
    !isEntryFile(base, entryPoints) ||
    !isFileFromForms ||
    pathsDeepness > MAX_PATH_DEEPNESS

  return {
    ext,
    isPartialOrSharedFile,
    taskFolder: isFileFromForms ? taskFolder : null
  }
}

/**
 * Finds the bundle configuration from the changed file
 * @param {Object} params
 * @param {String} params.filepath - path of the changed file
 * @param {import("./config.mjs").BakerConfig} params.config - project config options
 * @returns {Object} - bundle config options
 */
export function resolveSourceConfig ({ filepath, config }) {
  const fileContext = getFileContext({ filepath, entryPoints: config.entryPoints })
  const outputExtension = getFinalFileExtension(fileContext.ext)

  // when the modified file doesn't match `src/forms` or
  // or the file doesn't match the `entryPoints` names pattern
  // `src/forms/<task>` or `src/forms/<context>/<task>`
  // falls back to rebuild every file with the same extension
  if (fileContext.isPartialOrSharedFile) {
    return getAllBundles({
      ext: fileContext.ext,
      entryPoints: config.entryPoints,
      taskFolder: fileContext.taskFolder
    })
  }

  return [{
    entry: filepath,
    output: `${fileContext.taskFolder}.${outputExtension}`
  }]
}

export function resolveBuildConfig ({ filepath, config }) {
  const { taskFolder } = getFileContext({ filepath, entryPoints: config.entryPoints })

  const allBundles = getBuildBundles({
    taskFolder,
    entryPoints: config.entryPoints
  })

  return allBundles
}

/**
 * Finds the bundle configuration of the current file
 * @param {Object} params
 * @param {String} params.filepath - path of the current file
 * @param {import("./config.mjs").BakerConfig} params.config - project config options
 * @returns {Object} - bundle config options
 */
export function resolveDeployConfig ({ filepath, config }) {
  const isBuildOnWatchEnabled = config.watch.buildOnWatch
  const resourcesPath = isBuildOnWatchEnabled ? config.outDir : config.publicDir
  const server = config.camundaRunServer

  const bpmn = filepath
    ? [filepath]
    : globSync(WATCH_GLOBS.bpmn)

  return {
    server,
    resourcesPath,
    targets: bpmn.map(filepath => ({ entry: filepath }))
  }
}

export function getFormEntryPaths (htmlEntryFile) {
  return globSync(`./src/**/${htmlEntryFile}`)
}
