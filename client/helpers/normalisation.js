import stringify from 'json-stable-stringify';

/**
 * Normalises a given value into a consistent string format.
 * Uses json-stable-stringify to ensure consistent object key order.
 *
 * @param {any} value - The input value to normalise.
 * @returns {string} - A normalised string representation.
 */
export function normaliseValue(value) {
  if (value == null) {
    return '';
  }

  // Use json-stable-stringify for objects and arrays to ensure stable ordering
  if (typeof value === 'object') {
    return stringify(value).trim();
  }

  // Convert primitive types to a consistent string format
  return String(value).trim();
}
