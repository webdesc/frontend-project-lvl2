import yaml from 'js-yaml';

export default (data) => yaml.safeLoad(data);
