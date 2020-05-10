import fs from 'fs';
import path from 'path';

import jsonParser from './parsers/jsonParser';
import yamlParser from './parsers/yamlParser';
import iniParser from './parsers/iniParser';

const mapFormatToParser = {
  json: jsonParser,
  yaml: yamlParser,
  yml: yamlParser,
  ini: iniParser,
};

export default (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('ERROR: Impossible to generate a difference. Check the paths are correct.');
  }
  const format = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath);
  const rawData = data.toString();
  const parse = mapFormatToParser[format];
  if (!parse) {
    throw new Error(`ERROR: Format '${format}' not supported.`);
  }
  return parse(rawData);
};
