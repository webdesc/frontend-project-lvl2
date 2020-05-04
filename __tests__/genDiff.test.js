import path from 'path';

import ConfigFactory from '../src/ConfigFactory';
import generateDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const jsonEqualsResult = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

const plainEqualsResult = `Property 'common.follow' was added with value: false
Property 'common.setting2' was deleted
Property 'common.setting3' was changed from true to [complex value]
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was changed from 'bas' to 'bars'
Property 'group1.nest' was changed from [complex value] to 'str'
Property 'group2' was deleted
Property 'group3' was added with value: [complex value]`;

test('json equals json format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.json'));
  const after = ConfigFactory.factory(getFixturePath('after.json'));
  const result = generateDiff(before, after, 'json');
  expect(result).toBe(jsonEqualsResult);
});

test('json equals yaml format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.yml'));
  const after = ConfigFactory.factory(getFixturePath('after.yml'));
  const result = generateDiff(before, after, 'json');
  expect(result).toBe(jsonEqualsResult);
});

test('json equals ini format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.ini'));
  const after = ConfigFactory.factory(getFixturePath('after.ini'));
  const result = generateDiff(before, after, 'json');
  expect(result).toBe(jsonEqualsResult);
});

test('plain equals json format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.json'));
  const after = ConfigFactory.factory(getFixturePath('after.json'));
  const result = generateDiff(before, after, 'plain');
  expect(result).toBe(plainEqualsResult);
});

test('plain equals yaml format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.yml'));
  const after = ConfigFactory.factory(getFixturePath('after.yml'));
  const result = generateDiff(before, after, 'plain');
  expect(result).toBe(plainEqualsResult);
});

test('plain equals ini format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.ini'));
  const after = ConfigFactory.factory(getFixturePath('after.ini'));
  const result = generateDiff(before, after, 'plain');
  expect(result).toBe(plainEqualsResult);
});
