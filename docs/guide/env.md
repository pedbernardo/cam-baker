# Env Variables
Specify `.env` configuration file using [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) package. Has support for multiple env files (`env.development`, `env.production`) for contextual variables when setting `NODE_ENV` variable on NPM Scripts.

## env.envPrefix
- **Type:** `string`
- **Default:** `PUBLIC_`

Defines the env variables prefix pattern for exposed env variables for client side usage.

::: code-group
```js{3} [camunda.config.js]
export default {
  env: {
    envPrefix: 'MY_NEW_PREFIX_'
  }
}
```
:::

Then just reference your environment variables according to the new prefix.
::: code-group
```bash [.env]
MY_NEW_PREFIX_API_URL="http://anyurl.com/api"
```
```js [some-js-file.js]
const BASE_API_URL = process.env.MY_NEW_PREFIX_API_URL
```
:::

## env.path
- **Type:** `string`
- **Default:** `./config`

Defines the directory to lookup for the `.env` files

::: code-group
```js{3} [camunda.config.js]
export default {
  env: {
    path: './' // example changing the .env files to the project root directory
  }
}
```
:::
