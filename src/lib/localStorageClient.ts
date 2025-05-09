/**
 * Retrieves an item from localStorage.
 * Ensures that localStorage is accessed only on the client side.
 * @param key The key of the item to retrieve.
 * @returns The parsed item, or null if not found or if not on client.
 */
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Sets an item in localStorage.
 * Ensures that localStorage is accessed only on the client side.
 * @param key The key of the item to set.
 * @param value The value to set.
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Removes an item from localStorage.
 * Ensures that localStorage is accessed only on the client side.
 * @param key The key of the item to remove.
 */
export function removeItem(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}
