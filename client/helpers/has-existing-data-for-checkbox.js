function checkNodes(nodes) {
  for (let node of nodes) {
    if (node.object === 'text' && node.text && node.text.trim() !== '') {
      return true;
    }
    if (node.object === 'block' && node.nodes && checkNodes(node.nodes)) {
      return true;
    }
  }
  return false;
}

function checkField(field) {
  return field && field.document && field.document.nodes && checkNodes(field.document.nodes);
}

function hasKeptAliveData(project) {
  const fields = [
    project['keeping-alive-complete'] ||
    checkField(project['keeping-animals-alive-determine']) ||
    checkField(project['keeping-animals-alive-supervised']) ||
    checkField(project['kept-alive-animals'])
  ];

  return fields.some(Boolean);
}

const protocolHasDataForValue = (checkboxValue) => (protocol) => {
  if (Array.isArray(protocol['fate']) && protocol['fate'].includes(checkboxValue)) {
    return true;
  }

  switch (checkboxValue) {
    case 'killed':
      return checkField(protocol['method-and-justification']);
    case 'used-in-other-projects':
      return checkField(protocol['continued-use-relevant-project']);
    default:
      return false;
  }
};

const hasProtocolLevelData = (project, checkboxValue) =>
  (project.protocols || []).some(protocolHasDataForValue(checkboxValue));

const hasProjectLevelData = (project, checkboxValue) => {
  switch (checkboxValue) {
    case 'kept-alive':
      return hasKeptAliveData(project);

    case 'rehomed': {
      const fields = [
        project['rehoming-complete'] ||
          checkField(project['rehoming-harmful']) ||
          checkField(project['rehoming-healthy']) ||
          checkField(project['rehoming-other']) ||
          checkField(project['rehoming-types'])
      ];

      return fields.some(Boolean) || hasKeptAliveData(project);
    }
    case 'set-free': {
      const fields = [
        project['setting-free-complete'] ||
          checkField(project['setting-free-ensure-not-harmful']) ||
          checkField(project['setting-free-health']) ||
          checkField(project['setting-free-lost']) ||
          checkField(project['setting-free-recapturing']) ||
          checkField(project['setting-free-rehabilitate']) ||
          checkField(project['setting-free-socialise']) ||
          project['setting-free-vet']
      ];

      return fields.some(Boolean) || hasKeptAliveData(project);
    }
    default:
      return false;
  }
};

/**
 * @desc Takes @param project:Object and @param checkboxValue: String. Checks if there is any existing data in the nodes of the NTS [fate-of-animal] fields associated with the checkbox value.
 * @returns {Object} An object containing the checkbox value and a boolean indicating if there is existing data.
 * */
const hasExistingDataForCheckbox = (project, checkboxValue) => {
  const hasData = hasProjectLevelData(project, checkboxValue) || hasProtocolLevelData(project, checkboxValue);
  return { checkboxValue, hasData };
};

export default hasExistingDataForCheckbox;
