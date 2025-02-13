import assert from 'assert';
import { hasDatabaseChange } from '../../../client/helpers/field-change-detection';

describe('hasDatabaseChange', () => {

  it('should return false if the stored value and current value are identical', () => {
    const result = hasDatabaseChange('field1', 'value', 'value', {}, () => false);
    assert.strictEqual(result, false);
  });

  it('should return true if the stored value and current value differ', () => {
    const result = hasDatabaseChange('field2', 'oldValue', 'newValue', {}, () => false);
    assert.strictEqual(result, true);
  });

  it('should handle null values correctly', () => {
    const result = hasDatabaseChange('field3', null, 'newValue', {}, () => false);
    assert.strictEqual(result, true);
  });

  it('should treat undefined values as empty strings', () => {
    const result = hasDatabaseChange('field4', undefined, undefined, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('should correctly handle null, undefined, and empty string equivalence', () => {
    assert.strictEqual(hasDatabaseChange('field5', null, undefined, {}, () => false), false);
    assert.strictEqual(hasDatabaseChange('field5', undefined, '', {}, () => false), false);
    assert.strictEqual(hasDatabaseChange('field5', null, '', {}, () => false), false);
  });

  it('should normalise and compare duration values correctly (default 5 years 0 months)', () => {
    const result = hasDatabaseChange('duration', '5 years 0 months', '7 years 0 months', {}, () => false);
    assert.strictEqual(result, true);
  });

  it('should return false if duration values are logically equivalent after normalization (default 5 years 0 months)', () => {
    const result = hasDatabaseChange('duration', '5 years 0 months', '5 years 0 months', {}, () => false);
    assert.strictEqual(result, false); // Ensuring normalization keeps them equal
  });

  it('should return true if species-related fields have changed', () => {
    const values = { species: ['mice'], storedValue: { 'reduction-quantities-mice': 5 }, 'reduction-quantities-mice': 10 };
    const result = hasDatabaseChange('species', 'mice', 'mice', values, () => true);
    assert.strictEqual(result, true);
  });

  it('should return false if species-related fields have not changed', () => {
    const values = { species: ['mice'], storedValue: { 'reduction-quantities-mice': 5 }, 'reduction-quantities-mice': 5 };
    const result = hasDatabaseChange('species', 'mice', 'mice', values, () => false);
    assert.strictEqual(result, false);
  });

  it('should detect changes in nested object fields', () => {
    const values = {
      protocols: [{ id: 'bb94a161-0a97-4f73-ba05-ba0270e46901', title: 'Test' }]
    };
    const initialValues = {
      protocols: [{ id: 'bb94a161-0a97-4f73-ba05-ba0270e46901', title: 'Original' }]
    };

    const result = hasDatabaseChange('protocols', initialValues.protocols, values.protocols, values, () => false);
    assert.strictEqual(result, true);
  });

  it('should return false if objects with identical key-value pairs are compared', () => {
    const result = hasDatabaseChange(
      'field6',
      { key: 'value' },
      { key: 'value' },
      {},
      () => false
    );
    assert.strictEqual(result, false);
  });

  it('should return true if array contents are different', () => {
    const result = hasDatabaseChange(
      'field7',
      ['mice', 'rats'],
      ['mice', 'rats', 'dogs'],
      {},
      () => false
    );
    assert.strictEqual(result, true);
  });

});
