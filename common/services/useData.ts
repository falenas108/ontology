import { ServiceCache } from './serviceCache';

const cache = new ServiceCache();

export const useData = <T>(key: string, fetcher: () => Promise<T>): T => {
  if (!cache.getItem(key)) {
    let data: unknown;
    let promise: Promise<unknown>;
    cache.addItem(key, () => {
      if (data !== undefined) {
        return data;
      }
      if (!promise) {
        promise = fetcher().then((response: unknown) => (data = response));
      }
      throw promise;
    });
  }
  return cache.getItem(key)();
};
