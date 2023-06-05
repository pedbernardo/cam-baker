# Installation
Camunda Baker can be used to start a new project or into existing projects. The main idea is to use a separate project, exclusively for the forms.

## Creating new projects
You can easily start new projects using the following command into your terminal, this will start a wizard with a few questions.

::: code-group
```sh [npm]
$ npm create baker
```
```sh [yarn]
$ yarn create baker
```
```sh [pnpm]
$ pnpm create baker
```
:::

## Add to existing projects
If you already have a dedicated frontend project, you can integrate to your current workflows. Just install the Camunda Baker CLI as a dev dependency.

::: code-group
```sh [npm]
$ npm install -D cam-baker
```
```sh [yarn]
$ yarn add -D cam-baker
```
```sh [pnpm]
$ pnpm install -D cam-baker
```
:::

## Using the CLI

If you used the scaffold you already have a few NPM Scripts to start developing or building your project, otherwise, you can add the follow commands to your **package.json** file:

```json{3-5} [package.json]
{
  "scripts": {
    "dev": "baker",
    "build": "baker build",
    "stop": "baker stop"
  }
}
```

Although the ideal use is to integrate Camunda Baker with your NPM Scripts, you can call the CLI directly from your terminal, being in the project folder, just use the commands:

::: code-group
```sh [dev]
$ npx baker dev
```
```sh [build]
$ npx baker build
```
```sh [stop]
$ npx baker stop
```
:::

Learn more about the [Command Line Interface (CLI)](/guide/cli)
