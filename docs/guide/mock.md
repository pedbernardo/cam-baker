# Mock Server
Enables a powerful mock server using [json-server](https://github.com/typicode/json-server) package. See the usage possibilities in the json-sever [official documentation](https://github.com/typicode/json-server).

## mocks.port
- **Type:** `number`
- **Default:** `8282`

Changes the default mock server port. Note if the port is already in use the local server won't work, and you will see an error prompt at the terminal.

::: code-group
```js{3} [camunda.config.js]
export default {
  mocks: {
    port: 3232 // my new mock port
  }
}
```
:::

## mocks.delayInMs
- **Type:** `number`
- **Default:** `1000`

Specifies the mock server response time in milliseconds. Usually useful for testing loading states, instead of automatic responses.

::: code-group
```js{3} [camunda.config.js]
export default {
  mocks: {
    delayInMs: 5000 // wait 5 seconds to resolve requests
  }
}
```
:::

## mocks.route
- **Type:** `string`
- **Default:** `/mocks/api`

Changes the default mounting path of the mock server. By default your mock server endpoints will be available at `http://127.0.0.1:8282/mocks/api/<your resource>`.

::: code-group
```js{3} [camunda.config.js]
export default {
  mocks: {
    route: '/' // set your endpoints to root, http://127.0.0.1:8282/<resource>
  }
}
```
:::

## mocks.file
- **Type:** `string`
- **Default:** `./mocks/db.json`

Defines the path and filename to lookup for the `json-server` resources and endpoints.

::: code-group
```js{3} [camunda.config.js]
export default {
  mocks: {
    file: './fake.json' // change the filename and use the root directory
  }
}
```
:::
