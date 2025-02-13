import assert from 'assert';
import { hasSectionChanged } from '../../../client/helpers/section-change-detection';

describe('hasSectionChanged', () => {

  it('should return false if all section values are unchanged', () => {
    const fields = ['title', 'species', 'keywords'];
    const currentValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };
    const initialValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };

    const result = hasSectionChanged(fields, currentValues, initialValues);
    assert.strictEqual(result, false);
  });

  it('should return true if a section field has changed', () => {
    const fields = ['title', 'species', 'keywords'];
    const currentValues = {
      title: 'Updated Project Title',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };
    const initialValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };

    const result = hasSectionChanged(fields, currentValues, initialValues);
    assert.strictEqual(result, true);
  });

  it('should return true if a new field is added', () => {
    const fields = ['title', 'species', 'keywords'];
    const currentValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test'],
      newField: 'This is new'
    };
    const initialValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };

    const result = hasSectionChanged(fields, currentValues, initialValues);
    assert.strictEqual(result, true);
  });

  it('should return false if changes involve whitespace only', () => {
    const fields = ['title', 'species', 'keywords'];
    const currentValues = {
      title: 'Additional availability at Only AA Licences ',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };
    const initialValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };

    const result = hasSectionChanged(fields, currentValues, initialValues);
    assert.strictEqual(result, false);
  });

  it('should return true if an array field is modified', () => {
    const fields = ['title', 'species', 'keywords'];
    const currentValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats', 'dogs'],
      keywords: ['Test', 'Test']
    };
    const initialValues = {
      title: 'Additional availability at Only AA Licences',
      species: ['mice', 'rats'],
      keywords: ['Test', 'Test']
    };

    const result = hasSectionChanged(fields, currentValues, initialValues);
    assert.strictEqual(result, true);
  });

  it('should return true if a nested field in protocols has changed', () => {
    const fields = ['protocols.*.title', 'protocols.*.description'];
    const currentValues = {
      protocols: [
        {
          id: 'bb94a161-0a97-4f73-ba05-ba0270e46901',
          title: 'Updated Protocol Title',
          description: { object: 'value', document: { nodes: [{ text: 'Updated Test' }] } }
        }
      ]
    };
    const initialValues = {
      protocols: [
        {
          id: 'bb94a161-0a97-4f73-ba05-ba0270e46901',
          title: 'Test',
          description: { object: 'value', document: { nodes: [{ text: 'Test' }] } }
        }
      ]
    };

    const result = hasSectionChanged(fields, currentValues, initialValues);
    assert.strictEqual(result, true);
  });

});
