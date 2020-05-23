/* eslint-disable class-methods-use-this */

import _ from 'lodash';

const getValueProperty = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isBoolean(value)) {
    return value;
  }
  return `'${value}'`;
};

const generateDiffs = (ast, names = []) => {
  const diffArr = ast.reduce((acc, node) => {
    if (node.status === 'removed') {
      return [...acc, `Property '${[...names, node.name].join('.')}' was deleted`];
    }
    if (node.status === 'added') {
      const res = [...acc, `Property '${[...names, node.name].join('.')}' was added with value: ${getValueProperty(node.value)}`];
      return res;
    }
    if (node.status === 'modified') {
      return [...acc, `Property '${[...names, node.name].join('.')}' was changed from ${getValueProperty(node.oldValue)} to ${getValueProperty(node.value)}`];
    }
    if (node.status === 'nested') {
      return [...acc, ...generateDiffs(node.children, [...names, node.name])];
    }
    return acc;
  }, []);
  return diffArr;
};

export default (ast) => generateDiffs(ast).join('\n');
