import fs from 'fs';
import _ from 'lodash';

export default (beforeConfigPath, afterConfigPath) => {
  const beforeConfig = JSON.parse(fs.readFileSync(beforeConfigPath));
  const afterConfig = JSON.parse(fs.readFileSync(afterConfigPath));
  const allConfigKeys = Object.keys({ ...beforeConfig, ...afterConfig });
  const diff = allConfigKeys.reduce((acc, key) => {
    if (_.has(beforeConfig, key) && _.has(afterConfig, key)) {
      if (beforeConfig[key] === afterConfig[key]) {
        return [...acc, ` ${key}: ${beforeConfig[key]}`];
      }
      if (beforeConfig[key] !== afterConfig[key]) {
        return [...acc, ` - ${key}: ${beforeConfig[key]}`, ` + ${key}: ${afterConfig[key]}`];
      }
    }
    if (!_.has(afterConfig, key)) {
      return [...acc, ` - ${key}: ${beforeConfig[key]}`];
    }
    if (!_.has(beforeConfig, key)) {
      return [...acc, ` + ${key}: ${afterConfig[key]}`];
    }
    return acc;
  }, '');
  return diff.join('\n');
};
