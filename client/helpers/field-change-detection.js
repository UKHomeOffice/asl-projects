import isEqual from 'lodash/isEqual';
import { normaliseValue } from './normalisation';
import { normaliseDuration } from './normalise-duration';
/**
 * Checks whether the stored database value has changed compared to the current value.
 *
 * @param {string} fieldName - The name of the field being checked.
 * @param {any} storedValue - The original stored value from the database.
 * @param {any} currentValue - The current user-modified value.
 * @param {any} latestSubmittedValue - The most recent submitted version value.
 * @param {any} firstSubmittedValue - The initial submitted version value.
 * @param {any} grantedValue - The current granted license value (for granted applications).
 * @param {boolean} isGranted - Indicates if the license is granted.
 * @param {Object} values - All values from the form.
 * @param {Function} hasSpeciesFieldChanges - Function to check species-specific changes.
 * @returns {boolean} - Returns `true` if a change is detected and not reverted, otherwise `false`.
 */
export function hasDatabaseChange(
  fieldName,
  storedValue,
  currentValue,
  latestSubmittedValue,
  firstSubmittedValue,
  grantedValue,
  isGranted,
  values,
  hasSpeciesFieldChanges
) {
  if (fieldName == null) {
    // eslint-disable-next-line no-console
    console.log('fieldName must be provided.');
    return false;
  }

  const actualCurrentValue = currentValue ?? values?.[fieldName] ?? '';
  const adjustedStoredValue = fieldName === 'duration' ? normaliseDuration(storedValue) : storedValue;

  const normalisedStoredValue = fieldName === 'duration'
    ? normaliseDuration(adjustedStoredValue)
    : normaliseValue(adjustedStoredValue);

  const normalisedCurrentValue = fieldName === 'duration'
    ? normaliseDuration(actualCurrentValue)
    : normaliseValue(actualCurrentValue);

  const baseVersion = isGranted ? grantedValue : firstSubmittedValue;
  const normalisedBaseValue = fieldName === 'duration'
    ? normaliseDuration(baseVersion)
    : normaliseValue(baseVersion);

  const normalisedLatestSubmittedValue = fieldName === 'duration'
    ? normaliseDuration(latestSubmittedValue)
    : normaliseValue(latestSubmittedValue);

  const changedFromFirst = !isEqual(normalisedBaseValue, normalisedCurrentValue);
  const changedFromLatest = !isEqual(normalisedLatestSubmittedValue, normalisedCurrentValue);
  const changedFromGranted = isGranted && !isEqual(normalisedStoredValue, normalisedCurrentValue);

  // New logic to check if the change is reverted back
  const isReverted =
      isEqual(normalisedStoredValue, normalisedCurrentValue) ||
      isEqual(normalisedBaseValue, normalisedCurrentValue) ||
      isEqual(normalisedLatestSubmittedValue, normalisedCurrentValue);

  return (changedFromFirst || changedFromLatest || changedFromGranted) && !isReverted;
}
