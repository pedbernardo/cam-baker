<h1 align="center">
  <br>
  <img
    src="./img/badge.png"
    alt="Camunda Baker Badge - Glowing smily bread"
  >
  <p>Camunda Baker</p>

  [![CDN](https://data.jsdelivr.com/v1/package/gh/pedbernardo/cam-baker/badge)](https://www.jsdelivr.com/package/gh/pedbernardo/cam-baker)
  [![NPM](https://img.shields.io/npm/v/cam-baker)](https://www.npmjs.com/package/cam-baker)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</h1>

<p align="center">
  Build complex projects using Camunda Tasklist with <strong>Camunda Baker</strong>, a <a href="https://camunda.com" target="_blank">Camunda</a> <em>non-official</em> frontend CLI dedicated for building <a href="https://docs.camunda.org/manual/7.17/reference/forms/embedded-forms" target="_blank">embedded forms</a> with a modern stack.
</p>

<p align="center">
  <a href="#Installation">Installation</a> |
  <a href="#How-to-use">How to use</a> |
  <a href="#Configuration">Configuration</a> |
  <a href="#Motivation">Motivation</a>
</p>

<br>

<img
  src="./img/hand-icon.png"
  alt="Hand icon"
/><br>
**Easy to use**<br>
<sub>
  Take advantage of a zero-config approach, just install the CLI and start using.
</sub><br>
<sup>
  Need some tweaks or additional features? Add a simple configuration file.
</sup>

<br>

<img
  src="./img/plug-icon.png"
  alt="Plug icon"
/><br>
**Static & Mock Servers**<br>
<sub>
  Use external javascript and css when developing, powered by live-server.
</sub><br>
<sup>
  Need API calls? Just drop a json file for fake API routes, powered by json-server.
</sup>

<br>

<img
  src="./img/tools-icon.png"
  alt="Tools icon"
/><br>
**Modern toolbox**<br>
<sub>
  Get support for JS and JSX bundles, Sass styling and Post-html out of the box.
</sub><br>
<sup>
  Use ESM modules, Post-html partials and expressions and Sass from begining.
</sup>

<br>

<img
  src="./img/refresh-icon.png"
  alt="Refresh icon"
/><br>
**Live reloading**<br>
<sub>
  Get instant feedback on browser when developing, powered by live-reload.
</sub><br>
<sup>
  No need for page refreshing anymore, just code.
</sup>

<br>

<img
  src="./img/package-icon.png"
  alt="Package icon"
/><br>
**Build for production**<br>
<sub>
  When finished, bundle your files into one single entry HTML file per task.
</sub><br>
<sup>
  Optimize your bundle size with minification using esbuild, sass and html nano.
</sup>

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
Todo...

```bash
npx baker
# or
npx baker build
```

**package.json**
```json
{
  "scripts": {
    "dev": "baker",
    "build": "baker build"
  }
}
```

<br>

## Configuration
Todo...

**camunda-config.js**
```js
import { defineConfig } from 'cam-baker'

export default defineConfig({
  // support for editor intelisense
})
```


```bash
npx baker --config my-custom-config-file.js
```

> --config or -c  for custom configuration file (default: `./camunda-config.js`)

<br>

## Motivation
Todo...

