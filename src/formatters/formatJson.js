/* eslint-disable class-methods-use-this */

import _ from 'lodash';

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

export default class {
  parse(ast) {
    return ['{', ...generateDiffArr(ast), '}'].join('\n');
  }
}
