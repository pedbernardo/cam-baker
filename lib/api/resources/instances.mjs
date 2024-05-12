import http from '../http-client.mjs'

/**
 * List all active instances on Camunda Run
 * @param {Object} params - configuration
 * @param {String} [params.processDefinitionId] - filter by processDefinitionId
 * @param {String} [params.processDefinitionKey] - filter by processDefinitionKey
 * @return {Promise<Object>}
 */
export function getAllInstances (params) {
  return http.post('/process-instance', params)
    .then(({ data }) => data)
}

/**
 * List all active activity instances of a given process instance on Camunda Run
 * @param {String} processInstanceId - filtered activity instances from instance id
 * @return {Promise<Object>}
 */
export function getInstanceActivities (processInstanceId) {
  return http.get(`/process-instance/${processInstanceId}/activity-instances`)
    .then(({ data }) => data)
}
