#!/usr/bin/env node

const { program } = require('commander');

import genDiff from '../';

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const diff = genDiff(firstConfig, secondConfig);
    const diffs = diff.split('\n');
    console.log('{');
    diffs.forEach((item) => {
      console.log(` ${item}`);
    });
    console.log('}');
  })
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
