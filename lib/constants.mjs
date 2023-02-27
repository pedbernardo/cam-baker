export const WATCH_GLOBS = {
  any: './src/**/*.{js,jsx,html,scss}',
  html: './src/**/*.html',
  js: './src/**/*.{js,jsx}',
  sass: './src/**/*.scss',
  bpmn: './camunda/resources/**/*.bpmn'
}

/**
 * Default Camunda Baker configuration filename
 */
export const CONFIG_FILENAME = 'camunda.config.js'

/**
 * Embedded forms folder name within `src` folder
 */
export const FORMS_FOLDER = 'forms'

/**
 * Camunda Baker base template folder
 */
export const TEMPLATE_PATH = 'lib/template'

/**
 * Camunda Run project configuration folder when
 * using `camundaRun` config with Camunda Baker
 */
export const CAMUNDA_RUN_LOCAL_PATH = './camunda'

/**
 * Camunda Run project resources folder when
 * using `camundaRun` config with Camunda Baker
 */
export const CAMUNDA_RUN_RESOURCES_PATH = `${CAMUNDA_RUN_LOCAL_PATH}/resources`

/**
 * Camunda Run default port used when not declared on
 * `default.yml` configuration file
 */
export const CAMUNDA_RUN_DEFAULT_PORT = 8080

/**
 * Camunda Run Distribution downloaded folder when using
 * `camundaRun` config with Camunda Baker
 */
export const CAMUNDA_RUN_BIN_FOLDER = '.run-camunda'
