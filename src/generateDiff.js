import _ from 'lodash';

import Formatter from './formatters';

const hasKeyAllConfigs = (before, after, key) => _.has(before, key) && _.has(after, key);

const checkEqualConfigsKey = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && before[key] === after[key];

const checkNotEqualConfigsKey = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && before[key] !== after[key];

const checkChildrensConfigsKeys = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && _.isObject(before[key]) && _.isObject(after[key]);

const sortFieldsName = (a, b) => {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
};

const generateDiffAST = (beforeConfig, afterConfig) => {
  const allConfigKeys = Object.keys({ ...beforeConfig, ...afterConfig });
  const diffAST = allConfigKeys.reduce((acc, key) => {
    if (checkChildrensConfigsKeys(beforeConfig, afterConfig, key)) {
      return [...acc, {
        name: key,
        value: null,
        status: 'nochanged',
        childrens: generateDiffAST(beforeConfig[key], afterConfig[key]).sort(sortFieldsName),
      }];
    }
    if (checkEqualConfigsKey(beforeConfig, afterConfig, key)) {
      return [...acc, {
        name: key,
        value: afterConfig[key],
        status: 'nochanged',
      }];
    }
    if (checkNotEqualConfigsKey(beforeConfig, afterConfig, key)) {
      return [...acc, {
        name: key,
        value: afterConfig[key],
        oldValue: beforeConfig[key],
        status: 'modified',
      }];
    }
    if (!_.has(afterConfig, key)) {
      return [...acc, {
        name: key,
        value: beforeConfig[key],
        status: 'removed',
      }];
    }
    if (!_.has(beforeConfig, key)) {
      return [...acc, {
        name: key,
        value: afterConfig[key],
        status: 'added',
      }];
    }
    return acc.sort(sortFieldsName);
  }, []);
  return diffAST;
};

export default (beforeConfig, afterConfig, format) => {
  const ast = generateDiffAST(beforeConfig, afterConfig);
  const formatter = new Formatter(format);
  return formatter.parse(ast);
};
