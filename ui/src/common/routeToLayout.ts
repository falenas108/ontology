import { AvailableResources } from '../../../common';
import { mabelResources } from '../../public/layouts/mabel.resource';
import { dipperResources } from '../../public/layouts/dipper.resource';

export const routeToLayout = (path: string): { resources: AvailableResources; layout: string } => {
  // TODO: Replace with proper data from build
  const mockData: Record<string, AvailableResources | undefined> = {
    dipper: dipperResources,
    mabel: mabelResources,
  };

  const resources = mockData[path];
  if (!resources) {
    console.error('Cannot locate resources for', path);
  }

  let layoutModule;
  try {
    layoutModule = require(`../../public/layouts/${path}.layout.ts`);
  } catch {
    throw new Error(`No layout found for ${path}`);
  }
  if (!layoutModule.default) {
    throw new Error(`Layout module ${path} must have named export 'layout'`);
  }
  const layout = layoutModule.default;

  return {
    resources: resources ?? {},
    layout,
  };
};
