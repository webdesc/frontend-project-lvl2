import fs from 'fs';
import path from 'path';

import gendiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__tests__', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('plain equals', () => {
  const before = JSON.parse(readFile('before.json'));
  const after = JSON.parse(readFile('after.json'));
  const result = ' host: hexlet.io\n - timeout: 50\n + timeout: 20\n - proxy: 123.234.53.22\n - follow: false\n + verbose: true';
  expect(gendiff(before, after)).toBe(result);
});
