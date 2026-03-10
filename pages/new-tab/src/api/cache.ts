interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export async function getCached<T>(key: string, maxAgeMs: number): Promise<T | null> {
  const result = await chrome.storage.local.get(key);
  const entry = result[key] as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > maxAgeMs) return null;
  return entry.data;
}

export async function setCache<T>(key: string, data: T): Promise<void> {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  await chrome.storage.local.set({ [key]: entry });
}
