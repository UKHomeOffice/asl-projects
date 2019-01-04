import ExperimentalDesign from './pages/sections/experimental-design';
import Protocols from './pages/sections/protocols'
import every from 'lodash/every';
import { COMPLETE, INCOMPLETE, PARTIALLY_COMPLETE } from './constants/completeness';

export default {
  introduction: {
    title: 'Project introduction',
    subsections: {
      details: {
        title: 'Project details',
        fields: [
          {
            name: 'title',
            required: true,
            label: 'Title',
            type: 'text'
          }
        ]
      }
    }
  },
  protocols: {
    title: 'Protocols',
    subsections: {
      protocols: {
        title: 'Protocols',
        name: 'protocols',
        component: Protocols,
        complete: values => {
          if (!values.protocols) {
            return INCOMPLETE;
          }
          if (values.protocols.length && every(values.protocols, p => p.complete)) {
            return COMPLETE;
          }
          return PARTIALLY_COMPLETE;
        },
        setup: {
          fields: [{
            name: 'gaas',
            label: 'Will you use genetically-altered animals (GAAs) in this project?',
            type: 'radio',
            className: [
              'inline',
              'smaller'
            ],
            options: [
              'Yes',
              'No'
            ]
          },
          {
            name: 'quantitative',
            label: 'Will this project generate quantitative data',
            type: 'radio',
            className: [
              'inline',
              'smaller'
            ],
            options: [
              'Yes',
              'No'
            ]
          },
          {
            name: 'anaesthesia',
            label: 'Will you be using anaesthesia during this project',
            type: 'radio',
            className: [
              'inline',
              'smaller'
            ],
            options: [
              'Yes',
              'No'
            ]
          },
          {
            name: 'substances',
            label: 'Will you be using substances for testing or physiological effects during this project?',
            type: 'radio',
            className: [
              'inline',
              'smaller'
            ],
            options: [
              'Yes',
              'No'
            ]
          }]
        },
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text'
          },
        ],
        sections: {
          details: {
            title: 'Protocol details',
            fields: [
              {
                name: 'description',
                label: 'Briefly describe the scientific purposes of this protocol',
                hint: 'Information about protocol steps should be added later',
                type: 'textarea'
              },
              {
                name: 'severity',
                label: 'What is the prospective severity of this protocol?',
                type: 'radio',
                options: [
                  'Mild',
                  'Moderate',
                  'Severe',
                  'Non-recovery'
                ],
                className: 'smaller'
              }
            ]
          },
          quantitative: {
            title: 'Quantitative data',
            fields: [
              {
                name: 'control-groups',
                label: 'How will you use control groups?',
                type: 'textarea'
              },
              {
                name: 'control-groups-size',
                label: 'How will you determine the size of these groups?',
                type: 'textarea'
              },
              {
                name: 'effect-size',
                label: 'What \'effect size\' will you need for this protocol and why?',
                type: 'textarea'
              }
            ]
          },
          animals: {
            title: 'Animals used in this protocol',
            fields: [
              {
                name: 'animals',
                label: 'Which types of animals would you like to add to this protocol?',
                type: 'checkbox',
                optionsFromKey: 'animals'
              }
            ]
          },
          steps: {
            title: 'Steps',
            hint: 'Step numbers are for reference only, and you will be able to reorder them at any time before you submit you project licence application.',
            fields: [
              {
                name: 'title',
                type: 'textarea',
                label: 'To ensure that an adequate harm benifit assessment can be performed for your project, please provide clear and explicit information for each step.'
              },
              {
                name: 'anaesthesia',
                label: 'Does this step involve the administration of anaesthesia?',
                type: 'radio',
                className: [
                  'smaller',
                  'inline'
                ],
                options: [
                  'Yes',
                  'No'
                ]
              },
              {
                name: 'optional',
                label: 'Is this step optional?',
                type: 'radio',
                className: [
                  'smaller',
                  'inline'
                ],
                options: [
                  'Yes',
                  'No'
                ]
              }
            ],
            additional: {
              title: 'Additional information',
              fields: [
                {
                  name: 'adverse',
                  label: 'Do you expect this step to have any adverse effects for the animals?',
                  type: 'radio',
                  className: [
                    'smaller',
                    'inline'
                  ],
                  options: [
                    'Yes',
                    'No'
                  ]
                },
                {
                  name: 'endpoints',
                  label: 'What are the humane endpoints for this step?',
                  type: 'textarea'
                }
              ]
            }
          },
          experience: {
            title: 'Animal experience',
            fields: []
          },
          justification: {
            title: 'Protocol justification',
            fields: []
          },
          fate: {
            title: 'Fate of animals',
            fields: []
          }
        }
      }
    }
  },
  'project-plan': {
    title: 'Project plan',
    subsections: {
      'sandwich-design': {
        title: 'Sandwich design',
        component: ExperimentalDesign,
        fields: [
          {
            name: 'bread',
            label: 'What kind of bread would you like in your sandwich?',
            type: 'radio',
            options: [
              'White',
              'Brown'
            ],
            step: 0
          },
          {
            name: 'meat',
            label: 'What kind of meat would you like in your sandwich?',
            type: 'radio',
            options: [
              'Chicken',
              'Pork',
              'Beef'
            ],
            step: 0
          },
          {
            name: 'salad',
            label: 'What salads would you like included in your sandwich?',
            type: 'checkbox',
            options: [
              'Lettuce',
              'Tomato',
              'Cucumber'
            ],
            step: 1
          },
          {
            name: 'additional-instructions',
            label: 'Are there any additional requests?',
            type: 'textarea',
            step: 2
          }
        ]
      }
    }
  }
}
