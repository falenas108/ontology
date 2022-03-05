import { cloneDeep } from 'lodash';
import { SparqlResults, SparqlSource } from '../common/sparqlTable';

export const processSparql = (rawSparql: SparqlResults): SparqlSource => {
  const sparqlSource: SparqlSource = cloneDeep(rawSparql) as SparqlSource;
  sparqlSource.head.vars.forEach((variable) => {
    const value = rawSparql.results.bindings[0]?.[variable]?.value;
    if (value === undefined) {
      console.warn('Not able to find value in result for variable', variable);
    }
    sparqlSource[`$${variable}`] = value;
  });
  return sparqlSource;
};
