import _ from 'lodash';

const hasKeyAllConfigs = (before, after, key) => _.has(before, key) && _.has(after, key);

const checkEqualConfigsKey = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && before[key] === after[key];

const checkNotEqualConfigsKey = (before, after, key) => hasKeyAllConfigs(before, after, key)
  && before[key] !== after[key];

export default (beforeConfig, afterConfig) => {
  const allConfigKeys = Object.keys({ ...beforeConfig, ...afterConfig });
  const diff = allConfigKeys.reduce((acc, key) => {
    if (checkEqualConfigsKey(beforeConfig, afterConfig, key)) {
      return [...acc, ` ${key}: ${beforeConfig[key]}`];
    }
    if (checkNotEqualConfigsKey(beforeConfig, afterConfig, key)) {
      return [...acc, ` - ${key}: ${beforeConfig[key]}`, ` + ${key}: ${afterConfig[key]}`];
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
