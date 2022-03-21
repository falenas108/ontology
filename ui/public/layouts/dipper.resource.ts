import { BindingType, AvailableResources, processSparql, SparqlResults } from '../../../common';

const dipperSparql: SparqlResults = {
  head: {
    vars: ['firstName', 'lastName', 'brother', 'friends'],
    link: [],
  },
  results: {
    bindings: [
      {
        firstName: {
          type: BindingType.LITERAL,
          value: 'Dipper',
        },
        lastName: {
          type: BindingType.LITERAL,
          value: 'Pines',
        },
        sister: {
          type: BindingType.LITERAL,
          value: 'Mabel',
        },
        friends: {
          type: BindingType.LITERAL,
          value: 'Wendy',
        },
      },
    ],
  },
};

export const dipperResources: AvailableResources = {
  dipper: processSparql(dipperSparql),
};
