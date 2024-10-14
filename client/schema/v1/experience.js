import { isTrainingLicence } from '../../helpers';

export default {
  title: 'Experience',
  fields: [
    {
      name: 'experience-projects',
      show: values => !isTrainingLicence(values),
      label: 'Have you managed similar work in this field before?',
      alt: {
        label: 'Has this person managed similar work in this field before?'
      },
      type: 'radio',
      inline: true,
      className: 'smaller',
      options: [
        {
          label: 'Yes',
          value: true,
          reveal: {
            name: 'experience-achievements',
            label: 'What were your, or your group\'s, main achievements that are relevant to this application?',
            alt: {
              label: 'What were this person\'s, or their group\'s, main achievements that are relevant to this application?'
            },
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
      name: 'training-has-delivered',
      show: values => isTrainingLicence(values),
      label: 'Have you previously delivered courses that required a higher education and training licence?',
      alt: {
        label: 'Has this person previously delivered courses that required a higher education and training licence?'
      },
      type: 'radio',
      inline: true,
      className: 'smaller',
      options: [
        {
          label: 'Yes',
          value: true,
          reveal: {
            name: 'training-delivery-experience',
            label: 'Describe your experience of delivering these types of courses. test',
            alt: {
              label: 'Describe this person\'s experience of delivering these types of courses.'
            },
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
      name: 'experience-knowledge',
      show: values => !isTrainingLicence(values),
      label: 'What relevant scientific knowledge or education do you have?',
      alt: {
        label: 'What relevant scientific knowledge or education does this person have?'
      },
      type: 'texteditor'
    },
    {
      name: 'training-knowledge',
      show: values => isTrainingLicence(values),
      label: 'What education, knowledge, or experience do you have that\'s relevant to the course subject matter?',
      alt: {
        label: 'What education, knowledge, or experience does this person have that\'s relevant to the course subject matter?'
      },
      type: 'texteditor'
    },
    {
      name: 'experience-animals',
      show: values => !isTrainingLicence(values),
      label: 'What experience do you have of using the types of animals and experimental models stated in this licence application?',
      alt: {
        label: 'What experience does this person have of using the types of animals and experimental models stated in this licence application?'
      },
      type: 'texteditor'
    },
    {
      name: 'experience-experimental-design',
      show: values => !isTrainingLicence(values),
      label: 'What experimental design and data analysis training have you had?',
      alt: {
        label: 'What experimental design and data analysis training has this person had?',
        hint: 'If they do not have this expertise, how will they access it?'
      },
      hint: 'If you do not have this expertise, how will you access it?',
      type: 'texteditor'
    },
    {
      name: 'training-facilities',
      show: values => isTrainingLicence(values),
      label: 'What teaching facilities and equipment will you have access to?',
      alt: {
        label: 'What teaching facilities and equipment will this person have access to?'
      },
      type: 'texteditor'
    },
    {
      name: 'experience-others',
      label: 'Why are you the most suitable person to manage this project?',
      hint: 'Your role, seniority or expertise in managing projects of this nature may be relevant.',
      alt: {
        label: 'Why is this person the most suitable person to manage the project?',
        hint: 'Their role, seniority or expertise in managing projects of this nature may be relevant.'
      },
      type: 'texteditor'
    },
    {
      name: 'funding-previous',
      label: 'What relevant expertise and staffing will be available to support you?',
      hint: 'Include examples of practical or specialist support you\'ll be able to draw on. If anyone is going to help manage the project, explain how.',
      alt: {
        label: 'What relevant expertise and staffing will be available to support this person?',
        hint: 'Include examples of practical or specialist support they\'ll be able to draw on. If anyone is going to help manage the project, explain how.'
      },
      type: 'texteditor'
    }
  ]
};
