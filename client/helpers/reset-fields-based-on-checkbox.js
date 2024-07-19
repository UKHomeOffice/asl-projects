import cloneDeep from 'lodash/cloneDeep';

const resetFieldsBasedOnCheckbox = (project, checkboxValue) => {
  // Deep clone the project object to avoid mutating it directly
  const newProject = cloneDeep(project);

  switch (checkboxValue) {
    case 'killed':
      newProject['method-and-justification'] = {};
      break;
    case 'used-in-other-projects':
      newProject['continued-use-relevant-project'] = {};
      break;
    case 'kept-alive':
      newProject['keeping-alive-complete'] = false;
      newProject['keeping-animals-alive-determine'] = {};
      newProject['keeping-animals-alive-supervised'] = {};
      newProject['kept-alive-animals'] = {};
      break;
    case 'rehomed':
      newProject['rehoming-complete'] = false;
      newProject['rehoming-harmful'] = {};
      newProject['rehoming-healthy'] = {};
      newProject['rehoming-other'] = {};
      newProject['rehoming-types'] = {};
      break;
    case 'set-free':
      newProject['setting-free-complete'] = false;
      newProject['setting-free-ensure-not-harmful'] = {};
      newProject['setting-free-health'] = {};
      newProject['setting-free-lost'] = {}; // Adjusted to match the specified format
      newProject['setting-free-recapturing'] = {};
      newProject['setting-free-rehabilitate'] = {};
      newProject['setting-free-socialise'] = {};
      newProject['setting-free-vet'] = false;
      break;
    default:
      break;
  }

  // // Reset other fields
  // newProject['nts-review-complete'] = false;
  // newProject['protocols-complete'] = false;

  return newProject;
};

export default resetFieldsBasedOnCheckbox;
