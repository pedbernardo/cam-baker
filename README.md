<h1 align="center">
  <br>
  <img
    src="./img/zeev-run-badge.png"
    alt="Zeev Run Badge - Person running fast emoji inside a glowing purple hexagon"
  >
  <p>Camunda Baker</p>

  [![NPM](https://img.shields.io/npm/v/zeev-run)](https://www.npmjs.com/package/zeev-run)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</h1>

<p align="center">
  Construa projetos mais rápido com <strong>Zeev Run</strong>, um CLI frontend <em>não-oficial</em> construído especialmente para o <a href="http://zeev.it" target="_blank">Zeev</a>.
</p>

<p align="center">
  <em>em breve documentação e maiores detalhes</em>
</p>

<p align="center">
  <a href="#instalação">Instalação</a> |
  <a href="#quero-testar">Quero Testar</a>
</p>

<br>

## Features
- Local Server para assets (`.js` e `.scss`)
- Livereload e Watch Mode
- Mock Server
- Arquivos `.env` por ambiente (`prd`, `qa`, `dev`, `local`)
- Suporte a Saas
- Suporte a Post-HTML
- Javascript Bundle
- Zero-Config
- e mais...

<br></br>

## Instalação
### Usar via NPM

```bash
npm install zeev-run

# ou com yarn

yarn add zeev-run
```
## Quero Testar

**Atenção:** o projeto ainda está em andamento, fora da versão v1.0.0, então o funcionamento, API, configurações e comandos devem sofrer alterações. Ainda não é aconselhado o uso em produção.

Ainda assim, se você quiser experimentar, após instalar no seu projeto, basta executar o Zeev Run no seu terminal pelo comando abaixo.

```bash
npx zeev
```

Ou então adicione ao seu `package.json` um script para inicializar o CLI.

**package.json**
```json
{
  "scripts": {
    "dev": "zeev"
  }
}
```

E execute seu script pelo terminal
```bash
npm run dev

# ou com yarn

yarn dev
```

Crie então um diretório chamado `src` na raíz do seu projeto e basta adicionar os arquivos `.js`, `.css` e `.html`. Utilize o padrão de nomes abaixo para os arquivos e nenhuma configuração adicional será necessária.

**Padrões de Nome**
- index{.js, .scss, .html}
- main{.js, .scss, .html}
- app{.js, .scss, .html}
- script.js
- style.scss
- form.html

<br>

### Comandos
- zeev dev (alias: zeev serve ou apenas zeev)
- zeev build (_não implementado_)
- zeev create (_não implementado_)
- zeev help

#### Parâmetros
- --config ou -c - caminho do arquivo de configuração (padrão: `./zeev-config.js`)

<br>

### Configurações
Enquanto não temos documentação, use o Intelisense do seu editor (caso suporte tipos) para explorar as configurações com o uso da função `defineConfig`

<br>

**zeev-config.js**
```js
import { defineConfig } from 'zeev-run'

export default defineConfig({
  // ...
})
```
