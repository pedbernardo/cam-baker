import { XMLParser } from 'fast-xml-parser'
import { existsSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'

const BASE_BPMN_PARSER = {
  ignoreAttributes: false,
  ignoreDeclaration: true,
  stopNodes: ['*.bpmndi:BPMNDiagram']
}

const RESOURCES_BPMN_ATTRS_NAMES = [
  'camunda:formKey',
  'camunda:resource'
]

/**
 * Read and parse `.bpmn` XML file information
 * @param {Object} params
 * @param {String} params.bpmn - `.bpmn` filepath to parse
 * @param {String} params.resourcesPath - base path to lookup for resources linked to `.bpmn` files
 * @param {String[]} params.incomingChanges - list of resources that has been detect modifications
 * @returns {Promise<BpmnParsedData>} BpmnData parsed object data
 */
export async function getBpmnData ({ bpmn, resourcesPath, incomingChanges }) {
  const bpmnContent = readFileSync(bpmn)?.toString()
  const bpmnFilename = basename(bpmn)
  const resourceFiles = await parseBpmnResources(bpmnContent)
  const verifiedFiles = findBpmnResources(resourceFiles, resourcesPath)
  const hasChanged = checkIncomingChanges(resourceFiles, incomingChanges)

  return {
    filepath: bpmn,
    filename: bpmnFilename,
    content: bpmnContent,
    resources: verifiedFiles,
    hasChanged
  }
}

/**
 * Parses BPMN XML content extracting external resources filenames
 * @param {String} bpmnContent - .bpmn XML file content
 * @returns {Promise<String[]>} resources filenames
 */
function parseBpmnResources (bpmnContent) {
  const resources = []

  return new Promise((resolve) => {
    const bpmnParser = new XMLParser({
      ...BASE_BPMN_PARSER,
      attributeValueProcessor: (name, val, jPath) => {
        /** stops when gets to <bpmndi:BPMNDiagram> tag */
        if (jPath === 'bpmn:definitions.bpmndi:BPMNDiagram') resolve(resources)
        if (!RESOURCES_BPMN_ATTRS_NAMES.includes(name)) return

        const filename = val.replace('embedded:deployment:', '')

        resources.push(filename)
      }
    })
    bpmnParser.parse(bpmnContent)
  })
}

function findBpmnResources (resources, basePath) {
  return resources
    .map(filename => `${basePath}/${filename}`)
    .filter(filepath => existsSync(filepath))
}

function checkIncomingChanges (bpmnResources, incomingResources) {
  if (!incomingResources) return true

  return !!incomingResources.filter(incomingResource =>
    bpmnResources.includes(incomingResource)
  ).length
}
