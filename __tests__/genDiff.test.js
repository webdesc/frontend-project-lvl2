import path from 'path';

import ConfigFactory from '../src/ConfigFactory';
import generateDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const prettyEqualsResult = `{
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

const jsonEqualsResult = '[{"name":"common","value":null,"status":"nochanged","childrens":[{"name":"follow","value":false,"status":"added"},{"name":"setting1","value":"Value 1","status":"nochanged"},{"name":"setting2","value":200,"status":"removed"},{"name":"setting3","value":{"key":"value"},"oldValue":true,"status":"modified"},{"name":"setting4","value":"blah blah","status":"added"},{"name":"setting5","value":{"key5":"value5"},"status":"added"},{"name":"setting6","value":null,"status":"nochanged","childrens":[{"name":"key","value":"value","status":"nochanged"},{"name":"ops","value":"vops","status":"added"}]}]},{"name":"group1","value":null,"status":"nochanged","childrens":[{"name":"baz","value":"bars","oldValue":"bas","status":"modified"},{"name":"foo","value":"bar","status":"nochanged"},{"name":"nest","value":"str","oldValue":{"key":"value"},"status":"modified"}]},{"name":"group2","value":{"abc":12345},"status":"removed"},{"name":"group3","value":{"fee":100500},"status":"added"}]';

test('pretty equals json format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.json'));
  const after = ConfigFactory.factory(getFixturePath('after.json'));
  const result = generateDiff(before, after);
  expect(result).toBe(prettyEqualsResult);
});

test('pretty equals yaml format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.yml'));
  const after = ConfigFactory.factory(getFixturePath('after.yml'));
  const result = generateDiff(before, after);
  expect(result).toBe(prettyEqualsResult);
});

test('pretty equals ini format', () => {
  const before = ConfigFactory.factory(getFixturePath('before.ini'));
  const after = ConfigFactory.factory(getFixturePath('after.ini'));
  const result = generateDiff(before, after);
  expect(result).toBe(prettyEqualsResult);
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
