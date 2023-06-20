# Static Server
Enables a local static server using [live-server](https://github.com/tapio/live-server) package and livereload functionality using [livereload](https://github.com/napcs/node-livereload) package.

## server.port
- **Type:** `number`
- **Default:** `8181`

Changes the default local server port. Note if the port is already in use the local server won't work, and you will see an error prompt at the terminal.

::: code-group
```js{3} [camunda.config.js]
export default {
  server: {
    port: 3232 // my new server port
  }
}
```
:::

## server.livereload
- **Type:** `boolean`
- **Default:** `true`

Disables the functionality of livereload for your static files of the local server.

::: code-group
```js{3} [camunda.config.js]
export default {
  server: {
    livereload: false // disables livereload
  }
}
```
:::
