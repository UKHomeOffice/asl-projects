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

  // Check if the value is a Slate.js-style rich text object
  if (typeof value === 'object' && value.document?.nodes) {
    return extractText(value);
  }

  // Use json-stable-stringify for objects and arrays to ensure stable ordering
  if (typeof value === 'object') {
    return stringify(value).trim();
  }

  // Convert primitive types to a consistent string format
  return String(value).trim();
}

/**
 * extracts plain text from a Slate.js-style rich text object.
 * @param {object} richTextObject - The input rich text object.
 * @returns {string} - Extracted plain text.
 */
function extractText(richTextObject) {
  if (!richTextObject?.document?.nodes) {
    return '';
  }

  return richTextObject.document.nodes
    .map(block =>
      block.nodes?.map(node => node.text || '').join(' ') || ''
    )
    .join('\n')
    .trim();
}
