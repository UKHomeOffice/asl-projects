import isEqual from 'lodash/isEqual';
import { normaliseValue } from './normalisation';
import { normaliseDuration } from './normalise-duration';
import { hasSpeciesFieldChanges } from './species-change-detection';
/**
 * Determines if any fields in a given section have changed by comparing their current and initial values.
 * @param {Array} fields - The list of field names to check for changes.
 * @param {Object} currentValues - The current values of the fields, typically from user input or state.
 * @param {Object} initialValues - The initial values of the fields, typically from the database or original state.
 * @returns {boolean} - Returns `true` if at least one field has changed, otherwise `false`.
 */
export function hasSectionChanged(fields, currentValues, initialValues) {
  return fields.some(field => {
    const currentValue = normaliseValue(currentValues[field]);
    const initialValue = normaliseValue(initialValues[field]);

    return currentValue !== initialValue;
  });
}
