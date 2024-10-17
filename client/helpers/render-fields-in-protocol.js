import NTSFateOfAnimalFields from './nts-field';

export const renderFieldsInProtocol = (fateOfAnimals) => {
  const predefinedFields = NTSFateOfAnimalFields();

  if (!fateOfAnimals) {
    return [predefinedFields['continued-use']];
  }

  // Create an ordered list of fields based on fateOfAnimals
  const orderedFields = [
    fateOfAnimals.includes('killed') ? predefinedFields['killed'] : null,
    predefinedFields['continued-use'], // This field is always present
    fateOfAnimals.includes('used-in-other-projects') ? predefinedFields['continued-use-2'] : null,
    fateOfAnimals.includes('set-free') ? predefinedFields['set-free'] : null,
    fateOfAnimals.includes('rehomed') ? predefinedFields['rehomed'] : null,
    fateOfAnimals.includes('kept-alive') ? predefinedFields['kept-alive'] : null
  ];

  // Filter out null values
  return orderedFields.filter(field => field !== null);
};
