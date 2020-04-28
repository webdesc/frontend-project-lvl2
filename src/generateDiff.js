import _ from 'lodash';

const hasKeyAllConfigs = (before, after, key) => _.has(before, key) && _.has(after, key);

const checkEqualConfigsKey = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && before[key] === after[key];

const checkNotEqualConfigsKey = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && before[key] !== after[key];

const checkChildrensConfigsKeys = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && _.isObject(before[key]) && _.isObject(after[key]);

const calcIndent = (level, changed = false) => (' '.repeat((4 * level) - (changed ? 2 : 0)));

const stringify = (data, level) => {
  const indentField = calcIndent(level, false);
  const indentBracket = calcIndent(level - 1, false);
  if (_.isObject(data)) {
    const keys = Object.keys(data);
    const items = keys.map((key) => (`${indentField}${key}: ${data[key]}`));
    return ['{', ...items, `${indentBracket}}`].join('\n');
  }
  return data;
};

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

const generateDiffArr = (ast, level = 1) => {
  const indentNochanged = calcIndent(level, false);
  const indentChanged = calcIndent(level, true);
  const diffArr = ast.reduce((acc, node) => {
    const valueStr = stringify(node.value, level + 1);
    const oldValueStr = stringify(node.oldValue, level + 1);
    if (node.status === 'removed') {
      return [...acc, `${indentChanged}- ${node.name}: ${valueStr}`];
    }
    if (node.status === 'added') {
      return [...acc, `${indentChanged}+ ${node.name}: ${valueStr}`];
    }
    if (node.status === 'modified') {
      return [...acc, `${indentChanged}- ${node.name}: ${oldValueStr}\n${indentChanged}+ ${node.name}: ${valueStr}`];
    }
    if (node.status === 'nochanged') {
      if (node.childrens) {
        return [...acc, `${indentNochanged}${node.name}: {`, ...generateDiffArr(node.childrens, level + 1), `${indentNochanged}}`];
      }
      return [...acc, `${indentNochanged}${node.name}: ${valueStr}`];
    }
    return acc;
  }, []);
  return diffArr;
};

export default (beforeConfig, afterConfig) => {
  const ast = generateDiffAST(beforeConfig, afterConfig);
  const str = ['{', ...generateDiffArr(ast), '}'].join('\n');
  return str;
};
