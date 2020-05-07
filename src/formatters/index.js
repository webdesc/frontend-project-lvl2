import FormatPretty from './formatPretty';
import FormatJson from './formatJson';
import FormatPlain from './formatPlain';

const mapFormatToClass = {
  pretty: FormatPretty,
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
