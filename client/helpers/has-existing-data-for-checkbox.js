/**
 * @desc Takes @param project:Object and @param checkboxValue: String. Checks if there is any existing data in the nodes of the NTS [fate-of-animal] fields associated with the checkbox value.
 * @returns {Object} An object containing the checkbox value and a boolean indicating if there is existing data.
 * */
const hasExistingDataForCheckbox = (project, checkboxValue) => {
  const checkNodes = (nodes) => {
    for (let node of nodes) {
      if (node.object === 'text' && node.text && node.text.trim() !== '') {
        return true;
      }
      if (node.object === 'block' && node.nodes && checkNodes(node.nodes)) {
        return true;
      }
    }
    return false;
  };

  const checkField = (field) => {
    return field && field.document && field.document.nodes && checkNodes(field.document.nodes);
  };

  let hasData = false;

  if (checkboxValue === 'killed' || checkboxValue === 'used-in-other-projects') {
    for (let protocol of project.protocols) {
      switch (checkboxValue) {
        case 'killed':
          hasData = checkField(protocol['method-and-justification']);
          break;
        case 'used-in-other-projects':
          hasData = checkField(protocol['continued-use-relevant-project']);
          break;
        default:
          break;
      }
      // Break the loop if data is found
      if (hasData) {
        break;
      }
    }
  } else {
    switch (checkboxValue) {
      case 'kept-alive':
        hasData = [
          project['keeping-alive-complete'] ||
                    checkField(project['keeping-animals-alive-determine']) ||
                    checkField(project['keeping-animals-alive-supervised']) ||
                    checkField(project['kept-alive-animals'])
        ].some(field => field === true);
        break;
      case 'rehomed':
        hasData = [
          project['rehoming-complete'] ||
                    checkField(project['rehoming-harmful']) ||
                    checkField(project['rehoming-healthy']) ||
                    checkField(project['rehoming-other']) ||
                    checkField(project['rehoming-types'])
        ].some(field => field === true);
        break;
      case 'set-free':
        hasData = [
          project['setting-free-complete'] ||
                    checkField(project['setting-free-ensure-not-harmful']) ||
                    checkField(project['setting-free-health']) ||
                    checkField(project['setting-free-lost']) ||
                    checkField(project['setting-free-recapturing']) ||
                    checkField(project['setting-free-rehabilitate']) ||
                    checkField(project['setting-free-socialise']) ||
                    project['setting-free-vet']
        ].some(field => field === true);
        break;
      default:
        hasData = false;
    }
  }

  return { checkboxValue, hasData };
};

export default hasExistingDataForCheckbox;
