import { BindingType } from './bindingType';

export type RDFQuery = RDFResource[];

export type RDFResource = {
  [predicate in string]: RDFPredicateValue[] | undefined;
} & {
  '@id': string;
  '@type'?: string[];
};

export interface RDFPredicateValue {
  '@value'?: string;
  '@id'?: string;
}

export interface RDFData {
  value: string;
  type: BindingType;
  datatype?: string;
}
