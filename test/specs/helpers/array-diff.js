import assert from 'assert';
import { findArrayDifferences } from '../../../client/helpers/array-diff';

const first = ['cancer', 'stem cells', 'therapy', 'other research'];

const second = ['cancer', 'stem', 'therapy', 'new research', 'second new research'];

describe('array-diff', () => {
  it('should find array items that are same and new items', () => {
    const added = findArrayDifferences(first, second).added;

    const expectedResult = [{'count': 2, 'value': ['cancer', 'therapy']}, {'count': 3, 'added': true, 'value': ['stem', 'new research', 'second new research']}];
    assert.deepEqual(added, expectedResult);
  });

  it('should find array items that are same and items that are removed', () => {
    const removed = findArrayDifferences(first, second).removed;

    const expectedResult = [{'count': 2, 'value': ['cancer', 'therapy']}, {'count': 2, 'removed': true, 'value': ['stem cells', 'other research']}];
    assert.deepEqual(removed, expectedResult);
  });
});
