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
  const diffs = ast.map((node) => {
    switch (node.status) {
      case 'added':
        return `Property '${[...names, node.name].join('.')}' was added with value: ${getValueProperty(node.newValue)}`;
      case 'removed':
        return `Property '${[...names, node.name].join('.')}' was deleted`;
      case 'modified':
        return `Property '${[...names, node.name].join('.')}' was changed from ${getValueProperty(node.oldValue)} to ${getValueProperty(node.newValue)}`;
      case 'nested':
        return generateDiffs(node.children, [...names, node.name]).join('\n');
      default:
        return '';
    }
  });
  return diffs.filter((element) => element.length > 0);
};

export default (ast) => generateDiffs(ast).join('\n');
