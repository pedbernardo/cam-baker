import { basename } from 'node:path'
import { CAMUNDA_RUN_RESOURCES_PATH } from '../constants.mjs'
import { resolveDeployConfig } from '../config.mjs'
import { getBpmnData } from '../camunda/bpmn-parser.mjs'
import { CamundaAPI } from '../api/camunda-api.mjs'
import { logger } from '../logger.mjs'
import { build, bundle } from './build.mjs'

export async function autodeploy ({ config }) {
  if (!config.camundaRun?.autoDeploy) return

  logger('📦 auto-deploy is enabled, deploying all bpmn files from [key]', {
    key: CAMUNDA_RUN_RESOURCES_PATH
  })

  config.watch.buildOnWatch
    ? await build({ config })
    : await bundle({ config })

  deploy({ config })
}

export function deploy ({ filepath, config, incomingChanges }) {
  const {
    server,
    resourcesPath,
    targets
  } = resolveDeployConfig({ filepath, config })

  if (!targets || !targets.length) return

  targets.forEach(target => deployBpmn({
    target,
    resourcesPath,
    incomingChanges
  }, output => logger('💫 [artifact] deployed to [output] on [link]', {
    output,
    artifact: basename(target.entry),
    link: server
  })))
}

async function deployBpmn ({ target, resourcesPath, incomingChanges }, onBpmnDeployed) {
  const { entry } = target

  try {
    const bpmnParsedData = await getBpmnData({ bpmn: entry, resourcesPath, incomingChanges })

    if (!bpmnParsedData.hasChanged) return

    await CamundaAPI.deploy(bpmnParsedData)

    if (onBpmnDeployed) onBpmnDeployed('camunda run')
  } catch (error) {
    logger(`${error?.message}: ${error.response.data.message}`, {
      level: 'error',
      error,
      entry,
      script: 'lib\\scripts\\deploy.mjs',
      printStackError: false
    })
  }
}
