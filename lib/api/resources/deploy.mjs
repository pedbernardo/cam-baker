import FormData from 'form-data'
import { createReadStream } from 'node:fs'
import { basename } from 'node:path'
import http from '../http-client.mjs'

/**
 * Deploy `.bpmn` to Camunda Run
 * @param {BpmnParsedData} BpmnData
 * @return {Promise}
 */
export function deploy (BpmnData) {
  const form = createDeployForm(BpmnData)
  return http.post('/deployment/create', form, { headers: form.getHeaders() })
}

/**
 * Creates FormData for deploy endpoint
 * @param {Object} params
 * @param {String} params.filepath - BPMN filepath
 * @param {String} params.filename - BPMN filename
 * @param {String[]} params.resources - BPMN resources filepaths
 * @returns
 */
function createDeployForm ({ filepath, filename, resources }) {
  const form = new FormData()

  form.append('deployment-name', `${filename} auto-deploy`)
  form.append('deployment-source', 'cam-baker-starter')
  form.append('diagram', createReadStream(filepath))

  resources.forEach(resourcePath => {
    form.append(basename(resourcePath), createReadStream(resourcePath))
  })

  return form
}
