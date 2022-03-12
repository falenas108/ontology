import { BindingType, AvailableResources, processSparql, SparqlResults } from '../../../common';

const mabelSparql: SparqlResults = {
  head: {
    vars: ['firstName', 'lastName', 'brother', 'friends'],
    link: [],
  },
  results: {
    bindings: [
      {
        firstName: {
          type: BindingType.LITERAL,
          value: 'Mabel',
        },
        lastName: {
          type: BindingType.LITERAL,
          value: 'Pines',
        },
        brother: {
          type: BindingType.LITERAL,
          value: 'Dipper',
        },
        friends: {
          type: BindingType.LITERAL,
          value: 'Grenda',
        },
      },
      {
        firstName: {
          type: BindingType.LITERAL,
          value: null,
        },
        lastName: {
          type: BindingType.LITERAL,
          value: null,
        },
        brother: {
          type: BindingType.LITERAL,
          value: null,
        },
        friends: {
          type: BindingType.LITERAL,
          value: null,
        },
      },
    ],
  },
};

export const mabelResources: AvailableResources = {
  mabel: processSparql(mabelSparql),
};
