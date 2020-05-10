/* eslint-disable class-methods-use-this */

import _ from 'lodash';

import ini from 'ini';

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

export default (data) => fixNumberValues(ini.parse(data));
