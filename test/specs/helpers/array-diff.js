import assert from 'assert';
import { findArrayDifferences } from '../../../client/helpers/array-diff';

const before = ['cancer', 'stem cells', 'therapy', 'other research'];

const after = ['cancer', 'stem', 'therapy', 'new research', 'second new research'];

describe('array-diff', () => {
  it('should find array items that are same and new items', () => {
    const added = findArrayDifferences(before, after).added;

    const expectedResult = [{'count': 2, 'value': ['cancer', 'therapy']}, {'count': 3, 'added': true, 'value': ['stem', 'new research', 'second new research']}];
    assert.deepEqual(added, expectedResult);
  });

  it('should find array items that are same and items that are removed', () => {
    const removed = findArrayDifferences(before, after).removed;

    const expectedResult = [{'count': 2, 'value': ['cancer', 'therapy']}, {'count': 2, 'removed': true, 'value': ['stem cells', 'other research']}];
    assert.deepEqual(removed, expectedResult);
  });
});
