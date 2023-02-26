#!/usr/bin/env node
import { startDevCommand } from '../lib/index.mjs'
import { Command } from 'commander'

const BakerDev = new Command()
  .parse(process.argv)

const configFile = BakerDev.args[0]

startDevCommand(configFile)
