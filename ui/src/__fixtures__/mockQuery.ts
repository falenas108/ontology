import { SparqlResults } from '../common/sparqlTable';

export const mockSparqlTable: SparqlResults = {
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
          value: 'Heather',
        },
      },
    ],
  },
};
