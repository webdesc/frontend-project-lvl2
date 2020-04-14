/* eslint-disable class-methods-use-this */

import ini from 'ini';

export default class {
  parse(data) {
    return ini.parse(data);
  }
}
