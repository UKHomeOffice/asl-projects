import assert from 'assert';
import hasExistingDataForCheckbox from '../../../client/helpers/has-existing-data-for-checkbox';

describe('hasExistingDataForCheckbox', () => {
  const project = {
    'protocols': [
      {
        'method-and-justification': {
          document: {
            'data': {},
            'nodes': [
              {
                'data': {},
                'type': 'paragraph',
                'nodes': [
                  {
                    'text': 'method-and-justification',
                    'marks': [],
                    'object': 'text'
                  }
                ],
                'object': 'block'
              }
            ],
            'object': 'document'
          }
        },
        'continued-use-relevant-project': {
          document: {
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
        }
      }
    ],
    'keeping-alive-complete': false,
    'keeping-animals-alive-determine': {
      document: {
        'data': {},
        'nodes': [
          {
            'data': {},
            'type': 'paragraph',
            'nodes': [
              {
                'text': 'keeping-animals-alive-determine',
                'marks': [],
                'object': 'text'
              }
            ],
            'object': 'block'
          }
        ],
        'object': 'document'
      }
    },
    'keeping-animals-alive-supervised': {
      document: {
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
    },
    'kept-alive-animals': {
      document: {
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
    },
    'rehoming-complete': true,
    'rehoming-harmful': {
      document: {
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
    },
    'rehoming-healthy': {
      document: {
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
    },
    'rehoming-other': {
      document: {
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
    },
    'rehoming-types': {
      document: {
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
    },
    'setting-free-complete': false,
    'setting-free-ensure-not-harmful': {
      document: {
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
    },
    'setting-free-health': {
      document: {
        'data': {},
        'nodes': [
          {
            'data': {},
            'type': 'paragraph',
            'nodes': [
              {
                'text': 'Healthy cub',
                'marks': [],
                'object': 'text'
              }
            ],
            'object': 'block'
          }
        ],
        'object': 'document'
      }
    },
    'setting-free-lost': {
      document: {
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
    },
    'setting-free-recapturing': {
      document: {
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
    },
    'setting-free-rehabilitate': {
      document: {
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
    },
    'setting-free-socialise': {
      document: {
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
    },
    'setting-free-vet': false
  };

  it('should return true for "killed" if there is data in "method-and-justification"', () => {
    const result = hasExistingDataForCheckbox(project, 'killed');
    const expectedResult = { checkboxValue: 'killed', hasData: true };
    assert.deepEqual(result, expectedResult);
  });

  it('should return true for "used-in-other-projects" if there is data in "continued-use-relevant-project"', () => {
    const result = hasExistingDataForCheckbox(project, 'used-in-other-projects');
    const expectedResult = { checkboxValue: 'used-in-other-projects', hasData: false };
    assert.deepEqual(result, expectedResult);
  });

  it('should return true for "kept-alive" if there is data in "keeping-animals-alive-determine"', () => {
    const result = hasExistingDataForCheckbox(project, 'kept-alive');
    const expectedResult = { checkboxValue: 'kept-alive', hasData: true };
    assert.deepEqual(result, expectedResult);
  });

  it('should return true for "rehomed" if "rehoming-complete" is true', () => {
    const result = hasExistingDataForCheckbox(project, 'rehomed');
    const expectedResult = { checkboxValue: 'rehomed', hasData: true };
    assert.deepEqual(result, expectedResult);
  });

  it('should return true for "set-free" if there is no data in any of the fields', () => {
    const result = hasExistingDataForCheckbox(project, 'set-free');
    const expectedResult = { checkboxValue: 'set-free', hasData: true };
    assert.deepEqual(result, expectedResult);
  });
});
