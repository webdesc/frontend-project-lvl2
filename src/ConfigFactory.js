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
    const format = path.extname(filePath).slice(1);
    const rawData = fs.readFileSync(filePath).toString();
    const ParserClass = mapFormatToClass[format];
    const parser = new ParserClass();
    return parser.parse(rawData);
  }
}
