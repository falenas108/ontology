export class ServiceCache {
  constructor(protected maxItems = 10000) {}

  // First in, first out if max items reached
  protected keyQueue: string[] = [];
  protected cache = new Map<string, { expirationTime: number; value: unknown }>();

  /**
   *
   * @param key key of item
   * @param value item to store
   * @param ttl time to live, in ms. Defaults to 1 hour.
   */
  public addItem = (key: string, value: unknown, ttl: number = 360000) => {
    const oldIndex = this.keyQueue.indexOf(key);
    if (oldIndex !== -1) {
      // If key already present, remove it because it'll be added at the front of the queue
      this.keyQueue.splice(oldIndex, 1);
    }
    if (this.keyQueue.length >= this.maxItems) {
      const oldItem = this.keyQueue.shift()!;
      this.cache.delete(oldItem);
    }

    this.keyQueue.push(key);
    this.cache.set(key, { value, expirationTime: new Date().valueOf() + ttl });
  };

  public getItem = (key: string): any => {
    const item = this.cache.get(key);
    if (item) {
      if (new Date().valueOf() < item.expirationTime) {
        return item.value;
      } else {
        this.cache.delete(key);
        const index = this.keyQueue.indexOf(key);
        this.keyQueue.splice(index, 1);
      }
    }
  };
}
