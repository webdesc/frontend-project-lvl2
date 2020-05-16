import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import sortAlphabet from './utils';
import getFormatter from './formatters';
import configFactory from './parsers';

const generateDiffAST = (before, after) => {
  const keys = Object.keys({ ...before, ...after });
  const diffAST = keys.reduce((acc, key) => {
    if (before[key] === after[key]) {
      return [...acc, {
        name: key,
        value: after[key],
        status: 'nochanged',
      }];
    }
    if (!_.has(before, key)) {
      return [...acc, {
        name: key,
        value: after[key],
        status: 'added',
      }];
    }
    if (!_.has(after, key)) {
      return [...acc, {
        name: key,
        value: before[key],
        status: 'removed',
      }];
    }
    if (before[key] !== after[key] && (!_.isObject(before[key]) || !_.isObject(after[key]))) {
      return [...acc, {
        name: key,
        value: after[key],
        oldValue: before[key],
        status: 'modified',
      }];
    }
    if (_.isObject(before[key]) && _.isObject(after[key])) {
      return [...acc, {
        name: key,
        value: null,
        status: 'nochanged',
        childrens: generateDiffAST(before[key], after[key]).sort(sortAlphabet),
      }];
    }
    return acc.sort(sortAlphabet);
  }, []);
  return diffAST;
};

export default (beforeConfigPath, afterConfigPath, format = 'pretty') => {
  if (!fs.existsSync(beforeConfigPath) || !fs.existsSync(afterConfigPath)) {
    throw new Error('ERROR: Impossible to generate a difference. Check the paths are correct.');
  }
  const formatBeforeFile = path.extname(beforeConfigPath).slice(1);
  const formatAfterFile = path.extname(beforeConfigPath).slice(1);
  const dataBefore = fs.readFileSync(beforeConfigPath).toString();
  const dataAfter = fs.readFileSync(afterConfigPath).toString();
  const beforeConfig = configFactory(dataBefore, formatBeforeFile);
  const afterConfig = configFactory(dataAfter, formatAfterFile);
  const ast = generateDiffAST(beforeConfig, afterConfig);
  const formatData = getFormatter(format);
  return formatData(ast);
};
