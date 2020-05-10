#!/usr/bin/env node

import generateDiff from '..';
import configFactory from '../configFactory';

const { program } = require('commander');
const path = require('path');

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    try {
      const firstConfigPath = path.resolve(process.cwd(), firstConfig);
      const secondConfigPath = path.resolve(process.cwd(), secondConfig);
      const beforeConfig = configFactory(firstConfigPath);
      const afterConfig = configFactory(secondConfigPath);
      const result = generateDiff(beforeConfig, afterConfig, program.format);
      console.log(result);
    } catch (e) {
      console.error(e.message);
    }
  })
  .option('-f, --format [type]', 'output format', 'pretty');

program.parse(process.argv);
