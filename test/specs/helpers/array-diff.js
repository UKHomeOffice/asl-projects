import { findArrayDifferences } from '../../../client/helpers/array-diff';

const first = ['kiran', 'varma', 'new1', 'remove-some-chars'];

const second = ['kiran', 'var', '', 'remove-chars'];

describe.only('array-diff', () => {
  it('should use diff', () => {
    const diff = findArrayDifferences(first, second);
    console.log('diff--->', JSON.stringify(diff));

  });
});
