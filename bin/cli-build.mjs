#!/usr/bin/env node
import { startBuildCommand } from '../lib/index.mjs'
import { Command } from 'commander'

const BakerBuild = new Command()
  .parse(process.argv)

const configFile = BakerBuild.args[0]

startBuildCommand(configFile)
