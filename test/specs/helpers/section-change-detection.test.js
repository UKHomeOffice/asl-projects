import assert from 'assert';
import { hasSectionChangedDeep } from '../../../client/helpers/sectionChanges';

describe('hasSectionChangedDeep', () => {
  it('should return false if no changes in the section', () => {
    const result = hasSectionChangedDeep({ savedValues: {}, currentValues: {}, initialValues: {} }, {});
    assert.strictEqual(result, false);
  });

  it('should return true if a section field has changed', () => {
    const result = hasSectionChangedDeep({ savedValues: { key: 'old' }, currentValues: { key: 'new' }, initialValues: {} }, {});
    assert.strictEqual(result, true);
  });
});
