import assert from 'assert';
import { hasDatabaseChange } from '../../../client/helpers/databaseChanges';

describe('hasDatabaseChange', () => {
  it('should return false if no changes are detected', () => {
    const result = hasDatabaseChange('field1', 'value', 'value', {}, () => false);
    assert.strictEqual(result, false);
  });

  it('should return true if a field has changed', () => {
    const result = hasDatabaseChange('field2', 'oldValue', 'newValue', {}, () => false);
    assert.strictEqual(result, true);
  });
});
