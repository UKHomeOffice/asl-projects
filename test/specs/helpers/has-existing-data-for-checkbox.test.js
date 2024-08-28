import assert from 'assert';
import hasExistingDataForCheckbox from '../../../client/helpers/has-existing-data-for-checkbox';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

const emptyTextArea = {
  'object': 'value',
  'document': {
    'data': {},
    'nodes': [
      {
        'data': {},
        'type': 'paragraph',
        'nodes': [
          {
            'text': '',
            'marks': [],
            'object': 'text'
          }
        ],
        'object': 'block'
      }
    ],
    'object': 'document'
  }
};

const emptyProject = {
  'protocols': [
    {
      'method-and-justification': cloneDeep(emptyTextArea),
      'continued-use-relevant-project': cloneDeep(emptyTextArea)
    }
  ],
  'keeping-alive-complete': false,
  'keeping-animals-alive-determine': cloneDeep(emptyTextArea),
  'keeping-animals-alive-supervised': cloneDeep(emptyTextArea),
  'kept-alive-animals': cloneDeep(emptyTextArea),
  'rehoming-complete': false,
  'rehoming-harmful': cloneDeep(emptyTextArea),
  'rehoming-healthy': cloneDeep(emptyTextArea),
  'rehoming-other': cloneDeep(emptyTextArea),
  'rehoming-types': cloneDeep(emptyTextArea),
  'setting-free-complete': false,
  'setting-free-ensure-not-harmful': cloneDeep(emptyTextArea),
  'setting-free-health': cloneDeep(emptyTextArea),
  'setting-free-lost': cloneDeep(emptyTextArea),
  'setting-free-recapturing': cloneDeep(emptyTextArea),
  'setting-free-rehabilitate': cloneDeep(emptyTextArea),
  'setting-free-socialise': cloneDeep(emptyTextArea),
  'setting-free-vet': false
};

const textAreaWithText = (text) => {
  const state = cloneDeep(emptyTextArea);
  return set(state, 'document.nodes.0.nodes.0.text', text);
};

describe('hasExistingDataForCheckbox', () => {

  describe('empty project should not have any existing data', () => {
    for (const value of ['killed', 'used-in-other-projects', 'kept-alive', 'rehomed', 'set-free']) {
      it(`- ${value}`, () => {
        const result = hasExistingDataForCheckbox(emptyProject, value);
        const expectedResult = { checkboxValue: value, hasData: false };
        assert.deepEqual(result, expectedResult);
      });
    }
  });

  it('should return true for "killed" if there is data in "method-and-justification"', () => {
    const project = set(
      cloneDeep(emptyProject),
      'protocols.0.method-and-justification',
      textAreaWithText('Method and justification')
    );

    const result = hasExistingDataForCheckbox(project, 'killed');

    assert.deepEqual(result, { checkboxValue: 'killed', hasData: true });
  });

  it('should return true for "used-in-other-projects" if there is data in "continued-use-relevant-project"', () => {
    const project = set(
      cloneDeep(emptyProject),
      'protocols.0.continued-use-relevant-project',
      textAreaWithText('Relevant project')
    );

    const result = hasExistingDataForCheckbox(project, 'used-in-other-projects');

    assert.deepEqual(result, { checkboxValue: 'used-in-other-projects', hasData: true });
  });

  describe('should return true for "rehomed", "set-free", and "kept-alive" if there is data in "keeping-animals-alive-determine"', () => {
    const project = set(
      cloneDeep(emptyProject),
      'keeping-animals-alive-determine',
      textAreaWithText('Keeping animals alive determine')
    );

    for (const value of ['rehomed', 'set-free', 'kept-alive']) {
      it(`- ${value}`, () => {
        const result = hasExistingDataForCheckbox(project, value);

        assert.deepEqual(result, { checkboxValue: value, hasData: true });
      });
    }
  });

  it('should return true for "rehomed" if "rehoming-complete" is true', () => {
    const project = set(cloneDeep(emptyProject), 'rehoming-complete', true);

    const result = hasExistingDataForCheckbox(project, 'rehomed');

    assert.deepEqual(result, { checkboxValue: 'rehomed', hasData: true });
  });

  it('should return true for "set-free" if "setting-free-ensure-not-harmful" has text', () => {
    const project = set(
      cloneDeep(emptyProject),
      'setting-free-ensure-not-harmful',
      textAreaWithText('Setting free ensure non-harmful')
    );

    const result = hasExistingDataForCheckbox(project, 'set-free');

    assert.deepEqual(result, { checkboxValue: 'set-free', hasData: true });
  });
});
