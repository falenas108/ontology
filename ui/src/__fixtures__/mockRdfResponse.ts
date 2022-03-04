import { RDF } from '../common/rdf';

export const mockRDFResponse: RDF = [
  {
    '@id': 'https://example.com/person/Heather',
    '@type': ['http://www.w3.org/2000/10/swap/pim/contact#Person'],
    'http://www.w3.org/2000/10/swap/pim/contact#fullName': [
      {
        '@value': 'Heather',
      },
    ],
    'http://www.w3.org/2000/10/swap/pim/contact#mailbox': [
      {
        '@value': 'heather@example.com',
      },
    ],
    'http://xmlns.com/foaf/0.1/knows': [
      {
        '@id': 'https://example.com/person/Jay',
      },
    ],
  },
];
