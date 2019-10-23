import { Value } from 'slate';
import get from 'lodash/get';

import initialValue from './initial-value';

export const serialiseValue = value => {
  const jsonVal = JSON.stringify(value.toJSON());
  if (jsonVal === JSON.stringify(Value.fromJSON(initialValue('')))) {
    return null;
  }
  return jsonVal;
};

export const normaliseValue = value => {
  // if value is falsy, init with empty value
  if (!value) {
    return initialValue('');
  }
  try {
    // try and parse value
    value = JSON.parse(value)
  } catch(e) {
    // if value is unable to be JSON parsed, set it as a single text node
    value = initialValue(value);
  }
  // if structure is empty and incomplete, init with empty value
  if (get(value, 'document.nodes.length') === 0) {
    value = initialValue('');
  }
  return value;
}
