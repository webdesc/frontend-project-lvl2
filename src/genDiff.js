import fs from 'fs';

export default (beforeConfigPath, afterConfigPath) => {
  const beforeConfig = JSON.parse(fs.readFileSync(beforeConfigPath));
  const afterConfig = JSON.parse(fs.readFileSync(afterConfigPath));
  const allConfigKeys = Object.keys({ ...beforeConfig, ...afterConfig });
  const diff = allConfigKeys.reduce((acc, key) => {
    if (beforeConfig.hasOwnProperty(key) && afterConfig.hasOwnProperty(key)) {
      if (beforeConfig[key] === afterConfig[key]) {
        return [...acc, `${key}: ${beforeConfig[key]}`];
      }
      if (beforeConfig[key] !== afterConfig[key]) {
        return [...acc, `- ${key}: ${beforeConfig[key]}`, `+ ${key}: ${afterConfig[key]}`];
      }
    }
    if (!afterConfig.hasOwnProperty(key)) {
      return [...acc, `- ${key}: ${beforeConfig[key]}`];
    }
    if (!beforeConfig.hasOwnProperty(key)) {
      return [...acc, `+ ${key}: ${afterConfig[key]}`];
    }
    return acc;
  }, '');
  return diff.join('\n');
};

