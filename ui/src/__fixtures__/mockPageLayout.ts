import {
  LayoutResourceType,
  LayoutType,
  PageLayout,
} from '../common/pageLayout';

export const mockPageLayout: PageLayout = {
  resources: [
    {
      type: LayoutResourceType.RDF,
      name: 'HeatherRDF',
      url: 'https://example.com/person/Heather',
    },
    {
      type: LayoutResourceType.SPARQL_TABLE,
      name: 'Knows',
      url: '/queries/names',
    },
  ],
  layout: [
    {
      type: LayoutType.H1,
      content: 'This is an example',
    },
    {
      type: LayoutType.SPACING,
      content: '30',
    },
    {
      type: LayoutType.PARAGRAPH,
      content: 'An example about {Heather}, who knows {friend}',
      contentConfig: [
        {
          identifier: 'Heather',
          resourceName: 'HeatherRDF',
          predicate: 'http://www.w3.org/2000/10/swap/pim/contact#fullName',
        },
        {
          identifier: 'friend',
          resourceName: 'Knows',
        },
      ],
    },
  ],
};
