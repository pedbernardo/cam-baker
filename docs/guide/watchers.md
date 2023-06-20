# Watchers
Specify watch config for Node [chokidar](https://github.com/paulmillr/chokidar) package. The only avaliable specific property is `buildOnWatch`, used to force build command on every file change, what could be useful on Camunda Spring projects that can "hot reload" HTML `embedded:app:forms` by itself.

## watch.buildOnWatch
- **Type:** `boolean`
- **Default:** `false`

Force build command on every file change.

::: code-group
```js{3} [camunda.config.js]
export default {
  watch: {
    buildOnWatch: true
  }
}
```
:::
