const cache = new Map();

const cacheService = {
  get: (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
      cache.delete(key);
      return null;
    }
    return cached.data;
  },
  set: (key, data, ttlMs) => {
    cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  },
  delete: (key) => {
    cache.delete(key);
  },
  clear: () => {
    cache.clear();
  }
};

module.exports = cacheService;
