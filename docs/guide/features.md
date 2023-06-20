# Features
The whole point of Camunda Baker is precisely bring together in a CLI features commonly used in front-end projects, facilitating the construction of complex forms. But this does not imply re-creating the wheel, so the CLI is actually a collection of existing and well-established resources, integrated into a workflow designed especially for Camunda, with the complexity abstracted to a minimum configuration. See below what you get right away.

## Watchers
Just start `baker` or `baker dev` command. All `.js`, `.jsx`, `.html` and `.scss` inside the `src` folder will be wached for changes and run bundles when needed.

See configuration: [Watchers](/guide/watchers)

## HTML
Just add your `.html` files inside `./src` folder, powered by [PostHTML](https://github.com/posthtml/posthtml). You need to define separately entry files for every task form, but you can work with partials using:

```html
<include src="forms/partial.html"></include>
```

Avaliable and pre-configured PostHTML Plugins
- [posthtml-include](https://github.com/posthtml/posthtml-include)
- [posthtml-expressions](https://github.com/posthtml/posthtml-expressions)

## Javascript
Just add your `.js` or `.jsx` files inside `./src` folder. You need to define separetelly entry files for every task form, but you can work with shared modules/helpers and import on the tasks where they are needed, powered by [ESBuild](https://github.com/evanw/esbuild).

## Sass
Just add your `.scss` files (no support for `.sass` extension) inside `/src` folder. You need to define separetelly entry files for every task form, but you can work with a centralized Sass file and just import it per task, powered by [Sass](https://github.com/sass/sass).

## Env Variables
Get support for **env files** out of the box, just drop a `.env` file on a `./config` folder, powered by [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow).

See configuration: [Env Variables](/guide/env)

## Static Server
todo...

## Mock Server
Create fake API Calls easily, just drop a `db.json` file on a `./mocks` folder, powered by [json-server](https://github.com/typicode/json-server).

See configuration: [Mock Server](/guide/mock)

## Camunda Run
todo...
