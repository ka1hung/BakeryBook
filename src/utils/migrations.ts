import type { Material } from '../types/material';

export const CURRENT_SCHEMA_VERSION = 2;

/**
 * 遷移材料資料至新的營養欄位結構
 * 從4個欄位擴充至10個欄位（符合台灣食藥署標示規範）
 * @param materials 材料陣列
 * @returns 遷移後的材料陣列
 */
export function migrateMaterialData(materials: Material[]): Material[] {
  return materials.map(material => {
    // 如果沒有營養資料，不需要遷移
    if (!material.nutrition) {
      return material;
    }

    // 檢查是否為舊格式（僅有4個基本欄位）
    const hasOldFormat =
      material.nutrition.calories !== undefined ||
      material.nutrition.protein !== undefined ||
      material.nutrition.fat !== undefined ||
      material.nutrition.carbohydrates !== undefined;

    // 檢查是否已有新欄位
    const hasNewFields =
      material.nutrition.saturatedFat !== undefined ||
      material.nutrition.transFat !== undefined ||
      material.nutrition.sugar !== undefined ||
      material.nutrition.sodium !== undefined;

    // 如果已經有新欄位，表示已經遷移過，不需要再次遷移
    if (hasNewFields) {
      return material;
    }

    // 如果是舊格式，進行遷移（新增欄位，預設值為 undefined）
    if (hasOldFormat) {
      return {
        ...material,
        nutrition: {
          // 保留原有欄位
          calories: material.nutrition.calories,
          protein: material.nutrition.protein,
          fat: material.nutrition.fat,
          carbohydrates: material.nutrition.carbohydrates,
          // 新增欄位（預設為 undefined，讓使用者自行填寫）
          saturatedFat: undefined,
          transFat: undefined,
          sugar: undefined,
          sodium: undefined,
          fiber: undefined,
          cholesterol: undefined,
        },
      };
    }

    return material;
  });
}

/**
 * 檢查是否需要進行資料遷移
 * @param materials 材料陣列
 * @returns 是否需要遷移
 */
export function needsMigration(materials: Material[]): boolean {
  return materials.some(material => {
    if (!material.nutrition) return false;

    const hasOldFormat =
      material.nutrition.calories !== undefined ||
      material.nutrition.protein !== undefined ||
      material.nutrition.fat !== undefined ||
      material.nutrition.carbohydrates !== undefined;

    const hasNewFields =
      material.nutrition.saturatedFat !== undefined ||
      material.nutrition.transFat !== undefined ||
      material.nutrition.sugar !== undefined ||
      material.nutrition.sodium !== undefined;

    // 如果有舊欄位但沒有新欄位，表示需要遷移
    return hasOldFormat && !hasNewFields;
  });
}
