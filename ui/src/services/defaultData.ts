import { SparqlSimplified } from '../common/sparqlTable';
import { fetchSparql } from './executeSparql';

export const fetchDefaultData = async (): Promise<SparqlSimplified> => {
  return fetchSparql(
    process.env.NEXT_PUBLIC_BASE_URL ?? '',
    `SELECT * WHERE { $s $p $o } LIMIT 10`
  );
};
