export const renderFieldsInProtocol = (fateOfAnimals) => {
  if (!fateOfAnimals) {
    return [];
  }

  const predefinedFields = {
    'killed': {
      label: 'Killed',
      value: 'killed',
      hint: 'Ensure you describe the methods of killing to be used in the final step of this protocol.',
      reveal: {
        label: 'Will you be using non-schedule 1 killing methods on a conscious animal?',
        name: 'non-schedule-1',
        type: 'radio',
        className: 'smaller',
        inline: true,
        options: [
          {
            label: 'Yes',
            value: true,
            reveal: {
              name: 'method-and-justification',
              label: 'For each non-schedule 1 method, explain why this is necessary.',
              type: 'texteditor'
            }
          },
          {
            label: 'No',
            value: false
          }
        ]
      }
    },
    'continued-use': {
      label: 'Continued use on another protocol in this project',
      value: 'continued-use',
      reveal: {
        name: 'continued-use-relevant-project',
        label: 'Please state the relevant protocol.',
        type: 'texteditor'
      }
    },
    'continued-use-2': {
      label: 'Continued use on other projects',
      value: 'continued-use-2'
    },
    'set-free': {
      label: 'Set free',
      value: 'set-free'
    },
    'rehomed': {
      label: 'Rehomed',
      value: 'rehomed'
    },
    'kept-alive': {
      label: 'Kept alive at the establishment for non-regulated purposes or possible reuse',
      hint: 'Non-regulated purposes could include handling, breeding or non-regulated procedures.',
      value: 'kept-alive'
    }
  };

  // Create an ordered list of fields based on fateOfAnimals
  const orderedFields = [
    fateOfAnimals.includes('killed') ? predefinedFields['killed'] : null,
    predefinedFields['continued-use'], // This field is always present
    fateOfAnimals.includes('used-in-other-projects') ? predefinedFields['continued-use-2'] : null,
    fateOfAnimals.includes('set-free') ? predefinedFields['set-free'] : null,
    fateOfAnimals.includes('rehomed') ? predefinedFields['rehomed'] : null,
    (fateOfAnimals.includes('set-free') || fateOfAnimals.includes('rehomed')) ? predefinedFields['kept-alive'] : null
  ];

  // Filter out null values
  return orderedFields.filter(field => field !== null);
};
