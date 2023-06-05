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
  <a href="#Configuration">Configuration</a> |
  <a href="#Motivation">Motivation</a>
</p>

<br>
<br>

<p align="center">
<img
  src="./img/hand-icon.png"
  alt="Hand icon"
/><br>
<strong>Easy to use</strong><br>
<sub>
  Take advantage of a zero-config approach, just install the CLI and start using.
</sub><br>
<sup>
  Need some tweaks or additional features? Add a simple configuration file.
</sup>
</p>

<br>

<p align="center">
<img
  src="./img/plug-icon.png"
  alt="Plug icon"
/><br>
<strong>Static & Mock Servers</strong><br>
<sub>
  Use external javascript and css when developing, powered by live-server.
</sub><br>
<sup>
  Need API calls? Just drop a json file for fake API routes, powered by json-server.
</sup>
</p>

<br>

<p align="center">
<img
  src="./img/tools-icon.png"
  alt="Tools icon"
/><br>
<strong>Modern toolbox</strong><br>
<sub>
  Get support for JS and JSX bundles, Sass styling and Post-html out of the box.
</sub><br>
<sup>
  Use ESM modules, Post-html partials and expressions and Sass from begining.
</sup>
</p>

<br>

<p align="center">
<img
  src="./img/refresh-icon.png"
  alt="Refresh icon"
/><br>
<strong>Live reloading</strong><br>
<sub>
  Get instant feedback on browser when developing, powered by live-reload.
</sub><br>
<sup>
  No need for page refreshing anymore, just code.
</sup>
</p>

<br>

<p align="center">
<img
  src="./img/package-icon.png"
  alt="Package icon"
/><br>
<strong>Build for production</strong><br>
<sub>
  When finished, bundle your files into one single entry HTML file per task.
</sub><br>
<sup>
  Optimize your bundle size with minification using esbuild, sass and html nano.
</sup>
</p>

<br>

## Installation
### Using NPM

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

#### **outDir** (String) | Default: `./dist`
Specify the output directory of build final HTML files for Camunda Tasklist.
```js
export default { outDir: './build' }
```

<br>

#### **publicDir** (String) | Default: `./public`
Specify the static served directory of bundled files from `src` when watching using dev command.
```js
export default { publicDir: './server' }
```

<br>

#### **entryPoints** (Object) | Default: _see below_
Specify the name patterns for entry files when you want to use `zero-config` approach. Alternatively you can use the `src` property to indicate directly your entry files.

**Default**
```js
export default {
  entryPoints: {
    js: 'main.js',
    jsx: 'main.jsx',
    scss: 'style.scss',
    html: 'index.html'
  }
}
```

**Example**
```js
export default {
  entryPoints: {
    js: 'app.js',
    html: 'app.html'
  }
}
```

<br>

#### **watch** (Object) | Default: _see below_
Specify watch config for Node [chokidar](https://github.com/paulmillr/chokidar) package. The only specific property is `buildOnWatch`, used to force build command on every file change, what could be useful on Camunda Spring projects that can "hot reload" HTML `embedded:app:forms`

**Default**
```js
export default {
  watch: {
    ignoreInitial: true,
    buildOnWatch: false // indicates to run build only explicitly when using build command
  }
}
```

**Example**
```js
export default {
  watch: {
    buildOnWatch: true // indicates to run build on every file change
  }
}
```

<br>

#### **env** (Object) | Default: _see below_
Specify .env configuration of [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) package. The only specific property is `envPrefix`, used to define the prefix pattern for variables injected on javascript bundle. Has support for multiple env files (`env.development`, `env.production`) for contextual variables when setting `NODE_ENV` variable on NPM Scripts.

**Default**
```js
export default {
  env: {
    path: './config', // directory for .env files
    envPrefix: 'PUBLIC_' // default name prefix for .env variables injected on javascript bundle
  }
  
}
```

**Example**
```js
export default {
  env: {
    path: './env',
    envPrefix: 'APP_'
  }
}
```

**Usage**
```js
const BASE_API_URL = process.env.APP_BASE_API_URL
```

<br>

#### **server** (Object) | Default: _see below_
Enables static server hosting using [live-server](https://github.com/tapio/live-server) and livereload functionality using [livereload](https://github.com/napcs/node-livereload).

**Default**
```js
export default {
  server: {
    port: 8181, // static server port
    livereload: true // enables livereload usage
  }
}
```

**Example**
```js
export default {
  server: {
    port: 3232,
    livereload: false
  }
}
```

<br>

#### **mocks** (Object) | Default: _see below_
Enables mock server using [json-server](https://github.com/typicode/json-server).

**Default**
```js
export default {
  mocks: {
    port: 8282, // mock server port
    delayInMs: 1000, // response delay
    route: '/mocks/api', // json-server root path
    file: './mocks/db.json' // json-server filepath
  }
}
```

**Example**
```js
export default {
  mocks: {
    port: 3333,
    delayInMs: 5000,
    route: '/api',
    file: './mocks.json'
  }
}
```

<br>

### Configuration File Example

**camunda.config.js**
```js
import { defineConfig } from 'cam-baker'

export default defineConfig({
  // using `defineConfig` enables support for editor intelisense
  // ...
})
```

## Suggest project structure
```bash
camunda.config.js

config/
  .env
  .env.development
  .env.production

mocks/
  db.json

src/
  forms/
    task-name-a/  # separate resources by tasks
      index.html
      main.js
      style.scss

    task-name-b/
      index.html
      main.js

    process-name-y/  # or even by flows and tasks
      task-name-yz/
        index.html
        main.js
        style.scss

  styles/
    shared-style.scss

  js/
    shared-script.js
```

See the boilerplate [repository example](https://github.com/pedbernardo/cam-baker-starter)

<br>

## Using CLI resources

#### `Mock Server`
Just drop a `db.json` file on a `./mocks` folder. See usage examples on [json-server](https://github.com/typicode/json-server).

Example file `mocks/db.json`
```json
{
  "sample": {
    "status": 200,
    "content": "hello world"
  }
}
```

Then just hit the mock api URL
> curl http://localhost:8282/mocks/api/sample

_JSON Server also supports POST/PUT/PATCH/DELETE calls_

<br>

Or call the endpoint during any Javascript file
```js
fetch('http://localhost:8282/mocks/api/sample')
  .then(res => res.json())
  .then(console.log)
```

<br>

#### `Livereload`
Livereload just works out of the box when running `baker dev` command. When bundles the HTML files in dev mode a `<script>` tag will be injected on the form, that script will connect to Livereload using WebSockets. Any changes on CSS files must be reflect without reloads, but Javascript changes will trigger a full page reload (it's the main difference between LiveReload and Hot Module Replacement, the last, sadly is the modern approach and more complex to integrate).

**Important:** HTML files changes will not be reflected automatically, and will demand new deployments to Camunda. If your project can use Camunda Spring, this can be mitigated, but if you are restricted to Camunda Run, no workaround was found yet.

<br>

#### `Env Files`
Just drop a `.env` file on a `./config` folder. See usage examples on [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow).

<br>

#### `Sass`
Just add your `.scss` files (no support for .sass extension) inside `./src` folder. You need to define separetelly entry files for every task form, but you can work with a centralized Sass file and just import that file.

See the boilerplate [repository example](https://github.com/pedbernardo/cam-baker-starter)

**Important**: for performance reasons, note that the Sass styles will be converted into a `<style></style>` inside the Task HTML file, and those wont be cached by the browser. If you are using shared styles, prefer import that using Tasklist [Custom Scripts](https://docs.camunda.org/manual/latest/webapps/tasklist/configuration/#custom-scripts).

<br>

#### `Javascript, Typescript, JSX, TSX`
Just add your `.js` or `.jsx` files inside `./src` folder. You need to define separetelly entry files for every task form, but you can work with shared modules/helpers and import on the tasks they are needed.

See the boilerplate [repository example](https://github.com/pedbernardo/cam-baker-starter)

<br>

#### `HTML and PostHTML`
Just add your `.html` files inside `./src` folder. You need to define separately entry files for every task form, but you can work with PostHTML partials using `<include src="forms/partial.html"></include>` [posthtml-include](https://github.com/posthtml/posthtml-include).

See the boilerplate [repository example](https://github.com/pedbernardo/cam-baker-starter)

Avaliable and pre-configured PostHTML Plugins
- [posthtml-include](https://github.com/posthtml/posthtml-include)
- [posthtml-expressions](https://github.com/posthtml/posthtml-expressions)

<br>

#### `Watchers`
Just start `baker` or `baker dev` command. All `.js`, `.jsx`, `.html` and `.scss` inside the `src` folder will be wached for changes and run bundles when needed.

<br>

## Motivation
`Todo` ... But, in summary: enables usage of more modern approaches when developing for Camunda Tasklist, even allowing usage of React with JSX/TSX (powered by ESBuild).

<br>

## Next Steps
- Validate the idea throwing the repo for Camunda and dev community
- Add more detailed usage instructions, specially on how to handle deploys with `./public` and `./dist` artifacts
- Add more detailed usage instructions when running Camunda from a Spring Project (no need for `./public`)
- Add a minimal test coverage
- Evaluate usage of Vite with custom plugins/configuration instead low level implementations

