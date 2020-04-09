#!/usr/bin/env node

import genDiff from '..';

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfigPath, secondConfigPath) => {
    const fullFirstConfigPath = path.resolve(process.cwd(), firstConfigPath);
    const fullSecondConfigPath = path.resolve(process.cwd(), secondConfigPath);
    const beforeConfig = JSON.parse(fs.readFileSync(fullFirstConfigPath));
    const afterConfig = JSON.parse(fs.readFileSync(fullSecondConfigPath));
    const diff = genDiff(beforeConfig, afterConfig);
    console.log('{');
    console.log(diff);
    console.log('}');
  })
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
