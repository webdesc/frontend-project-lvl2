import fs from 'fs';
import path from 'path';

import JsonParser from './parsers/jsonParser';
import YamlParser from './parsers/yamlParser';

const mapFormatToClass = {
  json: JsonParser,
  yaml: YamlParser,
  yml: YamlParser,
};

export default class ConfigFactory {
  static factory(filePath) {
    const format = path.extname(filePath).slice(1);
    const rawData = fs.readFileSync(filePath).toString();
    const parser = new mapFormatToClass[format]();
    return parser.parse(rawData);
  }
}
