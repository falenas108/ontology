export interface SparqlSource extends SparqlResults {
  [resultName: `$${string}`]:
    | string
    | undefined
    | /** Will not be this, but below complains without */ string[];
  [results: `$$${string}`]: string[] | undefined;
}

export interface SparqlResults {
  head: {
    vars: string[];
    link: string[];
  };
  results: {
    bindings: [SparqlTableItem | undefined];
  };
}

export interface SparqlTableItem {
  [key: string]:
    | {
        type: string;
        value: string;
      }
    | undefined;
}
