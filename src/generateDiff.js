import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getFormatter from './formatters';
import createConfig from './parsers';

const sortAlphabet = (a, b) => {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
};

const generateDiffAST = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  const diffAST = keys.sort(sortAlphabet).map((key) => {
    if (!_.has(before, key)) {
      return {
        name: key,
        value: after[key],
        status: 'added',
      };
    }
    if (!_.has(after, key)) {
      return {
        name: key,
        value: before[key],
        status: 'removed',
      };
    }
    if (before[key] !== after[key] && (!_.isObject(before[key]) || !_.isObject(after[key]))) {
      return {
        name: key,
        value: after[key],
        oldValue: before[key],
        status: 'modified',
      };
    }
    if (_.isObject(before[key]) && _.isObject(after[key])) {
      return {
        name: key,
        value: null,
        status: 'nested',
        children: generateDiffAST(before[key], after[key]).sort(sortAlphabet),
      };
    }
    return {
      name: key,
      value: after[key],
      status: 'nochanged',
    };
  });
  return diffAST;
};

export default (beforeConfigPath, afterConfigPath, format = 'pretty') => {
  const formatBeforeFile = path.extname(beforeConfigPath).slice(1);
  const formatAfterFile = path.extname(beforeConfigPath).slice(1);
  const dataBefore = fs.readFileSync(beforeConfigPath).toString();
  const dataAfter = fs.readFileSync(afterConfigPath).toString();
  const beforeConfig = createConfig(dataBefore, formatBeforeFile);
  const afterConfig = createConfig(dataAfter, formatAfterFile);
  const ast = generateDiffAST(beforeConfig, afterConfig);
  const formatData = getFormatter(format);
  return formatData(ast);
};
