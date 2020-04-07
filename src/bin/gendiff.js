#!/usr/bin/env node

import genDiff from '..';

const { program } = require('commander');
const path = require('path');

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfigPath, secondConfigPath) => {
    const fullFirstConfigPath = path.resolve(process.cwd(), firstConfigPath);
    const fullSecondConfigPath = path.resolve(process.cwd(), secondConfigPath);
    const diff = genDiff(fullFirstConfigPath, fullSecondConfigPath);
    console.log('{');
    console.log(diff);
    console.log('}');
  })
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
