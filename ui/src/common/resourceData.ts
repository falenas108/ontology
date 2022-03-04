import { RDF } from './rdf';
import { SparqlTable } from './sparqlTable';

export interface Resources<T = RDF | SparqlTable> {
  [id: string]: T;
}
