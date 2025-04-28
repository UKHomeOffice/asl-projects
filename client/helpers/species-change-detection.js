import isEqual from 'lodash/isEqual';
import { normaliseValue } from './normalisation';

/**
 * Checks for changes in species-based dynamic fields.
 * @param {Object} values - The current form values.
 * @returns {boolean} - `true` if any species-based fields have changed.
 */
export function hasSpeciesFieldChanges(values) {
  return values.species.some(speciesName => {
    const fieldName = `reduction-quantities-${speciesName}`;
    const speciesStoredValue = values.storedValue?.[fieldName] ?? '';
    const speciesCurrentValue = values[fieldName] ?? '';

    return !isEqual(normaliseValue(speciesStoredValue), normaliseValue(speciesCurrentValue));
  });
}
