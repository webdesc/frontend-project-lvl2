#!/usr/bin/env node

import genDiff from '..';
import ConfigFactory from '../ConfigFactory';

const { program } = require('commander');
const path = require('path');

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const firstConfigPath = path.resolve(process.cwd(), firstConfig);
    const secondConfigPath = path.resolve(process.cwd(), secondConfig);
    const beforeConfig = ConfigFactory.factory(firstConfigPath);
    const afterConfig = ConfigFactory.factory(secondConfigPath);
    const diff = genDiff(beforeConfig, afterConfig).split('\n');
    console.log('{');
    const hasFieldChanged = (first) => first === '+' || first === '-';
    diff.forEach((item) => {
      const spaces = hasFieldChanged(item[0]) ? ' ' : '   ';
      console.log(spaces + item);
    });
    console.log('}');
  })
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
