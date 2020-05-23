import fs from 'fs';
import path from 'path';
import generateDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const beforeJsonPath = getFixturePath('before.json');
const beforeYamlPath = getFixturePath('before.yml');
const beforeIniPath = getFixturePath('before.ini');
const afterJsonPath = getFixturePath('after.json');
const afterYamlPath = getFixturePath('after.yml');
const afterIniPath = getFixturePath('after.ini');

let prettyEqualsResult;
let plainEqualsResult;
let jsonEqualsResult;

beforeAll(() => {
  prettyEqualsResult = fs.readFileSync(getFixturePath('resultPretty.txt')).toString().trim();
  plainEqualsResult = fs.readFileSync(getFixturePath('resultPlain.txt')).toString().trim();
  jsonEqualsResult = fs.readFileSync(getFixturePath('resultJson.txt')).toString().trim();
});

const getTestData = () => ([
  [beforeJsonPath, afterJsonPath],
  [beforeYamlPath, afterYamlPath],
  [beforeIniPath, afterIniPath],
]);

test.each(getTestData())('pretty equals all formats', (beforePath, afterPath) => {
  const result = generateDiff(beforePath, afterPath);
  expect(result).toBe(prettyEqualsResult);
});

test.each(getTestData())('plain equals all formats', (beforePath, afterPath) => {
  const result = generateDiff(beforePath, afterPath, 'plain');
  expect(result).toBe(plainEqualsResult);
});

test.each(getTestData())('json equals all formats', (beforePath, afterPath) => {
  const result = generateDiff(beforePath, afterPath, 'json');
  expect(result).toBe(jsonEqualsResult);
});
