/* eslint-disable class-methods-use-this */

import yaml from 'js-yaml';

export default class {
  parse(data) {
    return yaml.safeLoad(data);
  }
}
