import isEqual from 'lodash/isEqual';
import { normaliseValue } from './normalisation';
import { normaliseDuration } from './normalise-duration';
/**
 * Checks whether the stored database value has changed compared to the current value.
 *
 * @param {string} fieldName - The name of the field being checked.
 * @param {any} storedValue - The original stored value from the database.
 * @param {any} currentValue - The current user-modified value.
 * @param {Object} values - All values from the form.
 * @param {Function} hasSpeciesFieldChanges - Function to check species-specific changes.
 * @returns {boolean} - `true` if a change is detected, otherwise `false`.
 */
export function hasDatabaseChange(fieldName, storedValue, currentValue, values, hasSpeciesFieldChanges) {
  const adjustedStoredValue = fieldName === 'duration' ? normaliseDuration(storedValue) : storedValue;
  const actualCurrentValue = currentValue ?? values[fieldName] ?? '';

  const normalisedStoredValue = fieldName === 'duration'
    ? normaliseDuration(adjustedStoredValue)
    : normaliseValue(adjustedStoredValue);

  const normalisedCurrentValue = fieldName === 'duration'
    ? normaliseDuration(actualCurrentValue)
    : normaliseValue(actualCurrentValue);

  let hasChange = !isEqual(normalisedStoredValue, normalisedCurrentValue);

  if (values?.species?.length) {
    hasChange = hasSpeciesFieldChanges(values) || hasChange;
  }

  return hasChange;
}
