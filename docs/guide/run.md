# Camunda Run
Enables the use of [Camunda Run](https://docs.camunda.org/manual/7.19/user-guide/camunda-bpm-run/) directly from the Camunda Baker CLI, downloading, spinning up a server, deploying processes, migrating instances, all with right out the box.

## camundaRun
- **Type:** `boolean | object`
- **Default:** `false`

Enables the use of [Camunda Run](https://docs.camunda.org/manual/7.19/user-guide/camunda-bpm-run/) with the default configurations.

::: code-group
```js{2} [camunda.config.js]
export default {
  camundaRun: true
}
```
:::

## camundaRun.version
- **Type:** `string`
- **Default:** `7.19`

Changes the Camunda Run version downloaded and used by the Camunda Baker CLI.

::: code-group
```js{3} [camunda.config.js]
export default {
  camundaRun: {
    version: '7.17'
  }
}
```
:::

## camundaRun.autoDeploy
- **Type:** `boolean`
- **Default:** `false`

Enables auto-deploy feature, on every `.bpmn` or `.html` file change a new deploy will be made for you, avoiding back and forth when changing your html forms.

::: info 💡 Next Steps
The idea is that this feature will be used in conjunction with the auto-migration functionality, making the changes made to the html forms automatically reflected in instances already in progress on Tasklist
:::

::: code-group
```js{3} [camunda.config.js]
export default {
  camundaRun: {
    autoDeploy: true
  }
}
```
:::

## 🌱 camundaRun.autoMigration
- **Type:** `boolean`
- **Default:** `false`

::: warning Coming Soon!
Not implemented yet...
:::

Changes the default mock server port. Note if the port is already in use the local server won't work, and you will see an error prompt at the terminal.
