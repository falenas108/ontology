import { ParsedUrlQuery } from 'querystring';

export const getRoute = (query: ParsedUrlQuery): string => {
  const rawRoute = query.home ?? '';
  const route = typeof rawRoute === 'string' ? rawRoute : rawRoute.join('/');
  console.log('Visiting', route);
  return route;
};
