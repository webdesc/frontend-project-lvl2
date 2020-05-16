#!/usr/bin/env node

import generateDiff from '..';

const { program } = require('commander');
const path = require('path');

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    try {
      const beforeConfigPath = path.resolve(process.cwd(), firstConfig);
      const afterConfigPath = path.resolve(process.cwd(), secondConfig);
      const result = generateDiff(beforeConfigPath, afterConfigPath, program.format);
      console.log(result);
    } catch (e) {
      console.error(e.message);
    }
  })
  .option('-f, --format [type]', 'output format', 'pretty');

program.parse(process.argv);
