#!/usr/bin/env node

const { program } = require('commander');

program.on('--help', () => {
  console.log('');
  console.log('Compares two configuration files and shows a difference.');
});

program.parse(process.argv);
