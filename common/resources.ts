import { SparqlSimplified } from './sparqlResults';
export interface AvailableResources {
  /** Must match resource name declared in Resource */
  [resourceName: string]: SparqlSimplified;
}
