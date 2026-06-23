const TTL = 10 * 60 * 1000; // 10 minutes in ms

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const createCache = <T>() => {
  const store = new Map<string, CacheEntry<T>>();

  return {
    get(key: string): T | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp > TTL) {
        store.delete(key);
        return null;
      }
      return entry.data;
    },
    set(key: string, data: T) {
      store.set(key, { data, timestamp: Date.now() });
    },
  };
};
