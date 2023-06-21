<h1 align="center">
  <br>
  <img
    src="./img/badge.png#gh-light-mode-only"
    alt="Camunda Baker Badge - Glowing smiley bread"
  >
  <img
    src="./img/badge-dark.png#gh-dark-mode-only"
    alt="Camunda Baker Badge - Glowing smiley bread"
  >
  <p>Camunda Baker</p>

  [![NPM](https://img.shields.io/npm/v/cam-baker)](https://www.npmjs.com/package/cam-baker)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Netlify Status](https://api.netlify.com/api/v1/badges/6dd8f1fb-ff8b-4cb2-b332-ee82cade2d0c/deploy-status)](https://app.netlify.com/sites/cam-baker/deploys)
</h1>

<p align="center">
  Build complex projects using Camunda Tasklist, a <a href="https://camunda.com" target="_blank">Camunda</a> <em>non-official</em> frontend CLI<br>dedicated for building <strong>embedded forms</strong> with a modern stack.
</p>

<p align="center">
  <a href="#Installation">Installation</a> |
  <a href="#How-to-use">How to use</a> |
  <a href="#Configuration">Configuration</a>
</p>

<br>

<p align="center">
Visit the <a href="https://cam-baker.netlify.app" target="_blank">Documentation</a> for detailed instructions!
</p>

<br>

## Installation

```bash
npm install cam-baker

# or yarn

yarn add cam-baker
```

<br>

## How to use
Call CLI commands directly using `npx <command>` pattern:

```bash
npx baker dev
# or
npx baker build
# or
npx baker stop
```

Or create your own NPM Scripts on **package.json** to initilize and build the project
```json
{
  "scripts": {
    "dev": "baker",
    "build": "baker build",
    "stop": "baker stop"
  }
}
```

### Avaliable Commands
|Command    |Example     |Description|
|-----------|------------|-----------|
|`<default>`|baker -c config/my-config.js|initialize CLI watchers and services|
|dev        |baker dev   |same as above `baker` default command|
|build      |baker build |build entry files into standalone html files for Camunda Tasklist|
|stop       |baker stop  |stops Camunda Run server|
|help       |baker help  |show CLI commands and options|

**Custom Config Path and Filename:** `-c` or `--config`<br>
Used to indicate custom filename and path to the config file, needed when you don't want to use the default `camunda.config.js`.

```bash
npx baker --config config/my-custom-config-file.js
```

<br>

## Configuration

See the [Configuration Guide](https://cam-baker.netlify.app/guide/general)

<br>

### Configuration File Example

**camunda.config.js**
```js
import { defineConfig } from 'cam-baker'

export default defineConfig({
  // using `defineConfig` enables support for editor intellisense
})
```

<br>

## Next Steps
- Validate the idea throwing the repo for Camunda and dev community
- Add more detailed usage instructions, specially on how to handle deploys with `./public` and `./dist` artifacts
- Add more detailed usage instructions when running Camunda from a Spring Project (no need for `./public`)
- Add a minimal test coverage
- Evaluate usage of Vite with custom plugins/configuration instead low level implementations

