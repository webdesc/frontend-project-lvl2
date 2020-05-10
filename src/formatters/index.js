import formatPretty from './formatPretty';
import formatJson from './formatJson';
import formatPlain from './formatPlain';

const mapFormatToFormatter = {
  pretty: formatPretty,
  json: formatJson,
  plain: formatPlain,
};

const getFormatter = (format) => mapFormatToFormatter[format];

export default getFormatter;
