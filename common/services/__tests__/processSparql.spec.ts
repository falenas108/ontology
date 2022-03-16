import { BindingType } from '../../models/bindingType';
import { SparqlResults } from '../../models/sparql';
import { processSparql } from '../processSparql';

describe('process sparql', () => {
  const rawSparql: SparqlResults = {
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
            value: 'Candy',
          },
        },
      ],
    },
  };

  const transformedResponse = {
    $all: {
      firstName: ['Mabel'],
      lastName: ['Pines'],
      brother: ['Dipper'],
      friends: ['Grenda', 'Candy'],
    },
    $bindingValues: [
      { firstName: 'Mabel', lastName: 'Pines', brother: 'Dipper', friends: 'Grenda' },
      { friends: 'Candy' },
    ],
    $originalResults: {
      head: { vars: ['firstName', 'lastName', 'brother', 'friends'], link: [] },
      results: {
        bindings: [
          {
            firstName: { type: BindingType.LITERAL, value: 'Mabel' },
            lastName: { type: BindingType.LITERAL, value: 'Pines' },
            brother: { type: BindingType.LITERAL, value: 'Dipper' },
            friends: { type: BindingType.LITERAL, value: 'Grenda' },
          },
          {
            firstName: { type: BindingType.LITERAL, value: null },
            lastName: { type: BindingType.LITERAL, value: null },
            brother: { type: BindingType.LITERAL, value: null },
            friends: { type: BindingType.LITERAL, value: 'Candy' },
          },
        ],
      },
    },
    firstName: 'Mabel',
    lastName: 'Pines',
    brother: 'Dipper',
    friends: 'Grenda',
  };

  it('Should transform a sparql request correctly, filling in fields as needed', () => {
    expect(processSparql(rawSparql)).toEqual(transformedResponse);
  });
});
