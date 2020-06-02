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
    const propertyName = [...names, node.name].join('.');
    switch (node.status) {
      case 'added':
        return `Property '${propertyName}' was added with value: ${getValueProperty(node.newValue)}`;
      case 'removed':
        return `Property '${propertyName}' was deleted`;
      case 'modified':
        return `Property '${propertyName}' was changed from ${getValueProperty(node.oldValue)} to ${getValueProperty(node.newValue)}`;
      case 'nested':
        return generateDiffs(node.children, [...names, node.name]).join('\n');
      case 'nochanged':
        return '';
      default:
        throw new Error(`Unknown node status: '${node.status}' with plain format`);
    }
  });
  return diffs.filter((element) => element.length > 0);
};

export default (ast) => generateDiffs(ast).join('\n');
