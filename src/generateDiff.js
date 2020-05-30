import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getFormatter from './formatters';
import parseData from './parsers';

const generateDiffAST = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  const sortedKeys = keys.sort((a, b) => a.localeCompare(b));
  const diffAST = sortedKeys.map((key) => {
    if (!_.has(before, key)) {
      return {
        name: key,
        newValue: after[key],
        status: 'added',
      };
    }
    if (!_.has(after, key)) {
      return {
        name: key,
        newValue: before[key],
        status: 'removed',
      };
    }
    if (_.isObject(before[key]) && _.isObject(after[key])) {
      return {
        name: key,
        newValue: null,
        status: 'nested',
        children: generateDiffAST(before[key], after[key]),
      };
    }
    if (before[key] !== after[key]) {
      return {
        name: key,
        newValue: after[key],
        oldValue: before[key],
        status: 'modified',
      };
    }
    return {
      name: key,
      newValue: after[key],
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
  const beforeConfig = parseData(dataBefore, formatBeforeFile);
  const afterConfig = parseData(dataAfter, formatAfterFile);
  const ast = generateDiffAST(beforeConfig, afterConfig);
  const formatData = getFormatter(format);
  return formatData(ast);
};
