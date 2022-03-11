import { ServiceCache } from '../serviceCache';

class Cut extends ServiceCache {
  public keyQueue: string[] = [];
  public cache = new Map<string, { expirationTime: number; value: unknown }>();
}

describe('service cache', () => {
  const maxItemCount = 10;
  const item1 = { hello: 'world' };
  const item2 = [1, 2, 3];
  const item3 = 'test!';

  let serviceCache: Cut;
  beforeEach(() => {
    serviceCache = new Cut(maxItemCount);
  });

  it('Should cache and retrieve items', () => {
    serviceCache.addItem('one', item1);
    serviceCache.addItem('two', item2);
    serviceCache.addItem('three', item3);
    const one = serviceCache.getItem('one');
    const two = serviceCache.getItem('two');
    const three = serviceCache.getItem('three');

    expect(one).toEqual(one);
    expect(two).toEqual(two);
    expect(three).toEqual(three);
  });

  it('Should dump the oldest item if more than the limit is added', () => {
    const lotsOfItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    lotsOfItems.forEach((item) => serviceCache.addItem(item.toString(), item));
    expect(serviceCache.getItem('1')).toBe(undefined);
    expect(serviceCache.getItem('2')).toBe(2);
    expect(serviceCache.cache.size).toBe(maxItemCount);
    expect(serviceCache.keyQueue.length).toBe(maxItemCount);
  });

  it('Should keep an old item if it was reset', () => {
    const lotsOfItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    lotsOfItems.forEach((item) => serviceCache.addItem(item.toString(), item));
    serviceCache.addItem('1', 1);
    expect(serviceCache.keyQueue[serviceCache.keyQueue.length - 1]).toBe('1');
    serviceCache.addItem('11', 11);
    expect(serviceCache.getItem('1')).toBe(1);
    expect(serviceCache.getItem('2')).toBe(undefined);
    expect(serviceCache.getItem('3')).toBe(3);
    expect(serviceCache.keyQueue.length).toBe(10);
  });

  it('Should dump items that are past expiration', () => {
    serviceCache.addItem('one', item1, 1000);
    serviceCache.addItem('two', item2, 2000);
    jest.advanceTimersByTime(1500);
    expect(serviceCache.getItem('one')).toBe(undefined);
    expect(serviceCache.getItem('two')).toBe(item2);
    expect(serviceCache.keyQueue.length).toBe(1);
    expect(serviceCache.cache.size).toBe(1);
  });
});
