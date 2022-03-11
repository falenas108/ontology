import { BindingType, AvailableResources } from '../../common';

// This would be provided by build process
export const testResources: AvailableResources = {
  // @ts-ignore this is correct
  julia: {
    firstName: 'Julia',
    lastName: 'Juliana',
    $all: {
      firstName: ['Julia'],
      lastName: ['Julinana'],
    },
    $bindingValues: [{ firstname: 'Julia', lastName: 'Juliana' }],
    $originalResults: {
      head: {
        vars: ['firstName', 'lastName'],
        link: ['info'],
      },
      results: {
        bindings: [
          {
            firstName: { type: BindingType.LITERAL, value: 'Julia' },
            lastName: { type: BindingType.LITERAL, value: 'Julia' },
          },
        ],
      },
    },
  },
};
