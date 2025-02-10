/**
 * Normalises a given value into a consistent string format.
 * @param {any} value - The input value to normalise.
 * @returns {string} - A normalised string representation.
 */

export function normaliseValue(value) {
  if (value == null) {
    return "";
  }

  // Handle arrays (ensure order consistency)
  if (Array.isArray(value)) {
    return JSON.stringify(value.map(normaliseValue).sort());
  }

  // Handle objects with a stable field order
  if (typeof value === "object") {
    return JSON.stringify(
      Object.keys(value).sort().reduce((acc, key) => {
        acc[key] = normaliseValue(value[key]);
        return acc;
      }, {})
    ).replace(/["]+/g, "").trim();
  }

  // Normalise scalar values (string, number, boolean)
  return String(value).trim().replace(/["]+/g, "");
}