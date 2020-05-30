import _ from 'lodash';

const calcIndent = (level, changed = false) => (' '.repeat((4 * level) - (changed ? 2 : 0)));

const stringify = (data, level) => {
  if (!_.isObject(data)) {
    return data;
  }
  const indentField = calcIndent(level, false);
  const indentCloseBracket = calcIndent(level - 1, false);
  const keys = Object.keys(data);
  const items = keys.map((key) => (`${indentField}${key}: ${data[key]}`));
  return ['{', ...items, `${indentCloseBracket}}`].join('\n');
};

const generateDiffs = (ast, level = 1) => {
  const indentNochanged = calcIndent(level, false);
  const indentChanged = calcIndent(level, true);
  const diffs = ast.map((node) => {
    const valueStr = stringify(node.newValue, level + 1);
    const oldValueStr = stringify(node.oldValue, level + 1);
    switch (node.status) {
      case 'removed':
        return `${indentChanged}- ${node.name}: ${valueStr}`;
      case 'added':
        return `${indentChanged}+ ${node.name}: ${valueStr}`;
      case 'modified':
        return `${indentChanged}- ${node.name}: ${oldValueStr}\n${indentChanged}+ ${node.name}: ${valueStr}`;
      case 'nested':
        return `${indentNochanged}${node.name}: {\n${generateDiffs(node.children, level + 1).join('\n')}\n${indentNochanged}}`;
      default:
        return `${indentNochanged}${node.name}: ${valueStr}`;
    }
  });
  return diffs;
};

export default (ast) => ['{', ...generateDiffs(ast), '}'].join('\n');
