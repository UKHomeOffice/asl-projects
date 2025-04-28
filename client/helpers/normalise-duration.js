/**
 * Ensures a duration object has valid `years` and `months` values.
 * - Defaults to `{ years: 5, months: 0 }` if values are missing or invalid.
 * - Converts string-based durations into structured objects.
 *
 * @param {Object|string|null|undefined} value - The input duration.
 * @returns {Object} - A duration object with `years` and `months`.
 */
export function normaliseDuration(value) {
  // Handle case where value is a string (e.g., "5 years 0 months")
  if (typeof value === 'string') {
    const match = value.match(/(\d+)\s*years?\s*(\d*)\s*months?/);
    if (match) {
      return {
        years: parseInt(match[1], 10) || 5,
        months: parseInt(match[2] || '0', 10)
      };
    }
  }

  // Handle case where value is an object
  if (typeof value === 'object' && value !== null) {
    return {
      years: Number.isFinite(value.years) ? Number(value.years) : 5,
      months: Number.isFinite(value.months) ? Number(value.months) : 0
    };
  }

  // Default case
  return { years: 5, months: 0 };
}
