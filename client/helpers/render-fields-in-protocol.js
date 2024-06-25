export const renderFieldsInProtocol = (fateOfAnimals) => {
    if (!fateOfAnimals) {
        return [];
    }

    // Inject to ../schema/v01/index all possible fields
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

    // Initialize an array with placeholders for the fields
    const orderedFields = new Array(6).fill(null);

    // Assign fields to their specific positions
    if (fateOfAnimals.includes('killed')) {
        orderedFields[0] = predefinedFields['killed'];
    }

    // 'continued-use' should always be the second field
    orderedFields[1] = predefinedFields['continued-use'];

    if (fateOfAnimals.includes('used-in-other-projects')) {
        orderedFields[2] = predefinedFields['continued-use-2'];
    }

    if (fateOfAnimals.includes('set-free')) {
        orderedFields[3] = predefinedFields['set-free'];
    }

    if (fateOfAnimals.includes('rehomed')) {
        orderedFields[4] = predefinedFields['rehomed'];
    }

    if (fateOfAnimals.includes('set-free') || fateOfAnimals.includes('rehomed')) {
        orderedFields[5] = predefinedFields['kept-alive'];
    }

    // Filter out the null values
    return orderedFields.filter(field => field !== null);
};
