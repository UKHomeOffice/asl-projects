import ExperimentalDesign from './pages/sections/experimental-design';
import Protocols from './pages/sections/protocols'

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
  rabbits: {
    title: 'Rabbits',
    subsections: {
      rabbits: {
        title: 'Add rabbit',
        component: Protocols,
        fields: [
          {
            name: 'name',
            label: 'What would you like to name your rabbit?',
            type: 'text',
            required: true,
            step: 0
          },
          {
            name: 'colour',
            label: 'Choose the colour of your rabbit',
            type: 'radio',
            options: [
              'White',
              'Gray',
              'Black',
              'Blue'
            ],
            required: true,
            step: 0
          },
          {
            name: 'attributes',
            label: 'Which attributes should your rabbit have',
            type: 'radio',
            options: [
              'Fluffy',
              'Hoppy',
              'Cuddly'
            ],
            step: 1
          }
        ]
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
