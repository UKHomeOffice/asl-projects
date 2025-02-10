/**
 * Ensures a duration object has valid `years` and `months` values.
 * - Defaults to `{ years: 5, months: 0 }` if values are missing or invalid.
 * - If `years` or `months` are undefined, sets them to 5 and 0 respectively.
 *
 * @param {Object|null|undefined} value - The input duration.
 * @returns {Object} - A duration object with `years` and `months`.
 */
export function normaliseDuration(value) {
    if (value && typeof value === 'object' && ('years' in value || 'months' in value)) {
        return {
            years: value.years ?? 5,  // Default to 5 if undefined
            months: value.months ?? 0 // Default to 0 if undefined
        };
    }
    return { years: 5, months: 0 };
}