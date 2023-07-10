import yaml from 'js-yaml'
import { join } from 'node:path'
import { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CAMUNDA_RUN_LOCAL_PATH, CAMUNDA_RUN_BIN_FOLDER, CAMUNDA_RUN_RESOURCES_PATH } from '../constants.mjs'

const DEFAULT_YML_PATH =
  join(process.cwd(), `${CAMUNDA_RUN_BIN_FOLDER}/dist/configuration/default.yml`)

const DEFAULT_YAML_HEADER = (
  '# Find more available configuration properties on the following pages of the documentation.\n' +
  '# https://docs.camunda.org/manual/latest/user-guide/camunda-bpm-run/#configure-camunda-bpm-run\n' +
  '# https://docs.camunda.org/manual/latest/user-guide/spring-boot-integration/configuration/#camunda-engine-properties\n\n'
)

const getRunConfigPath = () => `${CAMUNDA_RUN_LOCAL_PATH}/default.yml`

/**
 * Read and parse Camunda Run `default.yml` configuration file
 * @returns {Object} parsed `default.yml` config
 */
export function readRunConfig () {
  const configYamlPath = getRunConfigPath()

  return yaml.load(
    readFileSync(configYamlPath, 'utf-8')
  )
}

/**
 * Overwrites Camunda Run dist `default.yml` config file
 */
export function updateRunConfig () {
  const configYamlPath = getRunConfigPath()
  copyFileSync(configYamlPath, DEFAULT_YML_PATH)
}

/**
 * Create `default.yml` by copying Camunda RUn dist `default.yml` and
 * overwriting with Camunda Baker defaults
 */
export function createRunConfig () {
  const configDir = CAMUNDA_RUN_LOCAL_PATH
  const resourcesDir = CAMUNDA_RUN_RESOURCES_PATH
  const configYamlPath = getRunConfigPath()
  const rawYamlFile = readFileSync(DEFAULT_YML_PATH, 'utf-8')

  if (!existsSync(configDir)) {
    mkdirSync(configDir)
    mkdirSync(resourcesDir)
  }
  if (!existsSync(resourcesDir)) {
    mkdirSync(resourcesDir)
  }

  const cleanDefaultConfig = yaml.load(rawYamlFile)
  const bakerDefaultConfig = setupDefaultConfig(cleanDefaultConfig)

  copyFileSync(
    DEFAULT_YML_PATH,
    configYamlPath
  )
  writeFileSync(
    configYamlPath,
    `${DEFAULT_YAML_HEADER}${yaml.dump(bakerDefaultConfig)}`
  )
}

/**
 * Mutates Camunda Run `default.yml` config with Camunda Baker defaults:
 * - Disable Camunda Run example processes
 * - Disable CSP (Content Security Policy) to allow usage of LiveReload and script injecting
 * @see [MDN-CSP]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP}
 * @param {Object} yamlConfig - Camunda Run `default.yml` config
 * @returns {Object} Camunda Run config with Camunda Baker defaults
 */
function setupDefaultConfig (yamlConfig) {
  yamlConfig['camunda.bpm'].webapp = {
    'header-security': {
      'content-security-policy-disabled': true
    }
  }

  yamlConfig['camunda.bpm'].run.example.enabled = false

  return yamlConfig
}
