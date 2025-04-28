import { hasDatabaseChange } from './field-change-detection';
import get from 'lodash/get';

/**
 * Checks if a section (including nested and wildcard fields) has changed in the ASPeL project,
 * which determines whether the "Changed" badge (pink/grey) should appear.
 *
 * @param {Array} fieldPaths - Dot-notated list of field identifiers (e.g. 'protocols.*.title', 'aim.experience').
 * @param {Object} currentDraft - The current in-progress version being edited.
 * @param {Object} previousDraft - The last saved or submitted version (can be granted or in review).
 * @param {Object} latestSubmittedVersion - Most recent submitted version for tracking pink badge.
 * @param {Object} firstSubmittedVersion - First-ever submitted version for tracking grey badge.
 * @param {Object} grantedVersion - Snapshot of granted version, used for granted application comparison.
 * @param {boolean} isGrantedApplication - Flag indicating if this is a granted application context.
 *
 * @returns {boolean} Whether any field in the section is considered changed.
 */
export function hasSectionChanged(
  fieldPaths,
  currentDraft,
  previousDraft,
  latestSubmittedVersion,
  firstSubmittedVersion,
  grantedVersion,
  isGrantedApplication
) {
  /**
   * Compares a single field across all versions to determine if a change occurred.
   */
  const checkFieldChange = (fieldPath, current, previous, latest, first, granted, rootObject) => {
    const currentValue = get(current, fieldPath);
    const previousValue = get(previous, fieldPath);
    const latestValue = get(latest, fieldPath);
    const firstValue = get(first, fieldPath);
    const grantedValue = get(granted, fieldPath);

    // Quick string trim comparison for user-typed text fields
    if (typeof currentValue === 'string' || typeof previousValue === 'string') {
      if ((currentValue || '').trim() !== (previousValue || '').trim()) {
        return true;
      }
    }

    // For granted applications: compare against grantedValue first
    if (isGrantedApplication && currentValue !== grantedValue) {
      return true;
    }

    // Delegate deeper comparison to shared utility
    return hasDatabaseChange(
      fieldPath,
      previousValue,
      currentValue,
      latestValue,
      firstValue,
      grantedValue,
      isGrantedApplication,
      rootObject,
      () => false // Not using custom badge override
    );
  };

  return fieldPaths.some(fieldPath => {
    const pathSegments = fieldPath.split('.');
    const containsWildcard = pathSegments.includes('*');

    if (!containsWildcard) {
      // Handle flat fields (e.g. 'aim.title')
      return checkFieldChange(
        fieldPath,
        currentDraft,
        previousDraft,
        latestSubmittedVersion,
        firstSubmittedVersion,
        grantedVersion,
        currentDraft
      );
    }

    /**
     * Recursive function to resolve wildcard paths (e.g. 'protocols.*.title').
     * Supports arbitrarily nested paths.
     */
    const resolveWildcard = (current, previous, latest, first, granted, pathSoFar = [], index = 0) => {
      if (index === pathSegments.length) {
        const fullPath = pathSoFar.join('.');
        return checkFieldChange(
          fullPath,
          currentDraft,
          previousDraft,
          latestSubmittedVersion,
          firstSubmittedVersion,
          grantedVersion,
          currentDraft
        );
      }

      const currentSegment = pathSegments[index];

      if (currentSegment === '*') {
        // Handle array loop at this segment (e.g. 'protocols', 'steps')
        const basePath = pathSoFar.join('.');
        const currentArray = get(currentDraft, basePath) || [];

        for (let i = 0; i < currentArray.length; i++) {
          const nextPath = [...pathSoFar, i];
          const changed = resolveWildcard(current, previous, latest, first, granted, nextPath, index + 1);
          if (changed) return true; // Short-circuit on first detected change
        }

        return false; // No item in array triggered change
      }

      // Drill deeper into object key
      return resolveWildcard(current, previous, latest, first, granted, [...pathSoFar, currentSegment], index + 1);
    };

    return resolveWildcard(currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion);
  });
}
