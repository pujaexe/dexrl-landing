const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Mengambil data dari localStorage dengan parsing JSON otomatis
 * @param key - Key untuk data yang akan diambil
 * @param defaultValue - Nilai default jika data tidak ditemukan
 * @returns Data yang sudah di-parse atau defaultValue
 */
export const getItem = <T = any>(key: string, defaultValue: T | null = null): T | null => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage tidak tersedia di browser ini');
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error membaca localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Menyimpan data ke localStorage dengan JSON stringify otomatis
 * @param key - Key untuk data yang akan disimpan
 * @param value - Nilai yang akan disimpan
 */
export const setItem = <T = any>(key: string, value: T): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage tidak tersedia di browser ini');
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error menyimpan ke localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Menghapus item dari localStorage
 * @param key - Key untuk data yang akan dihapus
 */
export const removeItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage tidak tersedia di browser ini');
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error menghapus localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Menghapus semua data dari localStorage
 */
export const clear = (): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage tidak tersedia di browser ini');
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error membersihkan localStorage:', error);
    return false;
  }
};

/**
 * Mengecek apakah key tertentu ada di localStorage
 * @param key - Key yang akan dicek
 * @returns true jika key ada, false jika tidak
 */
export const hasItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};

/**
 * Mengambil data dengan expired time support
 * Data akan otomatis dihapus jika sudah expired
 * @param key - Key untuk data yang akan diambil
 * @param defaultValue - Nilai default jika data tidak ditemukan atau expired
 * @returns Data yang sudah di-parse atau defaultValue
 */
export const getItemWithExpiry = <T = any>(
  key: string,
  defaultValue: T | null = null
): T | null => {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }

    const parsed = JSON.parse(item) as { value: T; expiry: number };
    const now = Date.now();

    // Jika sudah expired, hapus dan return defaultValue
    if (now > parsed.expiry) {
      localStorage.removeItem(key);
      return defaultValue;
    }

    return parsed.value;
  } catch (error) {
    console.error(`Error membaca localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Menyimpan data dengan expired time
 * @param key - Key untuk data yang akan disimpan
 * @param value - Nilai yang akan disimpan
 * @param ttl - Time to live dalam milliseconds
 */
export const setItemWithExpiry = <T = any>(
  key: string,
  value: T,
  ttl: number
): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage tidak tersedia di browser ini');
    return false;
  }

  try {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error menyimpan ke localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Mengambil semua keys dari localStorage
 * @returns Array of keys atau empty array
 */
export const getAllKeys = (): string[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch {
    return [];
  }
};

/**
 * Mengambil semua data dari localStorage
 * @returns Object dengan key-value pairs atau empty object
 */
export const getAllItems = (): Record<string, any> => {
  if (!isLocalStorageAvailable()) {
    return {};
  }

  const items: Record<string, any> = {};
  try {
    Object.keys(localStorage).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item !== null) {
        try {
          items[key] = JSON.parse(item);
        } catch {
          items[key] = item;
        }
      }
    });
  } catch (error) {
    console.error('Error membaca semua localStorage:', error);
  }

  return items;
};

