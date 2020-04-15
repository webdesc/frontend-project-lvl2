import path from 'path';

import ConfigFactory from '../src/ConfigFactory';
import gendiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const plainEqualsResult = 'host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true';

test('plain equals json', () => {
  const before = ConfigFactory.factory(getFixturePath('before.json'));
  const after = ConfigFactory.factory(getFixturePath('after.json'));
  expect(gendiff(before, after)).toBe(plainEqualsResult);
});

test('plain equals yaml', () => {
  const before = ConfigFactory.factory(getFixturePath('before.yml'));
  const after = ConfigFactory.factory(getFixturePath('after.yml'));
  expect(gendiff(before, after)).toBe(plainEqualsResult);
});

test('plain equals ini', () => {
  const before = ConfigFactory.factory(getFixturePath('before.ini'));
  const after = ConfigFactory.factory(getFixturePath('after.ini'));
  expect(gendiff(before, after)).toBe(plainEqualsResult);
});
