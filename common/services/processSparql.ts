import cloneDeep from 'lodash/cloneDeep';
import { SparqlResults, SparqlSimplified } from '..';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const processSparql = (inputSparql?: SparqlResults): SparqlSimplified => {
  const argv = yargs(hideBin(process.argv)).argv;
  const rawSparql = inputSparql ?? JSON.parse(argv[0] as string);
  const copy: SparqlResults = cloneDeep(rawSparql) as SparqlResults;
  const simplified: SparqlSimplified = {
    $all: {},
    // Would normally just .fill({}), but that assigns the exact same object reference to each element
    // So modifying one modifies them all
    $bindingValues: Array(copy.results.bindings.length)
      .fill(0)
      .map(() => ({})),
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
