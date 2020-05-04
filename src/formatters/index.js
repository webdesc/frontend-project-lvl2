import FormatJson from './formatJson';
import FormatPlain from './formatPlain';

const mapFormatToClass = {
  json: FormatJson,
  plain: FormatPlain,
};

export default class {
  constructor(format) {
    this.formatter = new mapFormatToClass[format]();
  }

  parse(ast) {
    return this.formatter.parse(ast);
  }
}
