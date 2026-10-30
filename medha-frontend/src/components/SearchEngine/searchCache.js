// High Speed In-Memory Client Cache for 0ms Instant Response
const clientSearchCache = new Map();
const CACHE_CAPACITY = 100;

export function getClientCache(key) {
  const item = clientSearchCache.get(key);
  if (!item) return null;
  // 5 minute client-side TTL
  if (Date.now() - item.timestamp > 5 * 60 * 1000) {
    clientSearchCache.delete(key);
    return null;
  }
  return item;
}

export function setClientCache(key, data, latency) {
  if (clientSearchCache.size >= CACHE_CAPACITY) {
    const oldestKey = clientSearchCache.keys().next().value;
    clientSearchCache.delete(oldestKey);
  }
  clientSearchCache.set(key, { data, timestamp: Date.now(), latency });
}
