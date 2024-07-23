/**
 * @desc @desc takes @param project:Object, @param checkboxValue: String, select checkbox value, will reset any data nodes associated to NTS checkbox.
 * @returns {Object} An object containing the checkbox value.
 * */
import cloneDeep from 'lodash/cloneDeep';

const resetFieldsBasedOnCheckbox = (project, checkboxValue) => {
  // Deep clone the project object to avoid mutating it directly and manipulate NTS data fields.
  const newProject = cloneDeep(project);
  const defaultEmptyObject = {
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

  if (checkboxValue === 'killed' || checkboxValue === 'used-in-other-projects') {
    newProject.protocols = newProject.protocols.map(protocol => {
      if (checkboxValue === 'killed') {
        return {
          ...protocol,
          'method-and-justification': defaultEmptyObject,
          'non-schedule-1': false,
          'complete': false
        };
      } else if (checkboxValue === 'used-in-other-projects') {
        return {
          ...protocol,
          'continued-use-relevant-project': defaultEmptyObject,
          'non-schedule-1': false,
          'complete': false
        };
      }
      return protocol; // Return the original protocol if no changes are needed
    });
  }

  switch (checkboxValue) {
    case 'kept-alive':
      newProject['keeping-alive-complete'] = false;
      newProject['keeping-animals-alive-determine'] = defaultEmptyObject;
      newProject['keeping-animals-alive-supervised'] = defaultEmptyObject;
      newProject['kept-alive-animals'] = defaultEmptyObject;
      break;
    case 'rehomed':
      newProject['rehoming-complete'] = false;
      newProject['rehoming-harmful'] = defaultEmptyObject;
      newProject['rehoming-healthy'] = defaultEmptyObject;
      newProject['rehoming-other'] = defaultEmptyObject;
      newProject['rehoming-types'] = defaultEmptyObject;
      break;
    case 'set-free':
      newProject['setting-free-complete'] = false;
      newProject['setting-free-ensure-not-harmful'] = defaultEmptyObject;
      newProject['setting-free-health'] = defaultEmptyObject;
      newProject['setting-free-lost'] = defaultEmptyObject; // Adjusted to match the specified format
      newProject['setting-free-recapturing'] = defaultEmptyObject;
      newProject['setting-free-rehabilitate'] = defaultEmptyObject;
      newProject['setting-free-socialise'] = defaultEmptyObject;
      newProject['setting-free-competence'] = defaultEmptyObject;
      newProject['setting-free-vet'] = false;
      break;
    default:
      break;
  }

  // // Reset other fields
  newProject['fate-of-animals-complete'] = false;
  newProject['protocols-complete'] = false;

  return newProject;
};

export default resetFieldsBasedOnCheckbox;
