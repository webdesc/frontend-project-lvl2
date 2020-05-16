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
const prettyEqualsResult = fs.readFileSync(getFixturePath('resultPretty.txt')).toString().trim();
const plainEqualsResult = fs.readFileSync(getFixturePath('resultPlain.txt')).toString().trim();
const jsonEqualsResult = fs.readFileSync(getFixturePath('resultJson.txt')).toString().trim();

const getTestData = (expected) => ([
  [beforeJsonPath, afterJsonPath, expected],
  [beforeYamlPath, afterYamlPath, expected],
  [beforeIniPath, afterIniPath, expected],
]);

test.each(getTestData(prettyEqualsResult))('pretty equals all formats', (beforePath, afterPath, expected) => {
  const result = generateDiff(beforePath, afterPath);
  expect(result).toBe(expected);
});

test.each(getTestData(plainEqualsResult))('plain equals all formats', (beforePath, afterPath, expected) => {
  const result = generateDiff(beforePath, afterPath, 'plain');
  expect(result).toBe(expected);
});

test.each(getTestData(jsonEqualsResult))('json equals all formats', (beforePath, afterPath, expected) => {
  const result = generateDiff(beforePath, afterPath, 'json');
  expect(result).toBe(expected);
});
