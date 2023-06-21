# General Configuration
By running the `dev` command from the terminal, Camunda Baker leverage the zero-config approach and will start running using a set of default configurations. The idea is that you can modify the configurations as specific needs arise.

When that happens, you just need to put a `camunda.config.js` at your project root directory. Below is the basic form of the file.

::: code-group
```js [camunda.config.js]
export default {
  // config options
}
```
:::

::: info Custom config file
If you want you can modify the config file name and path, check [here](/guide/cli#custom-config-file) how to.
:::

Important to notice that Camunda Baker uses node native ESM Modules, that implies you must use `"type:" "module"` in your `package.json`.

## Config Intellisense

Camunda Baker ships with JSDoc annotations, so you can automatically levarage your IDE's intellisense, just by using de `defineConfig` function instead exporting a plain object.

::: code-group
```js [camunda.config.js]
import { defineConfig } from 'cam-baker'

export default defineConfig({
  // using `defineConfig` enables support for editor intellisense
})
```
:::
