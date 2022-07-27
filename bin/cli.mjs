#!/usr/bin/env node
import { Command } from 'commander'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const BakerCli = new Command()

BakerCli
  .version(pkg.version)
  .description('Camunda Baker - CLI for making Tasklist embedded forms easier')
  .option('-c, --config', 'specify the config file, defaults to camunda-config.js')
  .command('dev', 'starts a development server and watchers', { isDefault: true })
  .alias('serve')
  .parse(process.argv)
