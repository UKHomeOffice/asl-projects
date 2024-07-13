import * as diff from 'fast-array-diff';

/**
 * Function to compare arrays and return changes in required format to be
 * used in diff window to highlight what has changed
 * @param {string[]} oldArray
 * @param {string[]} newArray
 * @returns {Object}
 */
export const findArrayDifferences = (oldArray, newArray) => {

  const same = diff.same(oldArray, newArray);
  const changes = diff.diff(oldArray, newArray);

  return {
    added: [
      {
        count: same.length,
        value: same
      },
      {
        count: changes.added.length,
        added: true,
        value: changes.added
      }
    ],
    removed: [
      {
        count: same.length,
        value: same
      },
      {
        count: changes.removed.length,
        removed: true,
        value: changes.removed
      }
    ]
  };
};
