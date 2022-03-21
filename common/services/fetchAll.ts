import { SparqlSimplified } from '..';
import { fetchSparql } from './fetchSparql';

export const fetchAll = async (): Promise<SparqlSimplified> => {
  return fetchSparql(
    process.env.NEXT_PUBLIC_BASE_URL ?? '',
    `SELECT * WHERE { $s $p $o } LIMIT 10`
  );
};
