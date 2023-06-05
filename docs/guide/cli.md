# CLI
To run any command from the CLI you need to add a NPM Script or run the binary direct from your terminal, for the last option you first need to enter into the project directory into the terminal.

Example:
::: code-group
```sh [npm script]
$ npm run dev
```
```sh [cli]
$ cd "your/project/path"
$ npx baker
```
:::

## Avaliable Commands
|Command    |Example     |Description|
|-----------|------------|-----------|
|`<default>`|baker       |initialize CLI watchers and services|
|dev        |baker dev   |same as above `baker` default command|
|build      |baker build |build entry files into standalone html files for Camunda Tasklist|
|help     |baker help  |show CLI commands and options|

## Custom Config File
If you want to use a different config filename or put the config file into a custom directory, just add the option `-c` or `--config` to the dev command.

::: code-group
```json{3} [npm script]
{
  "scripts": {
    "dev": "baker --config config/my-custom-config-file.js",
    "build": "baker build",
    "stop": "baker stop"
  }
}
```
```sh [cli]
$ npx baker --config config/my-custom-config-file.js
```
:::
