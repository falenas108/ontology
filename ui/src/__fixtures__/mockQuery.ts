import { SparqlTable } from '../common/sparqlTable';

export const mockSparqlTable: SparqlTable = {
  head: {
    vars: ['resource', 'name'],
    link: ['info'],
  },
  results: {
    bindings: [
      {
        resource: {
          type: 'uri',
          value: 'https://example.com/person/Jay',
        },
        name: {
          type: 'literal',
          value: 'Jay',
        },
      },
      {
        resource: {
          type: 'uri',
          value: 'https://example.com/person/Heather',
        },
        name: {
          type: 'literal',
          value: 'Heather',
        },
      },
    ],
  },
};
