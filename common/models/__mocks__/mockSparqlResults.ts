import { BindingType, SparqlResults } from '../..';

export const mockSparqlTable: SparqlResults = {
  head: {
    vars: ['resource', 'name'],
    link: ['info'],
  },
  results: {
    bindings: [
      {
        resource: {
          type: BindingType.URI,
          value: 'https://example.com/person/Heather',
        },
        name: {
          type: BindingType.LITERAL,
          value: 'Heather',
        },
      },
      {
        resource: {
          type: BindingType.URI,
          value: 'https://example.com/person/Jay',
        },
        name: {
          type: BindingType.LITERAL,
          value: 'Jay',
        },
      },
    ],
  },
};
