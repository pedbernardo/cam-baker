import * as CamundaDeploy from './resources/deploy.mjs'
import * as CamundaMigration from './resources/migration.mjs'
import * as CamundaInstances from './resources/instances.mjs'

export const CamundaAPI = {
  ...CamundaDeploy,
  ...CamundaMigration,
  ...CamundaInstances
}
