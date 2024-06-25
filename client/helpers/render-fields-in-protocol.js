export const renderFieldsInProtocol = (fateOfAnimals) => {
    if (!fateOfAnimals) {
        return [];
    }

    let conditionalFields = [];

    if (fateOfAnimals.includes('killed')) {
        conditionalFields.push({
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
        });
    }

    if (fateOfAnimals.includes('set-free')) {
        conditionalFields.push(
            {
                label: 'Set free',
                value: 'set-free'
            },
            {
                label: 'Kept alive at the establishment for non-regulated purposes or possible reuse',
                hint: 'Non-regulated purposes could include handling, breeding or non-regulated procedures.',
                value: 'kept-alive'
            }
        );
    }

    if (fateOfAnimals.includes('rehomed')) {
        conditionalFields.push(
            {
                label: 'Rehomed',
                value: 'rehomed'
            },
            {
                label: 'Kept alive at the establishment for non-regulated purposes or possible reuse',
                hint: 'Non-regulated purposes could include handling, breeding or non-regulated procedures.',
                value: 'kept-alive'
            }
        );
    }

    return conditionalFields;
};
