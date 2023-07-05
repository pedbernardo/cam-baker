/**
 * BpmnData parsed object data
 * @typedef {Object} BpmnParsedData
 * @property {String} filepath - `.bpmn` origin filepath
 * @property {String} filename - `.bpmn` origin filename
 * @property {String} content - `.bpmn` origin file content
 * @property {String[]} resources - `.bpmn` external resources filenames (embedded forms and scripts)
 * @property {Boolean} hasChanged - checks if `incomingChanges` resources files are included on `.bpmn` resources
 */
