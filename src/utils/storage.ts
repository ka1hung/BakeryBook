/**
 * LocalStorage 工具函數
 * 提供類型安全的資料存取功能
 */

// 儲存資料到 LocalStorage
export function setItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// 從 LocalStorage 讀取資料
export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

// 從 LocalStorage 移除資料
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

// 清空 LocalStorage
export function clear(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// LocalStorage 鍵值常數
export const STORAGE_KEYS = {
  MATERIALS: 'recipe_db_materials',
  RECIPES: 'recipe_db_recipes',
  MATERIAL_VIEW_MODE: 'recipe_db_material_view_mode',
  RECIPE_VIEW_MODE: 'recipe_db_recipe_view_mode',
} as const;
