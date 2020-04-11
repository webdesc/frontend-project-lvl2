import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import gendiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__tests__', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const plainEqualsResult = ' host: hexlet.io\n - timeout: 50\n + timeout: 20\n - proxy: 123.234.53.22\n - follow: false\n + verbose: true';

test('plain equals json', () => {
  const before = JSON.parse(readFile('before.json'));
  const after = JSON.parse(readFile('after.json'));
  expect(gendiff(before, after)).toBe(plainEqualsResult);
});

test('plain equals yaml', () => {
  const before = yaml.safeLoad(readFile('before.yml'));
  const after = yaml.safeLoad(readFile('after.yml'));
  expect(gendiff(before, after)).toBe(plainEqualsResult);
});
