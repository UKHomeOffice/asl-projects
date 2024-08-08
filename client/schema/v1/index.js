import Protocols from '../../pages/sections/protocols';
import ProtocolsReview from '../../pages/sections/protocols/review';
import Objectives from '../../pages/sections/objectives';
import ObjectivesReview from '../../pages/sections/objectives/review';
import Repeater from '../../pages/sections/repeater';
import RepeaterReview from '../../pages/sections/repeater/review';
import Establishments from '../../pages/sections/establishments';
import EstablishmentsReview from '../../pages/sections/establishments/review';
import Conditions from '../../pages/sections/conditions';
import Authorisations from '../../pages/sections/authorisations';
import Training from '../../pages/sections/training';

import { transferOfAnimals } from '../shared';

// granted components
import ProjectSummary from '../../pages/sections/granted/project-summary';
import GrantedConditions from '../../pages/sections/granted/conditions';
import GrantedAuthorisations from '../../pages/sections/granted/authorisations';
import ActionPlan from '../../pages/sections/granted/action-plan';
import Purpose from '../../pages/sections/granted/protocol-purpose';
import ProtocolEstablishments from '../../pages/sections/granted/protocol-establishments';
import ProtocolObjectives from '../../pages/sections/granted/protocol-objectives';
import GrantedProtocols from '../../pages/sections/granted/protocols';

import GrantedSteps from '../../pages/sections/granted/protocol-steps';

import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';

import intersection from 'lodash/intersection';
import some from 'lodash/some';

import experience from './experience';
import permissiblePurpose from './permissible-purpose';

import confirmProtocolsAffected from '../../helpers/confirm-protocols-affected';

import {isTrainingLicence, markdownLink, getCurrentURLForFateOfAnimals} from '../../helpers';

export default () => {
  return ({
    introduction: {
      title: 'Introductory details',
      subsections: {
        introduction: {
          title: 'Introductory details',
          grantedTitle: 'Project summary',
          granted: {
            order: 0,
            title: 'Project summary',
            review: ProjectSummary
          },
          fields: [
            {
              name: 'title',
              label: 'What\'s the title of this project?',
              hint: 'Focus on your broad aims and use simple language. For example \'Genes and lifestyle influences on brain ageing\'.',
              type: 'text'
            },
            {
              name: 'training-licence',
              label: 'Is this project for higher education and training purposes?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  additionalInfo: `Permissible purpose: (f) Higher education or training for the acquisition, maintenance or improvement of vocational skills`,
                  reveal: [
                    {
                      name: 'training-why-needed',
                      label: 'Why is this higher education and training licence needed?',
                      type: 'texteditor'
                    },
                    {
                      name: 'training-related-discipline',
                      label: 'What course or scientific or medical discipline does this application relate to?',
                      type: 'texteditor'
                    }
                  ]
                },
                {
                  label: 'No',
                  value: false,
                  reveal: permissiblePurpose
                }
              ]
            },
            {
              name: 'duration',
              label: 'What will be the duration of this project?',
              review: 'Project licence duration',
              type: 'duration'
            },
            {
              name: 'species',
              label: 'Which types of animals will be used in this project?',
              type: 'species-selector',
              confirmRemove: confirmProtocolsAffected('remove', 'species', 'animal type'),
              summary: true
            }
          ]
        }
      }
    },
    nts: {
      title: 'Non-technical summary',
      subsections: {
        aims: {
          title: 'Aims',
          nts: true,
          fields: [
            {
              name: 'project-aim',
              label: 'What\'s the aim of this project?',
              hint: 'Keep this to a short one or two sentence summary.',
              playbackLabel: 'Aim of this project',
              type: 'texteditor'
            },
            {
              name: 'project-importance',
              label: 'Why is it important to undertake this work?',
              type: 'texteditor'
            },
            {
              name: 'keywords',
              label: 'Key words that describe this project',
              hint: 'Choose up to 5. For example: cancer, stem cells, therapy.',
              type: 'keywords'
            }
          ]
        },
        benefits: {
          title: 'Benefits',
          nts: true,
          fields: [
            {
              name: 'benefit-outputs',
              show: values => !isTrainingLicence(values),
              label: 'What outputs do you think you will see at the end of this project?',
              hint: 'Outputs can include new information, publications, or products.',
              type: 'texteditor'
            },
            {
              name: 'benefit-who',
              show: values => !isTrainingLicence(values),
              label: 'Who or what will benefit from these outputs, and how?',
              hint: 'The impact of these outputs may be seen in the short-term, or they may not be fully realised until you\'ve completed the project. Consider all timescales in your answer.',
              type: 'texteditor'
            },
            {
              name: 'benefit-service',
              show: values => !isTrainingLicence(values),
              label: 'Will this work be offered as a service to others?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'benefit-service-benefits',
                    label: 'What are the benefits of offering this work as a service?',
                    type: 'texteditor'
                  }
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'training-benefit-future-careers',
              show: values => isTrainingLicence(values),
              label: 'How will course attendees use their knowledge or skills in their future careers?',
              type: 'texteditor'
            },
            {
              name: 'training-benefit-principle-learning-outcomes',
              show: values => isTrainingLicence(values),
              label: 'What are the principal learning outcomes from the course?',
              type: 'texteditor'
            },
            {
              name: 'training-benefit-learning-outcomes-important',
              show: values => isTrainingLicence(values),
              label: 'How are these learning outcomes important to the people on the course?',
              type: 'texteditor'
            },
            {
              name: 'training-benefit-transfer-of-knowledge',
              show: values => isTrainingLicence(values),
              label: 'Who or what will benefit from the transfer of knowledge, or acquisition of skills that this course will deliver?',
              type: 'texteditor'
            },
            {
              name: 'benefit-maximise-outputs',
              label: 'How will you look to maximise the outputs of this work?',
              hint: 'For example, collaboration, dissemination of new knowledge, or publication of unsuccessful approaches.',
              type: 'texteditor'
            }
          ]
        },
        'project-harms': {
          title: 'Project harms',
          nts: true,
          fields: [
            {
              name: 'project-harms-animals',
              label: 'Explain why you are using these types of animals and your choice of life stages.',
              type: 'texteditor'
            },
            {
              name: 'project-harms-summary',
              label: 'Typically, what will be done to an animal used in your project?',
              hint: 'For example, injections and surgical procedures. Include any relevant information about the duration of experiments and the number of procedures.',
              type: 'texteditor'
            },
            {
              name: 'project-harms-effects',
              label: 'What are the expected impacts and/or adverse effects for the animals during your project?',
              hint: 'Examples can include pain, weight loss, tumours, or abnormal behaviour. State the estimated duration of these effects on an animal.',
              type: 'texteditor'
            },
            {
              name: 'project-harms-severity',
              label: 'What are the expected severities and the proportion of animals in each category (per animal type)?',
              type: 'texteditor'
            }
          ]
        },
        'fate-of-animals': {
          title: 'Fate of animals',
          nts: true,
          fields: [
            {
              name: 'fate-of-animals',
              label: 'What will happen to animals used in this project?',
              hint: 'Select all fates that apply across the whole project. You will be asked later about the fate of animals used in each protocol. Only the fates you select here will be presented as options in the Protocols section.',
              type: 'checkbox',
              className: 'smaller',
              options: [
                {
                  label: 'Killed',
                  value: 'killed'
                },
                {
                  label: 'Used in other projects',
                  value: 'used-in-other-projects'
                },
                {
                  label: 'Set free',
                  value: 'set-free'
                },
                {
                  label: 'Rehomed',
                  value: 'rehomed'
                },
                {
                  label: 'Kept alive at the establishment for non-regulated purposes or possible reuse',
                  hint: 'Non-regulated purposes could include handling, breeding or non-regulated procedures.',
                  value: 'kept-alive'
                }
              ]
            }
          ]
        },
        replacement: {
          title: 'Replacement',
          playback: 'project-aim',
          reviewTitle: '3Rs: Replacement',
          nts: true,
          fields: [
            {
              name: 'replacement-why',
              label: 'Why do you need to use animals to achieve the aim of your project?',
              type: 'texteditor'
            },
            {
              name: 'replacement-alternatives',
              show: values => !isTrainingLicence(values),
              label: 'Which non-animal alternatives did you consider for use in this project?',
              type: 'texteditor'
            },
            {
              name: 'replacement-justification',
              show: values => !isTrainingLicence(values),
              label: 'Why were they not suitable?',
              type: 'texteditor'
            },
            {
              name: 'training-replacement-observation',
              show: values => isTrainingLicence(values),
              label: 'Why can\'t your aim be met by observing or by participating in ongoing research or clinical procedures?',
              type: 'texteditor'
            }
          ]
        },
        reduction: {
          title: 'Reduction',
          reviewTitle: '3Rs: Reduction',
          nts: true,
          fields: [
            {
              name: 'reduction-quantities',
              label: 'Enter the estimated number of animals of each type used in this project.',
              type: 'animal-quantities'
            },
            {
              name: 'reduction-estimation',
              label: 'How have you estimated the numbers of animals you will use?',
              hint: 'Do not mention POWER calculations here. If relevant, there will be an opportunity to provide these details elsewhere.',
              type: 'texteditor'
            },
            {
              name: 'reduction-steps',
              show: values => !isTrainingLicence(values),
              label: 'What steps did you take during the experimental design phase to reduce the number of animals being used in this project?',
              hint: 'You may want to reference online tools (such as the NC3R\'s Experimental Design Assistant) or any relevant regulatory requirements.',
              type: 'texteditor'
            },
            {
              name: 'reduction-review',
              show: values => !isTrainingLicence(values),
              label: 'What measures, apart from good experimental design, will you use to optimise the number of animals you plan to use in your project?',
              hint: 'This may include efficient breeding, pilot studies, computer modelling, or sharing of tissue.',
              type: 'texteditor'
            },
            {
              name: 'training-reduction-techniques',
              show: values => isTrainingLicence(values),
              label: 'What in silico or ex vivo techniques will you use during training?',
              type: 'texteditor'
            },
            {
              name: 'training-reduction-animal-numbers',
              show: values => isTrainingLicence(values),
              label: 'Will these techniques reduce animal numbers? If so, how?',
              type: 'texteditor'
            },
            {
              name: 'training-reduction-other-measures',
              show: values => isTrainingLicence(values),
              label: 'What other measures will you use to minimise the number of animals you plan to use in your project?',
              type: 'texteditor'
            }
          ]
        },
        refinement: {
          title: 'Refinement',
          reviewTitle: '3Rs: Refinement',
          nts: true,
          fields: [
            {
              name: 'refinement-models',
              label: 'Which animal models and methods will you use during this project?',
              hint: 'Explain why these models and methods cause the least pain, suffering, distress, or lasting harm to the animals.',
              type: 'texteditor'
            },
            {
              name: 'refinement-less-sentient',
              label: 'Why can’t you use animals that are less sentient?',
              hint: 'For example, animals at a more immature life stage, species that are less sentient, or animals that have been terminally anaesthetised.',
              type: 'texteditor'
            },
            {
              name: 'refinement-3rs-advances',
              label: 'How will you stay informed about advances in the 3Rs, and implement these advances effectively, during the project?',
              type: 'texteditor'
            },
            {
              name: 'refinement-explaination',
              label: 'How will you refine the procedures you\'re using to minimise the welfare costs (harms) for the animals?',
              hint: 'Potential refinements include increased monitoring, post-operative care, pain management, and training of animals.',
              type: 'texteditor'
            },
            {
              name: 'refinement-published-guidance',
              label: 'What published best practice guidance will you follow to ensure experiments are conducted in the most refined way?',
              type: 'texteditor'
            }
          ]
        }
      }
    },
    applicantInformation: {
      title: 'Applicant information',
      subsections: {
        experience,
        funding: {
          title: 'Funding',
          show: values => !isTrainingLicence(values),
          fields: [
            {
              name: 'funding-how',
              label: 'How do you plan to fund your work?',
              hint: 'If you do not have full funding, explain how you will stage your work and the likelihood of you obtaining further funding.',
              type: 'texteditor'
            },
            {
              name: 'funding-basic-translational',
              label: 'Will this work support basic or translational research, or non-regulatory drug or device development?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'funding-reviewed',
                    label: 'Were any grant applications for this work peer reviewed? If so, by whom and what was the outcome?',
                    type: 'texteditor'
                  }
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            }
          ]
        },
        training: {
          title: 'Training',
          intro: 'Add details of relevant training completed. All project licence holders must have completed the PPL and E2 training modules, unless they have grounds for an exemption.',
          component: Training,
          review: Training,
          fields: [
            {
              name: 'training-complete',
              label: 'Do you need to update this training record?',
              type: 'radio',
              className: 'smaller',
              options: [
                {
                  label: 'Yes, I need to update it',
                  value: false
                },
                {
                  label: 'No, this training record is up to date',
                  value: true
                }
              ]
            }
          ]
        }
      }
    },
    projectLocation: {
      title: 'Project location',
      subsections: {
        establishments: {
          title: 'Establishments',
          review: EstablishmentsReview,
          repeats: 'establishments',
          singular: 'Additional establishment',
          steps: [
            {
              fields: [
                {
                  name: 'transferToEstablishment',
                  label: 'What is the primary establishment for this licence?',
                  type: 'establishment-selector',
                  show: application => application.project && !application.isFullApplication
                },
                {
                  name: 'other-establishments',
                  label: 'Will your project use any additional establishments?',
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
                      value: false
                    }
                  ]
                }
              ]
            },
            {
              component: Establishments,
              show: values => values['other-establishments'],
              repeats: 'establishments',
              singular: 'Additional establishment',
              addAnotherLabel: 'Add another additional establishment',
              confirmRemove: confirmProtocolsAffected('remove', 'locations', 'establishment', 'establishment-name'),
              fields: [
                {
                  name: 'establishment-id',
                  label: 'Select an establishment where work will be carried out',
                  readOnlyWarning: 'Only the licence holder can agree to disclose their licence to another establishment.',
                  type: 'additional-availability',
                  repeats: true
                },
                {
                  name: 'establishment-about',
                  label: 'Why do you need to carry out work at this additional establishment?',
                  hint: 'For example, there may be important specialised equipment at this location that is not available at your primary establishment.',
                  type: 'texteditor',
                  repeats: true
                },
                {
                  name: 'establishment-supervisor',
                  label: 'Who will be responsible for supervising your work at this additional establishment?',
                  type: 'texteditor',
                  repeats: true
                }
              ]
            },
            {
              fields: [
                {
                  name: 'establishments-care-conditions',
                  label: 'Do the housing, husbandry, and care conditions at each establishment meet the requirements laid out in the Code of Practice for each type of animal you will be using?',
                  hint: 'Please read the Code of Practice for the housing and care of animals bred, supplied, or used for scientific purposes before you answer.',
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
                        name: 'establishments-care-conditions-justification',
                        label: 'If any establishment does not meet these requirements, or if any type of animal you\'re using is not listed in the Code of Practice, explain how you will ensure that housing, husbandry, and care conditions are appropriate for your project.',
                        type: 'texteditor'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        'transfer-of-animals': transferOfAnimals,
        poles: {
          title: 'Places other than a licensed establishment (POLEs)',
          review: RepeaterReview,
          repeaterFor: 'polesList',
          singular: 'POLE',
          steps: [
            {
              fields: [
                {
                  name: 'poles',
                  label: 'Will any part of your project be carried out in any places other than a licensed establishment (POLEs)?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: {
                        name: 'poles-justification',
                        label: 'Why can\'t this part of your project take place at a licensed establishment?',
                        type: 'texteditor'
                      }
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                }
              ]
            },
            {
              component: Repeater,
              repeats: 'polesList',
              singular: 'POLE',
              show: values => values.poles === true,
              confirmRemove: confirmProtocolsAffected('remove', 'locations', 'POLE', 'title'),
              subtitle: 'Specify the details of each POLE that you will be using.',
              intro: `If you can’t specify a grid reference for a POLE, include details that allows it to be easily identified for inspection. This could be an address of a site or a postcode of a farm.
  
  If you can only add generic information at this stage, provide a general description of the types of areas you are considering.`,
              fields: [
                {
                  name: 'title',
                  label: 'Name',
                  type: 'text',
                  repeats: true,
                  toggleEdit: true,
                  confirmEdit: confirmProtocolsAffected('edit', 'locations', 'POLE', 'title', 'name')
                },
                {
                  name: 'pole-info',
                  label: 'Details',
                  type: 'texteditor',
                  repeats: true
                }
              ]
            },
            {
              show: values => values.poles === true,
              fields: [
                {
                  name: 'poles-inspection',
                  label: 'How will you ensure that procedures taking place at these POLEs can be inspected?',
                  hint: 'For example, how will you obtain consent from landowners?',
                  type: 'texteditor'
                },
                {
                  name: 'poles-environment',
                  label: 'How will work at each POLE be done in the most environmentally sensitive manner?',
                  type: 'texteditor'
                },
                {
                  name: 'poles-transfer',
                  label: 'Will any animals be moved between a POLE and a licensed establishment during this project?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'poles-transfer-justification',
                          label: 'Why do you need to move animals between a POLE and a licensed establishment?',
                          type: 'texteditor'
                        },
                        {
                          name: 'poles-transfer-arrangements',
                          label: 'What arrangements have been made to ensure animals can be safely transported and that any permits necessary to transport the species under study are/will be held?',
                          type: 'texteditor'
                        },
                        {
                          name: 'poles-transfer-delivery',
                          label: 'How might the movement of animals between a POLE and a licensed establishment affect the scientific delivery of this project?',
                          type: 'texteditor'
                        },
                        {
                          name: 'poles-transfer-condition',
                          label: 'How will you ensure that animals are in a suitable condition to be transported?',
                          hint: 'Include all checks that will be made for suitability and what will happen to animals that are not suitable to be transported.',
                          type: 'texteditor'
                        },
                        {
                          name: 'poles-transfer-responsibility',
                          label: 'Who will be responsible for checking the animals before they are transported?',
                          hint: 'This does not need to be a Named Veterinary Surgeon.',
                          type: 'texteditor'
                        },
                        {
                          name: 'poles-transfer-checks',
                          label: 'How will you ensure that this person is competent to make the appropriate checks?',
                          type: 'texteditor'
                        },
                        {
                          name: 'poles-transfer-measures',
                          label: 'What arrangements will be made to assure an animal\'s welfare during transport, particularly if they are being moved after the start of regulated procedures?',
                          type: 'texteditor'
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
            }
          ]
        }
      }
    },
    projectPlan: {
      title: 'Project plan',
      subsections: {
        'scientific-background': {
          title: 'Scientific background',
          show: values => !isTrainingLicence(values),
          fields: [
            {
              name: 'scientific-background-basic-translational',
              label: 'Will this work support basic or translational research, or non-regulatory drug or device development?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'scientific-knowledge-summary',
                      label: 'Briefly summarise the current state of scientific knowledge in this area of work to show how you arrived at the starting point of this project.',
                      hint: 'Be specific and relevant to your project aim - there\'s no need for a detailed overview of the entire field. Include any relevant non-animal research if it has contributed to the starting point of your project.',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-knowledge-details',
                      label: 'What new knowledge do you hope to discover that will address a gap in fundamental scientific knowledge or meet a clinical need?',
                      hint: 'Refer to the basis for any scientific hypotheses you plan to test during this project.',
                      type: 'texteditor'
                    },
                    {
                      name: 'clinical-condition',
                      label: 'Does your project mainly involve translational or veterinary clinical applications?',
                      type: 'radio',
                      inline: true,
                      className: 'smaller',
                      options: [
                        {
                          label: 'Yes',
                          value: true,
                          reveal: [
                            {
                              name: 'condition-severity',
                              label: 'How prevalent and severe are the relevant clinical conditions?',
                              type: 'texteditor'
                            },
                            {
                              name: 'condition-treatments-problems',
                              label: 'What are the problems with current treatments which mean that further work is necessary?',
                              type: 'texteditor'
                            },
                            {
                              name: 'condition-scientific-approach',
                              label: 'What is the scientific basis for your proposed approach?',
                              type: 'texteditor'
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
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'scientific-background-producing-data',
              label: 'Will you be producing data primarily for regulatory authorities that use standardised protocol frameworks?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'scientific-background-producing-data-substances',
                      label: 'What substances or devices will undergo regulatory testing?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-producing-data-service',
                      label: 'Will this testing be offered as a service to others?',
                      type: 'radio',
                      inline: true,
                      className: 'smaller',
                      options: [
                        {
                          label: 'Yes',
                          value: true,
                          reveal: [
                            {
                              name: 'scientific-background-producing-data-service-nature',
                              label: 'What is the nature of the service you wish to provide?',
                              type: 'texteditor'
                            },
                            {
                              name: 'scientific-background-producing-data-service-who',
                              label: 'Who will you provide the service to?',
                              type: 'texteditor'
                            },
                            {
                              name: 'scientific-background-producing-data-service-how',
                              label: 'In general terms, how will those using your service use the data that you produce?',
                              type: 'texteditor'
                            },
                            {
                              name: 'scientific-background-producing-data-service-what',
                              label: 'What are the likely demands for the service over the lifetime of the project?',
                              type: 'texteditor'
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
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'scientific-background-non-regulatory',
              label: 'Will you be undertaking non-regulatory testing or screening as a service to others?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'scientific-background-non-regulatory-what',
                      label: 'What service do you wish to provide?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-non-regulatory-who',
                      label: 'Who will you provide the service to?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-non-regulatory-how',
                      label: 'In general terms, how will your clients use the data or other outputs that you produce?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-non-regulatory-select',
                      label: 'How will you select the most appropriate scientific model or method?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-non-regulatory-demands',
                      label: 'What are the likely demands for the service over the lifetime of the project?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-non-regulatory-condition',
                      label: 'Does this project relate directly to a clinical condition?',
                      type: 'radio',
                      inline: true,
                      className: 'smaller',
                      options: [
                        {
                          label: 'Yes',
                          value: true,
                          reveal: [
                            {
                              name: 'scientific-background-non-regulatory-condition-severe',
                              label: 'How prevalent and severe are the relevant clinical conditions?',
                              type: 'texteditor'
                            },
                            {
                              name: 'scientific-background-non-regulatory-condition-problems',
                              label: 'What are the problems with current treatments which mean that further work is necessary?',
                              type: 'texteditor'
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
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'scientific-background-genetically-altered',
              label: 'Will you be producing genetically altered or surgically prepared animals/animal products using standardised protocol frameworks as a service to others?',
              hint: 'This includes projects to create, breed, maintain and supply genetically altered animals to researchers within the establishment, projects taking blood and other tissues for researchers and other clients within and/or external to the establishment.',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'scientific-background-genetically-altered-producs',
                      label: 'What products do you wish to provide?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-genetically-altered-service',
                      label: 'Who will you provide a service to?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-genetically-altered-how',
                      label: 'In general terms, how will those using your service use the product?',
                      hint: 'This can include advancing scientific knowledge, or to benefit humans, animals, or the environment.',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-genetically-altered-what',
                      label: 'What are the likely demands for the products over the lifetime of the project?',
                      type: 'texteditor'
                    }
                  ]
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'scientific-background-vaccines',
              label: 'Will you be manufacturing vaccines and medicines for medical or veterinary use?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'scientific-background-vaccines-how',
                      label: 'How will these products benefit human health, animal health, or the environment?',
                      type: 'texteditor'
                    },
                    {
                      name: 'scientific-background-vaccines-what',
                      label: 'What are the likely demands for the products over the lifetime of the project?',
                      type: 'texteditor'
                    }
                  ]
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'transfer-expiring',
              label: 'Do you need to transfer animals from a project that’s due to expire?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              preserveHierarchy: true,
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'project-continuation',
                      type: 'repeater',
                      singular: 'Expiring project',
                      addAnotherLabel: 'Add another project to transfer animals from',
                      addAnotherClassName: 'link',
                      fields: [
                        {
                          name: 'licence-number',
                          type: 'text',
                          label: 'Project licence number'
                        },
                        {
                          name: 'expiry-date',
                          type: 'date',
                          label: 'Expiry date',
                          hint: 'For example, 13 06 2019'
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
        },
        'training-background': {
          title: 'Scientific background',
          show: values => isTrainingLicence(values),
          fields: [
            {
              name: 'training-background-anticipated-demand',
              label: 'What do you anticipate demand for this training to be over the lifetime of the project?',
              type: 'texteditor'
            },
            {
              name: 'training-background-specialist-bodies',
              label: 'Describe if the training is endorsed or otherwise supported by any specialist bodies or societies.',
              type: 'texteditor'
            },
            {
              name: 'training-background-qualification',
              label: 'Is this training a mandatory requirement for a professional qualification?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'training-background-qualification-who-mandates',
                    label: 'Explain who mandates the training and what the requirement is.',
                    type: 'texteditor'
                  }
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'training-background-measure-success',
              label: 'How will you measure the success of the training?',
              type: 'texteditor'
            },
            {
              name: 'training-background-learning-outcomes',
              label: 'How will you evaluate if the participants\' learning has been enhanced by the use of protected animals?',
              hint: 'For example, by reviewing feedback from participants or potential employers.',
              type: 'texteditor'
            },
            {
              name: 'training-background-annual-review',
              label: 'What arrangements have you made for an annual review of the course by your Animal Welfare and Ethical Review Body (AWERB)?',
              type: 'texteditor'
            },
            {
              name: 'transfer-expiring',
              label: 'Do you need to transfer animals from a project that’s due to expire?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              preserveHierarchy: true,
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'project-continuation',
                      type: 'repeater',
                      singular: 'Expiring project',
                      addAnotherLabel: 'Add another project to transfer animals from',
                      addAnotherClassName: 'link',
                      fields: [
                        {
                          name: 'licence-number',
                          type: 'text',
                          label: 'Project licence number'
                        },
                        {
                          name: 'expiry-date',
                          type: 'date',
                          label: 'Expiry date',
                          hint: 'For example, 13 06 2019'
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
        },
        'action-plan': {
          title: 'Action plan',
          granted: {
            order: 3,
            review: ActionPlan
          },
          playback: values => isTrainingLicence(values) ? undefined : 'project-aim',
          review: ObjectivesReview,
          steps: [
            {
              name: 'objectives',
              title: 'Action plan - 1 of 2',
              intro: 'There are several useful resources to help you plan your experiments. It is recommended that you read the ARRIVE, PREPARE guidelines, the NC3Rs\' Experimental Design Assistant and any other relevant guidelines before answering the questions in this section.',
              singular: 'Objective',
              component: Objectives,
              repeats: 'objectives',
              confirmRemove: confirmProtocolsAffected('remove', 'objectives', 'objective', 'title'),
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  review: 'Objective title',
                  type: 'text',
                  objective: true,
                  repeats: true,
                  toggleEdit: true,
                  confirmEdit: confirmProtocolsAffected('edit', 'objectives', 'objective', 'title')
                },
                {
                  name: 'objective-relation',
                  show: values => !isTrainingLicence(values),
                  label: 'How do each of these objectives relate to each other and help you to achieve your aim?',
                  hint: `Outline any interdependencies, stop:go points, and milestones. Include any key in vitro, ex vivo or in silico work, clinical findings, or results from epidemiological studies carried out under other projects that will enable you to achieve your objectives.
  
  Consider including images (.jpg and .png files) of annotated flow charts
  and decision trees in your action plan to illustrate how objectives relate to
  each other.`,
                  type: 'texteditor'
                }
              ]
            },
            {
              title: 'Action plan - 2 of 2',
              fields: [
                {
                  name: 'objectives-alternatives',
                  show: values => !isTrainingLicence(values),
                  label: 'Where relevant, how will you seek to use or develop non-animal alternatives for all or part of your work?',
                  type: 'texteditor'
                },
                {
                  name: 'objectives-regulatory-authorities',
                  label: 'Will you be producing data primarily for regulatory authorities that use standardised protocol frameworks?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  show: values => {
                    return !isTrainingLicence(values) && (!values.isGranted || !!values['objectives-regulatory-authorities']);
                  },
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'objectives-regulatory-authorities-tests',
                          label: 'What tests will be performed for regulatory purposes?',
                          hint: 'State under which guidelines, and for which regulators.',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-regulatory-authorities-in-vivo',
                          label: 'How have you determined that an in vivo test is required by the regulator and that non-animal alternatives cannot be used?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-regulatory-authorities-how',
                          label: 'How will you deal with requests to use tests not required by the UK or EU?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-regulatory-authorities-glp',
                          label: 'Will all regulatory testing be conducted in compliance with Good Laboratory Practice (GLP) standards?',
                          hint: 'If not, explain why this is not required.',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-regulatory-authorities-service',
                          label: 'Will this testing be offered as a service to others?',
                          type: 'radio',
                          inline: true,
                          className: 'smaller',
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: [
                                {
                                  name: 'objectives-regulatory-authorities-service-process',
                                  label: 'What is your process for accepting or rejecting work?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'objectives-regulatory-authorities-service-criteria',
                                  label: 'What specific criteria will you use to decide whether to accept or reject work?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'objectives-regulatory-authorities-service-others',
                                  label: 'Will others help you make decisions about accepting or rejecting work?',
                                  hint: 'If so, who and how?',
                                  type: 'texteditor'
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
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'objectives-non-regulatory',
                  label: 'Will you be undertaking non-regulatory testing or screening as a service to others?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  show: values => {
                    return !isTrainingLicence(values) && (!values.isGranted || !!values['objectives-non-regulatory']);
                  },
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'objectives-non-regulatory-process',
                          label: 'What is your process for accepting or rejecting work?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-non-regulatory-criteria',
                          label: 'What specific criteria will you use to decide whether to accept or reject work?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-non-regulatory-others',
                          label: 'Will others help you make decisions about accepting or rejecting work?',
                          hint: 'If so, who and how?',
                          type: 'texteditor'
                        }
                      ]
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'objectives-genetically-altered',
                  label: 'Will you be producing genetically altered or surgically prepared animals/animal products using standardised protocol frameworks?',
                  hint: 'This includes projects to create, breed, maintain and supply genetically altered animals to researchers within the establishment, projects taking blood and other tissues for researchers and other clients within and/or external to the establishment.',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  show: values => {
                    return !isTrainingLicence(values) && (!values.isGranted || !!values['objectives-genetically-altered']);
                  },
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'objectives-genetically-altered-quality',
                          label: 'How do you assure the quality of the products?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-genetically-altered-supply',
                          label: 'How will you match the supply of your products with demand?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-genetically-altered-service',
                          label: 'Will these products be offered as a service to others?',
                          type: 'radio',
                          inline: true,
                          className: 'smaller',
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: [
                                {
                                  name: 'objectives-genetically-altered-service-process',
                                  label: 'What is your process for accepting or rejecting work?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'objectives-genetically-altered-service-criteria',
                                  label: 'What specific criteria will you use to decide whether to accept or reject work?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'objectives-genetically-altered-service-others',
                                  label: 'Will others help you make decisions about accepting or rejecting work?',
                                  hint: 'If so, who and how?',
                                  type: 'texteditor'
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
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'objectives-vaccines',
                  label: 'Will you be manufacturing vaccines and medicines for medical or veterinary use?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  show: values => {
                    return !isTrainingLicence(values) && (!values.isGranted || !!values['objectives-vaccines']);
                  },
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'objectives-vaccines-glp',
                          label: 'Will all manufacturing be conducted in compliance with Good Manufacturing Practice (GMP) standards?',
                          hint: 'If not, explain why this is not required.',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-vaccines-describe',
                          label: 'Describe how animals are used throughout the manufacturing process.',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-vaccines-tests',
                          label: 'What animal-based tests do you need to undertake on your products, and for which regulator?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-vaccines-quality',
                          label: 'How do you assure the quality of your products?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-vaccines-supply',
                          label: 'How will you match the supply of your products with demand?',
                          type: 'texteditor'
                        },
                        {
                          name: 'objectives-vaccines-refined',
                          label: 'Will you use animals to develop and validate more refined methods or non-animal alternatives?',
                          type: 'radio',
                          inline: true,
                          className: 'smaller',
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: {
                                name: 'objectives-vaccines-refined-explain',
                                label: 'Explain the type of work you will do, and indicate which steps in the manufacturing process this relates to.',
                                type: 'texteditor'
                              }
                            },
                            {
                              label: 'No',
                              value: false
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
                },
                {
                  name: 'training-objectives-use-of-animals',
                  show: values => isTrainingLicence(values),
                  label: 'Why can\'t learning outcomes be achieved without the use of live animals?',
                  type: 'texteditor'
                },
                {
                  name: 'training-objectives-attendees-selected',
                  show: values => isTrainingLicence(values),
                  label: 'How are attendees selected?',
                  type: 'texteditor'
                },
                {
                  name: 'training-objectives-long-term-teaching-aid',
                  show: values => isTrainingLicence(values),
                  label: 'Will animals be used to produce a longer-term teaching aid such as a video?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: {
                        name: 'training-objectives-long-term-teaching-aid-description',
                        label: 'Describe the material you plan to produce.',
                        type: 'texteditor'
                      }
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'training-objectives-non-animal-alternatives',
                  show: values => isTrainingLicence(values),
                  label: 'Describe any resources you use, or are currently developing, to supplement or replace the use of animals.',
                  hint: 'This could include videos, in silico or ex vivo material.',
                  type: 'texteditor'
                },
                {
                  name: 'training-objectives-other-resources',
                  show: values => isTrainingLicence(values),
                  label: 'Specify any resources you’ve explored to ensure there are no suitable non-animal alternatives.',
                  hint: 'For example, Norecopa.',
                  type: 'texteditor'
                },
                {
                  name: 'training-objectives-keep-up-to-date',
                  show: values => isTrainingLicence(values),
                  label: 'How will you keep up to date with any non-animal alternatives developed during the course of this project?',
                  type: 'texteditor'
                }
              ]
            }
          ]
        },
        'general-principles': {
          title: 'General principles',
          fields: [
            {
              name: 'general-principles-duplicate',
              show: values => !isTrainingLicence(values),
              label: 'Unnecessary duplication of work must be avoided. Under what circumstances would you knowingly duplicate work?',
              type: 'texteditor'
            },
            {
              name: 'training-general-principles-existing-material',
              show: values => isTrainingLicence(values),
              label: 'Does data or learning material exist from previous work?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'training-general-principles-existing-material-how-use',
                    label: 'How will you use this data or material?',
                    type: 'texteditor'
                  }
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'experimental-design-sexes',
              label: 'Will all of your protocols or experiments use animals of both sexes?',
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
                    name: 'experimental-design-sexes-justification',
                    label: 'Why will you use animals of a single sex in some protocols or experiments?',
                    type: 'texteditor'
                  }
                }
              ]
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
          granted: {
            review: GrantedProtocols,
            order: 4
          },
          name: 'protocols',
          component: Protocols,
          review: ProtocolsReview,
          repeats: 'protocols',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text'
            }
          ],
          sections: {
            details: {
              title: 'Protocol details',
              fields: [
                {
                  name: 'description',
                  label: 'Briefly describe the purposes of this protocol',
                  hint: 'Ensure that you state any relevant regulatory guidelines.',
                  type: 'texteditor'
                },
                {
                  name: 'severity',
                  label: 'Given the controls and limitations in place, what is the highest severity that an animal could experience in this protocol?',
                  type: 'radio',
                  options: [
                    {
                      label: 'Mild',
                      value: 'mild'
                    },
                    {
                      label: 'Moderate',
                      value: 'moderate'
                    },
                    {
                      label: 'Severe',
                      value: 'severe'
                    },
                    {
                      label: 'Non-recovery',
                      value: 'non-recovery'
                    }
                  ],
                  className: 'smaller'
                },
                {
                  name: 'severity-proportion',
                  label: 'What proportion of animals will experience this severity?',
                  type: 'texteditor'
                },
                {
                  name: 'severity-details',
                  label: 'Why are you proposing this severity category?',
                  type: 'texteditor'
                },
                {
                  name: 'locations',
                  label: 'Select the establishments and POLEs where this protocol will be carried out.',
                  review: 'Locations where this protocol can be carried out',
                  hint: 'Select all that apply.',
                  type: 'location-selector'
                },
                {
                  name: 'objectives',
                  label: 'Which of your objectives will this protocol address?',
                  hint: 'Select all that apply.',
                  type: 'objective-selector'
                },
                {
                  name: 'training-used-for',
                  show: values => isTrainingLicence(values),
                  label: 'What will this protocol be used for?',
                  hint: 'If your purpose isn’t listed you can leave this blank.',
                  type: 'checkbox',
                  className: 'smaller',
                  options: [
                    {
                      label: 'Demonstration purposes',
                      value: 'demonstration'
                    },
                    {
                      label: 'Tissue provision',
                      value: 'tissue-provision'
                    }
                  ]
                },
                {
                  name: 'training-responsible-for-animals',
                  show: values => isTrainingLicence(values),
                  label: 'Who will be responsible for the animals used in this protocol?',
                  type: 'texteditor'
                },
                {
                  name: 'training-regulated-procedures',
                  show: values => isTrainingLicence(values),
                  label: 'Will students carry out regulated procedures under this protocol?',
                  type: 'radio',
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: {
                        name: 'training-regulated-procedures-type-of-pil',
                        label: 'What type of personal licence will they need?',
                        type: 'radio',
                        options: [
                          {
                            label: 'A and B',
                            value: 'A, B'
                          },
                          {
                            label: 'A, B and C',
                            value: 'A, B, C'
                          },
                          {
                            label: 'E',
                            value: 'E'
                          }
                        ]
                      }
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ],
                  inline: true
                },
                {
                  name: 'training-participant-pre-course-training',
                  show: values => isTrainingLicence(values),
                  label: 'What training will participants receive before they can use protected animals?',
                  type: 'texteditor'
                }
              ]
            },
            purpose: {
              title: 'Purpose and outputs',
              show: props => props.isGranted && !props.isFullApplication,
              granted: {
                order: 2,
                review: Purpose
              }
            },
            establishments: {
              title: 'Establishments and POLEs',
              show: props => props.isGranted && !props.isFullApplication,
              granted: {
                order: 3,
                review: ProtocolEstablishments
              }
            },
            animals: {
              title: 'Animals used in this protocol',
              repeats: 'speciesDetails',
              fields: [
                {
                  name: 'species',
                  label: 'Which types of animals would you like to add to this protocol?',
                  hint: 'Select all that apply.',
                  type: 'checkbox',
                  className: 'smaller',
                  inline: true,
                  section: 'intro'
                },
                {
                  name: 'life-stages',
                  label: 'Which life stages will be used during this protocol?',
                  hint: 'Select all that apply',
                  type: 'checkbox',
                  className: 'smaller',
                  options: [
                    {
                      label: 'Embryo and egg',
                      value: 'embryo'
                    },
                    {
                      label: 'Neonate',
                      value: 'neonate'
                    },
                    {
                      label: 'Juvenile',
                      value: 'juvenile'
                    },
                    {
                      label: 'Adult',
                      value: 'adult'
                    },
                    {
                      label: 'Pregnant adult',
                      value: 'pregnant'
                    },
                    {
                      label: 'Aged animal',
                      value: 'aged'
                    }
                  ]
                },
                {
                  name: 'continued-use',
                  label: 'Will any animals coming on to this protocol be classed as ‘continued use’?',
                  hint: '‘Continued use’ describes animals that are specifically genetically altered and bred for scientific use or animals that have had procedures applied to them in order to be prepared for use in this protocol.',
                  type: 'radio',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: {
                        name: 'continued-use-sourced',
                        label: 'How did these animals start their use?',
                        hint: 'Describe the procedures that have been applied to animals that will continue their use on to this protocol.',
                        type: 'texteditor'
                      }
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ],
                  inline: true,
                  className: 'smaller'
                },
                {
                  name: 'reuse',
                  label: 'Will you be re-using animals on to this protocol?',
                  hint: '‘Re-use’ describes using animals again for a new experiment when you could equally use a naïve animal to get the same results.',
                  type: 'radio',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'reuse-details',
                          label: 'Describe any procedure that may have been applied to these animals, and why you are choosing to re-use them.',
                          type: 'texteditor'
                        }
                      ]
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ],
                  inline: true,
                  className: 'smaller'
                },
                {
                  name: 'maximum-animals',
                  label: 'What is the maximum number of animals that will be used on this protocol?',
                  type: 'text',
                  hint: 'Please only enter numbers, e.g. 40'
                },
                {
                  name: 'maximum-times-used',
                  label: 'What is the maximum number of uses of this protocol per animal?',
                  hint: 'For example, if some animals will go through this protocol three more times after their first use, the number of uses will be four.\n\n If no animals will go through this protocol more than once, enter \'1\'.\n\nPlease only enter numbers, e.g. 40',
                  type: 'text'

                }
              ]
            },
            gaas: {
              title: 'Genetically altered animals (GAA)',
              granted: {
                order: 4
              },
              fields: [
                {
                  name: 'gaas',
                  label: 'Will this protocol use any genetically altered animals?',
                  type: 'radio',
                  className: 'smaller',
                  inline: true,
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'gaas-types',
                          label: 'Which general types or strains will you be using and why?',
                          type: 'texteditor'
                        },
                        {
                          name: 'gaas-harmful',
                          label: 'Do you expect any of these GAAs to show a harmful phenotype with welfare consequences?',
                          type: 'radio',
                          className: 'smaller',
                          inline: true,
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: [
                                {
                                  name: 'gaas-harmful-justification',
                                  label: 'Why are each of these harmful phenotypes necessary?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'gaas-harmful-control',
                                  label: 'How will you minimise the harms associated with these phenotypes?',
                                  hint: 'Ensure that you include any humane endpoints that you will use.',
                                  type: 'texteditor'
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
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                }
              ]
            },
            objectives: {
              title: 'Objectives',
              show: props => props.isGranted && !props.isFullApplication,
              granted: {
                order: 6,
                review: ProtocolObjectives
              }
            },
            steps: {
              title: 'Steps',
              hint: 'A step can be a single procedure or a combination of procedures to achieve an outcome. You will be able to reorder your steps at any time before you send your application to the Home Office, but they should be broadly chronological, with the final step being a method of killing or the last regulated procedure.',
              footer: 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.',
              repeats: 'steps',
              granted: {
                order: 7,
                review: GrantedSteps
              },
              fields: [
                {
                  name: 'title',
                  type: 'texteditor',
                  label: 'Describe the procedures that will be carried out during this step.',
                  hint: 'Explain where one or more steps are repeated in one experiment, list any alternative techniques within a step (e.g. dosing routes), and include all procedures performed under terminal anaesthesia.\n\nWhen describing the technical aspects of a step, be broad enough to be flexible when the variation does not impact on animal welfare (e.g. use "antibiotic" instead of "penicillin"). Finally, avoid specifying volumes and frequencies when they do not impact on animal welfare.'
                },
                {
                  name: 'reference',
                  type: 'text',
                  label: 'Step reference',
                  hint: 'Provide a short reference for this step, e.g. \'Blood sampling\' or \'Transgene induction\'',
                  show: props => {
                    return !props.readonly;
                  }
                },
                {
                  name: 'optional',
                  label: 'Is this step optional?',
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
                      value: false
                    }
                  ]
                },
                {
                  name: 'adverse',
                  label: 'Do you expect this step to have adverse effects for the animals that are more than mild and transient?',
                  hint: 'Do not list uncommon or unlikely adverse effects, or effects from procedures that will cause no more than transient discomfort and no lasting harm. For example, an intravenous injection of a small volume of an innocuous substance.',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'adverse-effects',
                          label: 'What are the likely adverse effects of this step?',
                          hint: 'State the expected adverse effect, including the likely incidence, and the anticipated degree and duration of suffering.',
                          type: 'texteditor'
                        },
                        {
                          name: 'prevent-adverse-effects',
                          label: 'How will you monitor for, control, and limit any of these adverse effects?',
                          hint: 'If adverse effects can\'t be prevented, how will you attempt to ameliorate their initial signs?',
                          type: 'texteditor'
                        },
                        {
                          name: 'endpoints',
                          label: 'What are the humane endpoints for this step?',
                          hint: 'This would be the point at which you would kill the animal to prevent further suffering.',
                          type: 'texteditor'
                        }
                      ]
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'reusable',
                  label: 'Do you want to be able to use this step on other protocols?',
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
                      value: false
                    }
                  ],
                  show: props => !props.readonly
                }
              ]
            },
            fate: {
              title: 'Fate of animals',
              show: ({isGranted, isFullApplication}) => !isGranted || isFullApplication,
              granted: {
                order: 11
              },
              fields: [
                {
                  name: 'fate',
                  label: 'What will happen to animals at the end of this protocol?',
                  hint: `Select all that apply. These options are based on what you selected in the ${markdownLink('non-technical summary', getCurrentURLForFateOfAnimals())}.`,
                  type: 'checkbox',
                  preserveHierarchy: true,
                  className: 'smaller',
                  options: []
                }
              ]
            },
            experience: {
              title: 'Animal experience',
              granted: {
                order: 8
              },
              fields: [
                {
                  name: 'experience-summary',
                  label: 'Summarise the typical experience or end-to-end scenario for an animal being used in this protocol.',
                  hint: 'Consider the cumulative effect of any combinations of procedures that you may carry out.',
                  type: 'texteditor'
                },
                {
                  name: 'experience-endpoints',
                  label: 'Describe the general humane endpoints that you will apply during the protocol.',
                  hint: 'These will be in addition to the endpoints stated for each step.',
                  type: 'texteditor'
                }
              ]
            },
            experimentalDesign: {
              title: 'Experimental design',
              granted: {
                order: 9
              },
              fields: [
                {
                  name: 'outputs',
                  show: values => !isTrainingLicence(values),
                  label: 'What outputs are expected to arise from this protocol?',
                  hint: 'For example, test results, phenotypic information, or products.',
                  type: 'texteditor'
                },
                {
                  name: 'training-outputs',
                  show: values => isTrainingLicence(values),
                  label: 'What learning outcomes are expected to arise from this protocol?',
                  type: 'texteditor'
                },
                {
                  name: 'quantitative-data',
                  label: 'Will this protocol generate quantitative data?',
                  type: 'radio',
                  className: 'smaller',
                  inline: true,
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'quantitative-data-guideline',
                          label: 'Will your experimental design be determined by a regulatory guideline?',
                          type: 'radio',
                          className: 'smaller',
                          inline: true,
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: {
                                name: 'quantitative-data-guideline-refined',
                                label: 'How will you ensure that you are using the most refined methodology?',
                                type: 'texteditor'
                              }
                            },
                            {
                              label: 'No',
                              value: false,
                              reveal: [
                                {
                                  name: 'quantitative-data-pilot-studies-how',
                                  label: 'Where relevant, explain how and when pilot studies will be used.',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'quantitative-data-experimental-groups',
                                  label: 'How will you choose different experimental groups?',
                                  hint: 'For example, controls, dose levels, satellites etc.',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'control-groups',
                                  label: 'How will you choose control groups?',
                                  hint: 'Provide a robust scientific justification for controls with significant suffering such as sham surgery controls or untreated infected controls.',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'randomised',
                                  label: 'How will experiments and data analysis be randomised and blinded?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'reproducibility',
                                  label: 'How will you minimise variables to ensure reproducibility?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'control-groups-size',
                                  label: 'How will you determine group sizes?',
                                  hint: 'You should reference POWER calculations you have made, if relevant.',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'maximize-effectiveness',
                                  label: 'How will you maximise the data output from the animals you use on this protocol?',
                                  type: 'texteditor'
                                }
                              ]
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
            },
            justification: {
              title: 'Protocol justification',
              label: 'Why is each type of animal, experimental model, and/or method selected for this protocol:',
              granted: {
                order: 10
              },
              fields: [
                {
                  name: 'most-appropriate',
                  label: 'a) the most appropriate scientific approach?',
                  type: 'texteditor'
                },
                {
                  name: 'most-refined',
                  label: 'b) the most refined for the purpose?',
                  type: 'texteditor'
                },
                {
                  name: 'scientific-endpoints',
                  label: 'For each model and/or method, what is the scientific need for the expected clinical signs?',
                  type: 'texteditor'
                },
                {
                  name: 'scientific-suffering',
                  label: 'Why scientifically do the animals need to suffer to this degree?',
                  type: 'texteditor'
                },
                {
                  name: 'scientific-endpoints-justification',
                  label: 'Why can\'t you achieve your scientific outputs with an earlier humane endpoint, or without animals showing any clinical signs?',
                  type: 'texteditor'
                },
                {
                  name: 'justification-substances',
                  label: 'Will you be administering substances for experimental purposes?',
                  type: 'radio',
                  className: 'smaller',
                  inline: true,
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'substances-suitibility',
                          label: 'How will you assess the suitability of these substances, and minimise the unnecessary harms arising from their administration given the particular strain or type of animal you will be using?',
                          hint: 'When assessing suitability, state how you will consider toxicity, efficacy, and sterility.',
                          type: 'texteditor'
                        },
                        {
                          name: 'dosing-regimen',
                          label: 'How will you determine an appropriate dosing regimen?',
                          hint: 'Include routes, dosage volumes, frequencies, and durations.',
                          type: 'texteditor'
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
            },
            conditions: {
              title: 'Additional conditions',
              show: props => props.showConditions,
              singular: 'Additional condition',
              items: 'Additional conditions',
              granted: {
                order: 0
              }
            },
            authorisations: {
              title: 'Authorisations',
              show: props => props.showConditions,
              singular: 'Authorisation',
              items: 'Authorisations',
              granted: {
                order: 1
              }
            }
          }
        }
      }
    },
    useOfAnimals: {
      title: 'Use of animals',
      subsections: {
        domestic: {
          title: 'Cats, dogs, and equidae',
          intro: 'You are seeing this section because you added a type of cat, dog, or equid to your project. To change this, go to Introductory details.',
          show: values => intersection(
            SPECIES.DOM.map(s => s.value),
            values.species
          ).length,
          fields: [
            {
              name: 'domestic',
              label: 'What are the scientific reasons for using cats, dogs, or equidae in your project?',
              hint: 'A licence cannot be granted unless your scientific objectives or research questions can only be achieved or answered by the use of cats, dogs or equidae. This includes instances when it is not practicable to obtain other types of animal.',
              type: 'texteditor'
            }
          ]
        },
        nhps: {
          title: 'Non-human primates',
          intro: 'You are seeing this section because you added a non-human primate to your project. To change this, go to Introductory details.',
          show: values => intersection(SPECIES.NHP.map(s => s.value), values.species).length,
          fields: [
            {
              name: 'nhps',
              label: 'Why do you need to use non-human primates, rather than any other type of animal, to achieve your objectives?',
              type: 'texteditor'
            },
            {
              name: 'nhps-endangered',
              label: 'Are any of these non-human primates endangered?',
              hint: 'Endangered animals are any of the species listed on Annex A of Council Regulation 338/97 and are not bred in captivity.',
              type: 'radio',
              className: 'smaller',
              inline: true,
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'nhps-endangered-justification',
                      label: 'Why can\'t you achieve your objectives by using non-human primates that are not endangered?',
                      hint: 'Also explain how you will comply with other regulations including CITES.',
                      type: 'texteditor'
                    },
                    {
                      name: 'nhps-justification',
                      label: 'Explain how the project is for one of the permitted purposes.',
                      hint: `The permitted purposes for the use of endangered non-human primates are:
  * translational or applied research for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
  * the development, manufacture or testing of the quality, effectiveness and safety of drugs for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
  * research aimed at preserving the species of animal subjected to regulated procedures.`,
                      type: 'texteditor'
                    }
                  ]
                },
                {
                  label: 'No',
                  value: false,
                  reveal: {
                    name: 'nhps-justification',
                    label: 'Explain how the project is for one of the permitted purposes.',
                    hint: `The permitted purposes for the use of non-human primates are:
  * basic research
  * translational or applied research for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
  * the development, manufacture or testing of the quality, effectiveness and safety of drugs for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
  * research aimed at preserving the species of animal subjected to regulated procedures`,
                    type: 'texteditor'
                  }
                }
              ]
            },
            {
              name: 'wild-caught-primates',
              label: 'Might any of these non-human primates be wild-caught?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'wild-caught-primates-justification',
                    label: 'Why can\'t you achieve your objectives without using wild-caught non-human primates?',
                    type: 'texteditor'
                  }
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'marmoset-colony',
              label: 'Will all marmosets be sourced from a self-sustaining colony?',
              hint: `This is a colony that is kept in captivity in a way that:

  * ensures animals are accustomed to humans.
  * consists only of animals that have been bred in captivity.
  * is sustained only by animals bred within the same colony, or animals that are sourced from another self-sustaining colony.`,

              type: 'radio',
              inline: true,
              className: 'smaller',
              show: values => (values.species || []).includes('marmosets'),
              options: [
                {
                  label: 'Yes',
                  value: true
                },
                {
                  label: 'No',
                  value: false,
                  reveal: {
                    name: 'marmoset-colony-justification',
                    label: 'Why can’t you achieve your objectives without using marmosets from a self-sustaining colony?',
                    type: 'texteditor'
                  }
                }
              ]
            }
          ]
        },
        'purpose-bred-animals': {
          title: 'Purpose bred animals',
          fields: [
            {
              name: 'purpose-bred',
              label: 'Will all schedule 2 animals used in your project be purpose bred?',
              hint: 'This means animals that have been bred primarily to be used in regulated procedures or for the use of their tissues or organs for scientific purposes.',
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
                  reveal: [
                    {
                      name: 'purpose-bred-sourced',
                      label: 'Where will you obtain non-purpose bred animals from?',
                      hint: 'Consider the source of all animals you plan to use, as this information will help to assess the impact on the scientific output and the quality of the animal.',
                      type: 'texteditor'
                    },
                    {
                      name: 'purpose-bred-justification',
                      label: 'Why can’t you achieve your objectives by only using purpose bred animals?',
                      type: 'texteditor'
                    }
                  ]
                }
              ]
            }
          ]
        },
        'endangered-animals': {
          title: 'Endangered animals',
          fields: [
            {
              name: 'endangered-animals',
              label: 'Will you be using any endangered animals, apart from non-human primates?',
              hint: 'Endangered animals are any of the species listed on Annex A of Council Regulation 338/97 and are not bred in captivity.',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'endangered-animals-justification',
                      label: 'Why can’t you achieve your objectives without using endangered animals?',
                      hint: 'Also explain how you will comply with other regulations including CITES.',
                      type: 'texteditor'
                    },
                    {
                      name: 'endangered-animals-permitted',
                      label: 'Explain how the project is for one of the permitted purposes.',
                      hint: `The permitted purposes for the use of endangered animals are:
  * translational or applied research for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
  * the development, manufacture or testing of the quality, effectiveness and safety of drugs for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
  * research aimed at preserving the species of animal subjected to regulated procedures.`,
                      type: 'texteditor'
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
        },
        'animals-taken-from-the-wild': {
          title: 'Animals taken from the wild',
          granted: {
            order: 5,
            show: values => values['wild-animals'] === true
          },
          steps: [
            {
              title: 'Animals taken from the wild - 1 of 2',
              fields: [
                {
                  name: 'wild-animals',
                  label: 'Will you be using any animals taken from the wild?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'wild-animals-justification',
                          label: 'Why can’t you achieve your objectives without using animals taken from the wild?',
                          type: 'texteditor'
                        },
                        {
                          name: 'wild-animals-caught',
                          label: 'How will these animals be captured?',
                          hint: 'Explain how each method is the most refined for the animal type or purpose of the study. Also include any relevant considerations around trapping, including the frequency of checks and trap positioning.',
                          type: 'texteditor'
                        },
                        {
                          name: 'wild-animals-potential-harms',
                          label: 'How will you minimise potential harms when catching these animals?',
                          type: 'texteditor'
                        },
                        {
                          name: 'non-target-species-capture-methods',
                          label: 'Will your capture methods catch non-target animals?',
                          type: 'radio',
                          inline: true,
                          className: 'smaller',
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: [
                                {
                                  name: 'non-target-species-capture-methods-minimise-suffering',
                                  label: 'How will you minimise the risk of capturing non-target animals, including strays and animals of a different sex?',
                                  type: 'texteditor'
                                },
                                {
                                  name: 'non-target-species-capture-methods-fate',
                                  label: 'What will you do with any non-target animals that you capture?',
                                  type: 'texteditor'
                                }
                              ]
                            },
                            {
                              label: 'No',
                              value: false
                            }
                          ]
                        },
                        {
                          name: 'wild-animals-competence',
                          label: 'How will you ensure the competence of any person responsible for the capture of animals?',
                          type: 'texteditor'
                        },
                        {
                          name: 'wild-animals-examine',
                          label: 'How will you examine any animals that are found to be ill or injured at the time of capture?',
                          hint: 'Include details about what will be done with these animals after they have been examined.',
                          type: 'texteditor'
                        },
                        {
                          name: 'wild-animals-vet',
                          label: 'Will a veterinary surgeon perform the examination?',
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
                                name: 'wild-animals-vet-competence',
                                label: 'How will you ensure the competence of the person responsible for making this assessment?',
                                type: 'texteditor'
                              }
                            }
                          ]
                        },
                        {
                          name: 'wild-animals-poor-health',
                          label: 'Is it necessary to use animals that are injured or in poor health during your project?',
                          type: 'radio',
                          className: 'smaller',
                          inline: true,
                          options: [
                            {
                              label: 'Yes',
                              value: true,
                              reveal: {
                                name: 'wild-animals-poor-health-justification',
                                label: 'Explain why it is scientifically necessary to use animals that are injured or in poor health during your project.',
                                type: 'texteditor'
                              }
                            },
                            {
                              label: 'No',
                              value: false
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
            },
            {
              title: 'Animals taken from the wild - 2 of 2',
              show: values => values['wild-animals'] === true,
              fields: [
                {
                  name: 'wild-animals-transport',
                  label: 'If sick or injured animals are to be treated, how will you transport them for treatment?',
                  hint: 'Include how you will ensure that any potential harms during their transport will be minimised.',
                  type: 'texteditor'
                },
                {
                  name: 'wild-animals-killing-method',
                  label: 'If sick or injured animals are to be humanely killed, which methods will you use?',
                  type: 'texteditor'
                },
                {
                  name: 'wild-animals-marked',
                  label: 'Will animals be marked, or otherwise identified, during the project?',
                  hint: 'Consider both regulated and non-regulated procedures in your answer.',
                  type: 'radio',
                  className: 'smaller',
                  inline: true,
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: {
                        name: 'wild-animals-identify',
                        label: 'How will animals be identified?',
                        hint: 'State which methods may cause more than momentary pain, distress, or lasting harm to an animal.',
                        type: 'texteditor'
                      }
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'wild-animals-devices',
                  label: 'Will any devices be attached to or implanted in animals during this project?',
                  hint: 'For example, any device used to identify, track, and monitor an animal’s behaviour in its natural habitat.',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        {
                          name: 'wild-animals-devices-effects',
                          label: 'How will any adverse effects from a device\'s attachment or implantation be minimised?',
                          type: 'texteditor'
                        },
                        {
                          name: 'wild-animals-devices-removal',
                          label: 'How will you locate and recapture the animals or otherwise ensure the devices are removed at the end of the regulated procedures?',
                          hint: 'If devices will not be removed, explain why it is not required.',
                          type: 'texteditor'
                        },
                        {
                          name: 'wild-animals-devices-environment-effects',
                          label: 'If animals will not have devices removed, what are the potential effects on them, other animals, the environment and human health?',
                          type: 'texteditor'
                        }
                      ]
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                },
                {
                  name: 'wild-animals-declaration',
                  label: 'I confirm that I have, or will have, all necessary permissions from other regulators in place before commencing any work involving animals taken from the wild.',
                  type: 'declaration'
                }
              ]
            }
          ]
        },
        'feral-animals': {
          title: 'Feral animals',
          fields: [
            {
              name: 'feral-animals',
              label: 'Will you be using any feral animals in your project?',
              hint: 'A feral animal is an animal living in the wild but descended from domesticated individuals.',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'feral-animals-justification',
                      label: 'Why can\'t you use non-feral animals to achieve your objectives?',
                      type: 'texteditor'
                    },
                    {
                      name: 'feral-animals-essential',
                      label: 'Why is the use of feral animals essential to protect the health or welfare of that species or to avoid a serious threat to human or animal health or the environment?',
                      type: 'texteditor'
                    },
                    {
                      name: 'feral-animals-procedures',
                      label: 'Which procedures will be carried out on feral animals? And under which protocols?',
                      type: 'texteditor'
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
        }
      }
    },
    otherConsiderations: {
      title: 'Other considerations',
      subsections: {
        nmbas: {
          title: 'Neuromuscular blocking agents (NMBAs)',
          steps: [
            {
              title: 'Neuromuscular blocking agents (NMBAs)',
              fields: [
                {
                  name: 'nmbas-used',
                  label: 'Will this project involve the use of neuromuscular blocking agents (NMBAs)?',
                  type: 'radio',
                  className: 'smaller',
                  inline: true,
                  options: [
                    {
                      label: 'Yes',
                      value: true
                    },
                    {
                      label: 'No',
                      value: false
                    }
                  ]
                }
              ]
            },
            {
              title: 'Neuromuscular blocking agents (NMBAs) - 1 of 2',
              show: values => values['nmbas-used'],
              fields: [
                {
                  name: 'nmbas-why',
                  label: 'Why do you need to use NMBAs in your protocols?',
                  type: 'texteditor'
                },
                {
                  name: 'nmbas-anaesthetic',
                  label: 'What anaesthetic and analgesic regime will you use?',
                  type: 'texteditor'
                },
                {
                  name: 'nmbas-ventilation',
                  label: 'How will you ensure that animals have adequate ventilation?',
                  type: 'texteditor'
                },
                {
                  name: 'nmbas-pain',
                  label: 'How will you minimise pain, suffering, and distress for an animal under the influence of an NMBA?',
                  type: 'texteditor'
                }
              ]
            },
            {
              title: 'Neuromuscular blocking agents (NMBAs) - 2 of 2',
              show: values => values['nmbas-used'],
              fields: [
                {
                  name: 'nmbas-depth',
                  label: 'How will you monitor the depth of anaesthesia?',
                  type: 'texteditor'
                },
                {
                  name: 'nmbas-people',
                  label: 'How will you ensure there are sufficient staff present throughout the use of NMBAs (including during recovery periods) who are competent to use them in these types of animal?',
                  type: 'texteditor'
                },
                {
                  name: 'nmbas-emergency-routine',
                  label: 'Explain the agreed emergency routine at your establishment that covers potential hazardous events (such as a power failure).',
                  type: 'texteditor'
                }
              ]
            }
          ]
        },
        'reusing-animals': {
          title: 'Re-using animals',
          show: project => some(project.protocols, protocol => protocol && some(protocol.speciesDetails, species => (species || {}).reuse)),
          intro: 'You are seeing this section because you will be re-using animals during your project. If this is not correct, you can change this in Protocols.',
          fields: [
            {
              name: 'reusing-why',
              label: 'Why do you intend to re-use animals?',
              hint: 'Explain how you will balance the needs of refining and reducing animal use before making your decision.',
              type: 'texteditor'
            },
            {
              name: 'reusing-limitations',
              label: 'What are the limitations on re-using animals for this project?',
              hint: 'For example, there may be a maximum number of times that an animal can be re-used, or a set of performance standards that requires a limit on re-use.',
              type: 'texteditor'
            }
          ]
        },
        'commercial-slaughter': {
          title: 'Commercial slaughter',
          fields: [
            {
              name: 'commercial-slaughter',
              label: 'Will you send any farm animals to a commercial slaughterhouse at the end of their use?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'commercial-slaughter-hygiene',
                    label: 'How will you ensure that these animals are healthy and meet commercial requirements for meat hygiene to enable them to enter the food chain?',
                    hint: 'Include any relevant information about drug withdrawal times.',
                    type: 'texteditor'
                  }
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            }
          ]
        },
        'containing-human-material': {
          title: 'Animals containing human material',
          fields: [
            {
              name: 'animals-containing-human-material',
              label: 'Do you intend to use animals containing human material in experiments classed as Category 2 or 3 by the Academy of Medical Sciences?',
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
                  value: false
                }
              ]
            }
          ]
        },
        'keeping-alive': {
          title: 'Keeping animals alive',
          show: project => {
            const fateOfAnimals = project['fate-of-animals'] || [];
            return ['kept-alive', 'set-free', 'rehomed'].some(condition => fateOfAnimals.includes(condition));
          },
          fields: [
            {
              name: 'kept-alive-animals',
              label: 'What types of animals will you keep alive?',
              type: 'texteditor'
            },
            {
              name: 'keeping-animals-alive-determine',
              label: 'What criteria will the veterinary surgeon, or competent person trained by a veterinary surgeon, use to determine whether animals can be kept alive?',
              type: 'texteditor'
            },
            {
              name: 'keeping-animals-alive-supervised',
              label: 'Are there any limitations on the period of time that animals that have been kept alive can be held under the supervision of the veterinary surgeon?',
              type: 'texteditor'
            }
          ]
        },
        'setting-free': {
          title: 'Setting animals free',
          show: project => (project['fate-of-animals'] || []).includes('set-free'),
          fields: [
            {
              name: 'setting-free-health',
              label: 'How will an animal\'s health be assessed to determine whether it can be set free?',
              type: 'texteditor'
            },
            {
              name: 'setting-free-vet',
              label: 'Will a veterinary surgeon perform this assessment?',
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
                    name: 'setting-free-competence',
                    label: 'How will you ensure the competence of the person responsible for assessing whether animals can be set free?',
                    type: 'texteditor'
                  }
                }
              ]
            },
            {
              name: 'setting-free-ensure-not-harmful',
              label: 'How will you ensure that setting animals free will not be harmful to other species, the environment, and human health?',
              type: 'texteditor'
            },
            {
              name: 'setting-free-rehabilitate',
              label: 'Will you rehabilitate animals before setting them free? If so, how?',
              type: 'texteditor'
            },
            {
              name: 'setting-free-socialise',
              label: 'Will you attempt to socialise any animals that you have set free? If so, how?',
              type: 'texteditor'
            },
            {
              name: 'setting-free-recapturing',
              label: 'How will you prevent inadvertent re-use of animals that have been released at the end of procedures?',
              type: 'texteditor'
            },
            {
              name: 'setting-free-lost',
              label: 'If animals are lost to the study or not re-captured, how will you determine whether your project is complete?',
              hint: 'This information is important to ensure that the use of these animals is recorded in the return of procedures, and is considered when determining the actual severity of your protocols.',
              type: 'texteditor'
            }
          ]
        },
        rehoming: {
          title: 'Rehoming animals',
          show: project => (project['fate-of-animals'] || []).includes('rehomed'),
          fields: [
            {
              name: 'rehoming-types',
              label: 'What types of animals do you intend to rehome?',
              hint: 'Also state the protocols on which they would have been used.',
              type: 'texteditor'
            },
            {
              name: 'rehoming-healthy',
              label: 'How will you make sure that an animal’s health allows it to be rehomed?',
              type: 'texteditor'
            },
            {
              name: 'rehoming-harmful',
              label: 'How will you ensure that rehoming does not pose a danger to public health, animal health, or the environment?',
              type: 'texteditor'
            },
            {
              name: 'rehoming-socialisation',
              label: 'What scheme is in place to ensure socialisation when an animal is rehomed?',
              type: 'texteditor'
            },
            {
              name: 'rehoming-other',
              label: 'What other measures will you take to safeguard an animal’s wellbeing when it is rehomed?',
              type: 'texteditor'
            }
          ]
        }
      }
    },
    conditions: {
      title: 'Additional conditions and authorisations',
      show: props => props.showConditions,
      subsections: {
        conditions: {
          title: 'Additional conditions',
          granted: {
            order: 1,
            review: GrantedConditions,
            title: 'Conditions',
            subtitle: 'Additional conditions',
            intro: `These additional conditions apply to the project as a whole.

  Additional conditions that are specific to a set of procedures can be found in each protocol.`,
            pdf: 'These additional conditions apply to the project as a whole. Additional conditions that are specific to a set of procedures can be found in each protocol. Standard conditions that apply to all project licences can be found at the end of this document.'
          },
          addMore: 'Add more conditions',
          intro: `Additional conditions have been added automatically according to the selections made by the applicant.

  Please review all sections of this application before making a recommendation.`,
          emptyIntro: `Additional conditions have been added automatically according to the selections made by the applicant.

  Please review all sections of this application before making a recommendation.`,
          emptyIntroReadOnly: null,
          type: 'condition',
          singular: 'Additional condition',
          review: Conditions
        }
      }
    },
    authorisations: {
      subtitle: 'Authorisations',
      show: props => props.showConditions,
      subsections: {
        authorisations: {
          title: 'Authorisations',
          granted: {
            order: 2,
            show: props => {
              return props.isPreview || (props.conditions || []).find(c => c.type === 'authorisation');
            },
            review: GrantedAuthorisations,
            intro: `These authorisations apply to the project as a whole.

  Authorisations that are specific to a set of procedures can be found in each protocol.`
          },
          addMore: 'Add more authorisations',
          intro: `Authorisations have been added automatically according to the selections made by the applicant.

  Please review all sections of this application before making a recommendation.`,
          emptyIntro: `No authorisations have been added to this licence.

  If you want to add an authorisation, you will need to create one.`,
          emptyIntroReadOnly: 'No authorisations have been added to this licence.',
          type: 'authorisation',
          singular: 'Authorisation',
          review: Authorisations
        }
      }
    }
  });
};
