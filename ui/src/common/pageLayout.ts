export interface PageLayout {
  resources: LayoutResource[];
  layout: LayoutItem[];
}

export interface LayoutResource {
  name: string /** identifier that will be used in the layout */;
  type: LayoutResourceType;
  url: string;
}

export enum LayoutResourceType {
  RDF = 'RDF',
  SPARQL_TABLE = 'SPARQL_TABLE',
}

export interface LayoutItem {
  type: LayoutType;
  /**
   * Can be a regular string, or can include a variable to be substituted.
   * If substituting, should be wrapped in curly braces, e.g.
   * 'the phone number is {phoneNumber}'
   *
   * If you want to use {} in regular text, escape the first { with \
   * */
  content?: string;
  /** Only defined if the content block contains variables */
  contentConfig?: ContentConfig[];
}

export interface ContentConfig {
  /** Matches the variable it applies to in the content block */
  identifier: string;
  /** Should match the name given in resources */
  resourceName: string;
  /** Needed for accessing data in an RDF, not needed for SPARQL queries */
  predicate?: string;
}

export enum LayoutType {
  PARAGRAPH = 'PARAGRAPH',
  BUTTON = 'BUTTON',
  H1 = 'H1',
  SPACING = 'SPACING',
}
