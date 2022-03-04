export interface SparqlTable {
  head: {
    vars: string[];
    link: string[];
  };
  results: {
    bindings: SparqlTableItem[];
  };
}

export interface SparqlTableItem {
  resource: {
    type: string;
    value: string;
  };
  name: {
    type: string;
    value: string;
  };
}
