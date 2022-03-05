import { SparqlResults, SparqlSource } from '../common/sparqlTable';
import { processSparql } from './processSparql';

export const fetchSparql = async (url: string, query: string): Promise<SparqlSource> => {
  console.log('Making request with URL', url, 'with query:', query);
  const encodedQuery = encodeURIComponent(query);
  const urlWithQuery = `${url}?query=${encodedQuery}`;

  const rawResponse = await fetch(urlWithQuery, { headers: { accept: 'application/json' } });

  const response: SparqlResults = await rawResponse.json();
  console.log('Got response', response);
  return processSparql(response);
};
