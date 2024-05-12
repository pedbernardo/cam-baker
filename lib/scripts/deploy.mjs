import { basename } from 'node:path'
import { CAMUNDA_RUN_RESOURCES_PATH } from '../constants.mjs'
import { resolveDeployConfig } from '../resolver.mjs'
import { getBpmnData } from '../camunda/bpmn-parser.mjs'
import { CamundaAPI } from '../api/camunda-api.mjs'
import { logger } from '../logger.mjs'
import { build, bundle } from './build.mjs'

const MIGRATABLE_ACTIVITIES_TYPES = ['userTask']

export async function autodeploy (config) {
  if (!config.camundaRun?.autoDeploy) return

  logger('📦 auto-deploy is enabled, deploying all bpmn files from [key]', {
    key: CAMUNDA_RUN_RESOURCES_PATH
  })

  config.watch.buildOnWatch
    ? await build({ config })
    : await bundle({ config })

  deploy({ config })
}

/**
 * Deploy the BPMN files and linked artifacts to Camunda
 * @param {Object} params
 * @param {import("../config.mjs").BakerConfig} params.config - project config options
 * @param {String} [params.filepath] - path of the changed file
 * @param {String[]} [params.incomingChanges] - list of resources that has been detect modifications
 */
export function deploy ({ config, filepath, incomingChanges }) {
  const {
    server,
    autoMigration,
    resourcesPath,
    targets
  } = resolveDeployConfig({ filepath, config })

  if (!targets || !targets.length) return

  targets.forEach(target => deployBpmn({
    target,
    resourcesPath,
    incomingChanges,
    autoMigration
  }, output => logger('💫 [artifact] deployed to [output] on [link]', {
    output,
    artifact: basename(target.entry),
    link: server
  })))
}

async function deployBpmn ({ target, resourcesPath, incomingChanges, autoMigration }, onBpmnDeployed) {
  const { entry } = target

  try {
    const bpmnParsedData = await getBpmnData({ bpmn: entry, resourcesPath, incomingChanges })

    if (!bpmnParsedData.hasChanged) return

    const { data } = await CamundaAPI.deploy(bpmnParsedData)

    if (autoMigration) {
      const [processDefinition] = Object.values(data.deployedProcessDefinitions)
      await migrateInstances({
        processDefinitionId: processDefinition.id,
        processDefinitionKey: processDefinition.key
      })
    }

    if (onBpmnDeployed) onBpmnDeployed('camunda run')
  } catch (error) {
    logger(`${error?.message}: ${error.response?.data?.message || error.response?.status || '-'}`, {
      level: 'error',
      error,
      entry,
      script: 'lib\\scripts\\deploy.mjs',
      printStackError: false
    })
  }
}

async function migrateInstances ({ processDefinitionId, processDefinitionKey }) {
  const instances = await CamundaAPI.getAllInstances({ processDefinitionKey })

  if (!instances.length) return

  const activities = await findAllActivities(instances)
  const migrationPlans = createMigrationPlans({ processDefinitionId, activities })
  const messageRef = activities.length > 1 ? 'activities' : 'activity'

  await Promise.all(migrationPlans.map(plan => CamundaAPI.executeMigration(plan)))

  logger('💫 [artifact] migrated to a new definition [output]', {
    output: processDefinitionId,
    artifact: `${activities.length} ${messageRef}`
  })
}

async function findAllActivities (instances) {
  const activities = await Promise.all(instances.map(({ id }) => CamundaAPI.getInstanceActivities(id)))
  const migratableActivities = []

  filterMigratableActivities(activities)

  return migratableActivities

  function filterMigratableActivities (activities) {
    activities.forEach(activity => {
      if (MIGRATABLE_ACTIVITIES_TYPES.includes(activity.activityType)) {
        migratableActivities.push({
          activityId: activity.activityId,
          processDefinitionId: activity.processDefinitionId,
          processInstanceId: activity.processInstanceId
        })
      }
      if (activity.childActivityInstances.length) {
        filterMigratableActivities(activity.childActivityInstances)
      }
    })
  }
}

function createMigrationPlans ({ processDefinitionId, activities }) {
  const instancesByDefinitionId = activities.reduce((groupedInstances, instance) => {
    const currentGroup = groupedInstances[instance.processDefinitionId]
    if (!currentGroup) {
      groupedInstances[instance.processDefinitionId] = {
        activities: new Set([instance.activityId]),
        instances: new Set([instance.processInstanceId])
      }
    } else {
      currentGroup.activities.add(instance.activityId)
      currentGroup.instances.add(instance.processInstanceId)
    }
    return groupedInstances
  }, {})

  const plans = Object.entries(instancesByDefinitionId)
    .map(([sourceDefinitionId, props]) => ({
      migrationPlan: {
        sourceProcessDefinitionId: sourceDefinitionId,
        targetProcessDefinitionId: processDefinitionId,
        instructions: [...props.activities].map(activityId => ({
          sourceActivityIds: [activityId],
          targetActivityIds: [activityId]
        }))
      },
      processInstanceIds: [...props.instances]
    }))

  return plans
}
