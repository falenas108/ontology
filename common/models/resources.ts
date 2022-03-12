import { SparqlSimplified } from './sparql';
export interface AvailableResources {
  /** Must match resource name declared in Resource */
  [resourceName: string]: SparqlSimplified;
}
