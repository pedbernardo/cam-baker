import http from '../http-client.mjs'

/**
 * Execute a Migration Plan
 * @param {Object} params - configuration
 * @return {Promise<Object>}
 */
export function executeMigration (params) {
  return http.post('/migration/execute', params)
    .then(({ data }) => data)
}
