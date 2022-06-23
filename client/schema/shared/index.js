export const transferOfAnimals = {
  title: 'Transfer and movement of animals',
  showSummary: 'project has additional establishments, or a change of primary establishment is being carried out',
  show: values => {
    const hasAdditionalEstablishments = values['other-establishments'] && values.establishments && values.establishments.length;
    const isTransfer = !!values['transferToEstablishment'];
    return hasAdditionalEstablishments || isTransfer;
  },
  fields: [
    {
      name: 'transfer',
      label: 'Will any animals undergoing regulated procedures be moved between licensed establishments?',
      hint: 'This includes genetically altered animals being bred or maintained under the authority of your project licence.',
      type: 'radio',
      inline: true,
      className: 'smaller',
      options: [
        {
          label: 'Yes',
          value: true,
          reveal: [
            {
              name: 'transfer-what',
              label: 'What types of animals do you need to move? What regulated procedures will they have undergone?',
              type: 'texteditor'
            },
            {
              name: 'transfer-why',
              label: 'Why do you need to move animals between licensed establishments?',
              type: 'texteditor'
            },
            {
              name: 'transfer-how',
              label: 'How might the movement of animals between licensed establishments affect scientific delivery of the work?',
              type: 'texteditor'
            },
            {
              name: 'transfer-measures',
              label: 'What measures will you use to minimise any adverse effects for animals that may arise when moving them between licensed establishments?',
              type: 'texteditor'
            },
            {
              name: 'transfer-recovery',
              label: 'Will surgically prepared animals be given a minimum of 7 days to recover before being transferred?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true
                },
                {
                  label: 'No',
                  value: false,
                  reveal: {
                    name: 'transfer-no-recovery',
                    label: 'Why won\'t animals be given 7 days to recover before being transferred?',
                    type: 'texteditor'
                  }
                }
              ]
            },
            {
              name: 'transfer-acclimatisation',
              label: 'Will animals be given a minimum of 7 days to acclimatise to their new surroundings prior to any regulated procedures being undertaken?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true
                },
                {
                  label: 'No',
                  value: false,
                  reveal: {
                    name: 'transfer-no-acclimatisation',
                    label: 'Why won\'t animals be given 7 days to acclimatise to their new surroundings?',
                    type: 'texteditor'
                  }
                }
              ]
            }
          ]
        },
        {
          label: 'No',
          value: false
        }
      ]
    }
  ]
};
