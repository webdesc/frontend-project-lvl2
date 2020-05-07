import fs from 'fs';
import path from 'path';

import JsonParser from './parsers/jsonParser';
import YamlParser from './parsers/yamlParser';
import IniParser from './parsers/iniParser';

const mapFormatToClass = {
  json: JsonParser,
  yaml: YamlParser,
  yml: YamlParser,
  ini: IniParser,
};

export default class ConfigFactory {
  static factory(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error('ERROR: Impossible to generate a difference. Check the paths are correct.');
    }
    const format = path.extname(filePath).slice(1);
    const data = fs.readFileSync(filePath);
    const rawData = data.toString();
    const ParserClass = mapFormatToClass[format];
    if (!ParserClass) {
      throw new Error(`ERROR: Format '${format}' not supported.`);
    }
    const parser = new ParserClass();
    return parser.parse(rawData);
  }
}
