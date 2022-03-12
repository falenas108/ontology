import cloneDeep from 'lodash/cloneDeep';
import { SparqlResults, SparqlSimplified } from '..';

export const processSparql = (rawSparql: SparqlResults): SparqlSimplified => {
  const copy: SparqlResults = cloneDeep(rawSparql) as SparqlResults;
  const simplified: SparqlSimplified = {
    $all: {},
    $bindingValues: Array(copy.results.bindings.length).fill({}),
    $originalResults: copy,
  } as SparqlSimplified;

  copy.results.bindings.forEach((binding, index) => {
    Object.entries(binding).forEach(([variable, result]) => {
      if (result?.value) {
        simplified.$bindingValues[index][variable] = result.value;
        if (!simplified[variable]) {
          // Haven't seen before
          // This is the first time seeing variable, fill default value for that variable
          simplified[variable] = result.value;
          // Create array for that variable
          simplified.$all[variable] = [result.value];
        } else {
          // Have seen before, do not fill default value but add to array
          simplified.$all[variable] = [...simplified.$all[variable]!, result.value];
        }
      }
    });
  });

  return simplified;
};
