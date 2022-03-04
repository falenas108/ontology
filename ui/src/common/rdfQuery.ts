export type RDFQuery = RDFResource[];
export interface RDFResource {
  '@id': string;
  '@type'?: string[];
  [predicate: string]: RDFPredicateValue[] | string | string[] | undefined;
}

export interface RDFPredicateValue {
  '@value'?: string;
  '@id'?: string;
}

export interface RDFData {
  value: string;
  type: RDFDataType;
  datatype?: string;
}

export enum RDFDataType {
  // TODO: Fill out
  URI = 'uri',
  LITERAL = 'literal',
}

[
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
