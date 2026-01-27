import { useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';

/**
 * useLocalStorage Hook
 * 提供與 LocalStorage 同步的狀態管理
 *
 * @param key - LocalStorage 鍵值
 * @param initialValue - 初始值
 * @returns [storedValue, setValue] - 狀態值和更新函數
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 初始化狀態，從 LocalStorage 讀取或使用初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getItem(key, initialValue);
  });

  // 監聽狀態變化，同步到 LocalStorage
  useEffect(() => {
    setItem(key, storedValue);
  }, [key, storedValue]);

  // 設定值函數（支援函數式更新）
  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prevValue) => {
      const valueToStore = value instanceof Function ? value(prevValue) : value;
      return valueToStore;
    });
  };

  return [storedValue, setValue];
}
