# Shared Configuration
Customize the general configuration like output directories and entry points filenames.

## outDir
- **Type:** `string`
- **Default:** `./dist`

Changes the output directory for the bunbled final HTML files for Camunda Tasklist.

::: code-group
```js{2} [camunda.config.js]
export default {
  outDir: './build'
}
```
:::

## publicDir
- **Type:** `string`
- **Default:** `./public`

Changes the local server directory for static files served and watched when using dev command. When developing, individual bundled `.js` and `.css` files will be served to Camunda Tasklist, that approach enables the usage of live modifications without new deploys for non Spring projects.

::: code-group
```js{2} [camunda.config.js]
export default {
  publicDir: './local'
}
```
:::

## entryPoints
- **Type:** `object`
- **Default:** `see below`

Changes the name patterns for entry files to lookup on each task folder. By default those entry files will be watched to generate the bundled and builded files. You can modify partially, changing only the entry files wanted.

**Default Entry Points**
```js
{
  js: 'main.js',
  jsx: 'main.jsx',
  scss: 'style.scss',
  html: 'index.html'
}
```

::: code-group
```js{2-5} [camunda.config.js]
export default {
  entryPoints: {
    js: 'app.js',
    html: 'app.html'
  }
}
```
:::
