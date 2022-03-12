import { BindingType } from './bindingType';

export type SparqlSimplified<variables extends string = string> = {
  /** Gets the FIRST binding from the sparql result  */
  [variable in variables]: string | boolean | undefined;
} & {
  /**  Gets all bindings from a specific variable in a sparql result */
  $all: { [variable in variables]: string[] | undefined };
} & {
  // All bindings in the original format, but gives the value instead of object with type/value
  $bindingValues: Array<{ [variable: string]: string | undefined }>;
  /**  Full original sparql results */
  $originalResults: SparqlResults;
};

export interface SparqlResults {
  head: {
    vars: string[];
    link: string[];
  };
  results: {
    bindings: SparqlTableItem[];
  };
}

export interface SparqlTableItem {
  [variable: string]: { type: BindingType; value: string | null } | undefined;
}
