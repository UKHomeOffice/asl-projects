import isEqual from 'lodash/isEqual';
import { normaliseValue } from './normalisation';

/**
 * Determines if any fields in a given section have changed by comparing their current and initial values.
 * @param {Array} fields - The list of field names to check for changes.
 * @param {Object} currentValues - The current values of the fields, typically from user input or state.
 * @param {Object} initialValues - The initial values of the fields, typically from the database or original state.
 * @returns {boolean} - Returns `true` if at least one field has changed, otherwise `false`.
 */
export function hasSectionChanged(fields, currentValues, initialValues) {

  // Specially fields those are added on the fly for example check box in aim create entries in reduction
  const hasNewFields = Object.keys(currentValues).some(key => !(key in initialValues));

  return hasNewFields || fields.some(field => {
    const currentValue = normaliseValue(currentValues[field]);
    const initialValue = normaliseValue(initialValues[field]);

    // Handle deep object comparisons for nested structures like protocols
    if (typeof currentValue === 'object' && typeof initialValue === 'object') {
      return !isEqual(currentValue, initialValue);
    }

    // Detecting changes in nested protocol fields
    if (field.includes('protocols.') && typeof currentValues.protocols === 'object') {
      return currentValues.protocols.some((protocol, index) => {
        const storedProtocol = initialValues.protocols?.[index] || {};
        return !isEqual(protocol, storedProtocol);
      });
    }

    return currentValue !== initialValue;
  });
}
