/**
 * @desc @desc takes @param project:Object, @param checkboxValue: String, select checkbox value, will reset any data nodes associated to NTS checkbox.
 * @returns {Object} An object containing the checkbox value.
 * */
import cloneDeep from 'lodash/cloneDeep';
import intersection from 'lodash/intersection';

const defaultEmptyObject = () => ({
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
});

const resetFieldsBasedOnCheckbox = (project, checkboxValue) => {
  // Deep clone the project object to avoid mutating it directly and manipulate NTS data fields.
  const newProject = cloneDeep(project);
  newProject['fate-of-animals'] = (project['fate-of-animals'] ?? []).filter(v => v !== checkboxValue);
  let protocolsComplete = project['protocols-complete'];

  newProject.protocols = newProject.protocols.map(protocol => {
    const updatedProtocol = {
      ...protocol,
      fate: (protocol.fate ?? []).filter(value => value !== checkboxValue)
    };

    // If the protocol previously had this fate, mark it as incomplete. Casts
    // existing value to boolean as undefined causes issues with calculating the
    // checksum for the project.
    updatedProtocol.complete =
      !!protocol.complete &&
      updatedProtocol.fate.length === (protocol.fate ?? []).length;

    protocolsComplete = protocolsComplete && updatedProtocol.complete;

    switch (checkboxValue) {
      case 'killed':
        return {
          ...updatedProtocol,
          'method-and-justification': defaultEmptyObject(),
          'non-schedule-1': false
        };
      case 'used-in-other-projects':
        return {
          ...updatedProtocol,
          'continued-use-relevant-project': defaultEmptyObject()
        };
      default:
        return updatedProtocol;
    }
  });

  switch (checkboxValue) {
    case 'rehomed':
      newProject['rehoming-complete'] = false;
      newProject['rehoming-harmful'] = defaultEmptyObject();
      newProject['rehoming-healthy'] = defaultEmptyObject();
      newProject['rehoming-other'] = defaultEmptyObject();
      newProject['rehoming-types'] = defaultEmptyObject();
      break;
    case 'set-free':
      newProject['setting-free-complete'] = false;
      newProject['setting-free-ensure-not-harmful'] = defaultEmptyObject();
      newProject['setting-free-health'] = defaultEmptyObject();
      newProject['setting-free-lost'] = defaultEmptyObject(); // Adjusted to match the specified format
      newProject['setting-free-recapturing'] = defaultEmptyObject();
      newProject['setting-free-rehabilitate'] = defaultEmptyObject();
      newProject['setting-free-socialise'] = defaultEmptyObject();
      newProject['setting-free-competence'] = defaultEmptyObject();
      newProject['setting-free-vet'] = false;
      break;
    default:
      break;
  }

  // Three of the fate of animals options trigger the kept alive consideration.
  // Only if none are selected, should it be cleared out.
  const triggeringOptions = ['kept-alive', 'rehomed', 'set-free'];
  const questionIsShown = intersection(
    newProject['fate-of-animals'] ?? [],
    triggeringOptions
  ).length > 0;

  if (!questionIsShown) {
    newProject['keeping-alive-complete'] = false;
    newProject['keeping-animals-alive-determine'] = defaultEmptyObject();
    newProject['keeping-animals-alive-supervised'] = defaultEmptyObject();
    newProject['kept-alive-animals'] = defaultEmptyObject();
  }

  // If any protocols we're marked as incomplete also make the section as incomplete.
  newProject['protocols-complete'] = protocolsComplete;

  return newProject;
};

export default resetFieldsBasedOnCheckbox;
