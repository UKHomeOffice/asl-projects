import NTSFateOfAnimalFields from './nts-field';

export const renderFieldsInProtocol = (fateOfAnimals) => {
  if (!fateOfAnimals) {
    return [
      {'continued-use': {
        label: 'Continued use on another protocol in this project',
        value: 'continued-use',
        reveal: {
          name: 'continued-use-relevant-project',
          label: 'Please state the relevant protocol.',
          type: 'texteditor'
        }
      }}];
  }

  const predefinedFields = NTSFateOfAnimalFields();

  // Create an ordered list of fields based on fateOfAnimals
  const orderedFields = [
    fateOfAnimals.includes('killed') ? predefinedFields['killed'] : null,
    predefinedFields['continued-use'], // This field is always present
    fateOfAnimals.includes('used-in-other-projects') ? predefinedFields['continued-use-2'] : null,
    fateOfAnimals.includes('set-free') ? predefinedFields['set-free'] : null,
    fateOfAnimals.includes('rehomed') ? predefinedFields['rehomed'] : null,
    (fateOfAnimals.includes('set-free') || fateOfAnimals.includes('rehomed')) ||
    fateOfAnimals.includes('kept-alive')
      ? predefinedFields['kept-alive'] : null
  ];

  // Filter out null values
  return orderedFields.filter(field => field !== null);
};
