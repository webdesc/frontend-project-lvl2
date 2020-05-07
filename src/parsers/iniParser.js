/* eslint-disable class-methods-use-this */

import _ from 'lodash';

import ini from 'ini';

export default class {
  fixNumberValues(iniData) {
    return Object.keys(iniData).reduce((acc, key) => {
      if (_.isObject(iniData[key])) {
        return { ...acc, [key]: this.fixNumberValues(iniData[key]) };
      }
      const value = !_.isNaN(Number(iniData[key])) && !_.isBoolean(iniData[key])
        ? Number(iniData[key])
        : iniData[key];
      return { ...acc, [key]: value };
    }, {});
  }

  parse(data) {
    return this.fixNumberValues(ini.parse(data));
  }
}
