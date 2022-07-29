<h1 align="center">
  <br>
  <img
    src="./img/badge.png"
    alt="Camunda Baker Badge - Glowing smily bread"
  >
  <p>Camunda Baker</p>

  [![NPM](https://img.shields.io/npm/v/cam-baker)](https://www.npmjs.com/package/cam-baker)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
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

