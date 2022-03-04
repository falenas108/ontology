import { cloneDeep } from 'lodash';
import { PageLayout, LayoutResourceType, ContentConfig } from './pageLayout';
import { RDF } from './rdf';
import { Resources } from './resourceData';
import { SparqlTable } from './sparqlTable';

/** Returns the layout where dynamic elements are replaced with the string resource they correspond to */
export const fillLayout = (pageLayout: PageLayout, resources: Resources): PageLayout => {
  //   const captureDynamicElement = new RegExp(/(?<!\\)\{.*?\}/g);
  const captureDynamicElement = new RegExp(/(?<!\\)(\{.*?\})/g);
  const newLayout = cloneDeep(pageLayout);
  return {
    ...newLayout,
    layout: newLayout.layout.map((layoutItem) => {
      // If item has a dynamic element, Do Things. Otherwise, return basic element
      if (captureDynamicElement.test(layoutItem.content ?? '')) {
        return {
          ...layoutItem,
          content: layoutItem.content
            ?.split(captureDynamicElement)
            .map((item) => {
              // Will get dynamic and dynamic parts from the split, only replace dynamic parts.
              //   Return regular elements
              if (captureDynamicElement.test(item)) {
                //   remove { and }
                const identifier = item.slice(1, item.length - 1);

                const matchingConfig = layoutItem.contentConfig?.find(
                  (config) => config.identifier === identifier
                );
                if (!matchingConfig) {
                  console.warn('No matching identifier found in the configs for', identifier);
                  return '';
                }

                const layoutResource = pageLayout.resources.find(
                  (resource) => resource.name === matchingConfig.resourceName
                );
                if (!layoutResource) {
                  console.warn(
                    'Could not find resource provided matching',
                    matchingConfig.resourceName
                  );
                  return '';
                }

                const rdfData = resources[matchingConfig.resourceName];
                if (!rdfData) {
                  console.warn(
                    'Could not find data from provided resource',
                    matchingConfig.resourceName
                  );
                  return '';
                }

                if (layoutResource.type === LayoutResourceType.RDF) {
                  return replaceByRdf(matchingConfig, rdfData as RDF);
                } else if (layoutResource.type === LayoutResourceType.SPARQL_TABLE) {
                  return replaceByTable(rdfData as SparqlTable);
                } else {
                  console.warn('unknown resource type', layoutResource.type);
                  return '';
                }
              }
              return item;
            })
            .join(''),
        };
      }
      return layoutItem;
    }),
  };
};

export const replaceByRdf = (config: ContentConfig, resource: RDF): string => {
  if (!config.predicate) {
    console.warn('Must define predicate for accessing RDF resources');
    return '';
  }

  const result = resource[0][config.predicate]?.[0];
  if (!result || typeof result !== 'object') {
    console.warn('Could not find value with provided predicate', config.predicate);
    return '';
  }
  return result['@value'] ?? '';
};

export const replaceByTable = (resource: SparqlTable): string => {
  return resource.results.bindings[0]?.name?.value ?? '';
};
