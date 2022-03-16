import { getRoute } from '../getRoute';

describe('Get route', () => {
  const simpleRoute = { home: 'one' };
  const nestedRoute = { home: ['one', 'two', 'three', 'two'] };
  it('should extract the proper route for a string route', () => {
    expect(getRoute(simpleRoute)).toEqual('one');
  });

  it('should extract the proper route for a nested route', () => {
    expect(getRoute(nestedRoute)).toEqual('one/two/three/two');
  });
});
