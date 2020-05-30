import _ from 'lodash';
import ini from 'ini';
import yaml from 'js-yaml';

const fixNumberValues = (iniData) => {
  const correctedData = Object.keys(iniData).reduce((acc, key) => {
    if (_.isObject(iniData[key])) {
      return { ...acc, [key]: fixNumberValues(iniData[key]) };
    }
    const value = !_.isNaN(Number(iniData[key])) && !_.isBoolean(iniData[key])
      ? Number(iniData[key])
      : iniData[key];
    return { ...acc, [key]: value };
  }, {});
  return correctedData;
};

const mapFormatToParser = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  yml: yaml.safeLoad,
  ini: (data) => fixNumberValues(ini.parse(data)),
};

const parseData = (data, format) => {
  const parse = mapFormatToParser[format];
  if (!parse) {
    throw new Error(`ERROR: Format '${format}' not supported.`);
  }
  return parse(data);
};

export default parseData;
