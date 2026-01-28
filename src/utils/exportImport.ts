import type { Material } from '../types/material';
import type { Recipe } from '../types/recipe';
import type { ExportData, ImportOptions, ImportResult } from '../types/export';
import { findOrphanedReferences } from './referentialIntegrity';

const APP_NAME = 'Recipe Database';
const APP_VERSION = '0.2.0';
const CURRENT_EXPORT_VERSION = 1;

/**
 * 驗證字串是否為有效的 ISO 日期格式
 * @param dateString 待驗證的日期字串
 * @returns 是否為有效的 ISO 日期字串
 */
function isValidISODateString(dateString: unknown): dateString is string {
  if (typeof dateString !== 'string') return false;

  // Check if it's a valid ISO date string
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
}

/**
 * 驗證單位是否為有效的 Unit 類型
 * @param unit 待驗證的單位
 * @returns 是否為有效單位
 */
function isValidUnit(unit: unknown): unit is import('../types/material').Unit {
  const validUnits: import('../types/material').Unit[] = ['g', 'kg', 'ml', 'l'];
  return typeof unit === 'string' && validUnits.includes(unit as import('../types/material').Unit);
}

/**
 * 驗證營養成分結構
 * @param nutrition 待驗證的營養成分物件
 * @returns 是否為有效的營養成分結構
 */
function validateNutritionStructure(nutrition: unknown): nutrition is import('../types/material').Nutrition {
  if (!nutrition || typeof nutrition !== 'object') return false;

  const n = nutrition as Record<string, unknown>;

  // All nutrition fields are optional, but if present must be numbers >= 0
  const optionalNumberFields = [
    'calories',
    'protein',
    'fat',
    'saturatedFat',
    'transFat',
    'carbohydrates',
    'sugar',
    'sodium',
    'fiber',
    'cholesterol',
  ];

  for (const field of optionalNumberFields) {
    if (n[field] !== undefined) {
      if (typeof n[field] !== 'number' || (n[field] as number) < 0) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 驗證配方材料項目結構
 * @param ingredient 待驗證的材料項目
 * @returns 是否為有效的材料項目結構
 */
function validateIngredientStructure(ingredient: unknown): ingredient is import('../types/recipe').RecipeIngredient {
  if (!ingredient || typeof ingredient !== 'object') return false;

  const ing = ingredient as Record<string, unknown>;

  // Validate required fields
  if (typeof ing.materialId !== 'string' || ing.materialId.length === 0) {
    return false;
  }
  if (typeof ing.weight !== 'number' || ing.weight <= 0) return false;
  if (!isValidUnit(ing.unit)) return false;

  return true;
}

/**
 * 驗證材料結構的所有必要欄位
 * @param material 待驗證的材料物件
 * @returns 是否為有效的材料結構
 */
function validateMaterialStructure(material: unknown): material is Material {
  if (!material || typeof material !== 'object') return false;

  const m = material as Record<string, unknown>;

  // Validate required string fields
  if (typeof m.id !== 'string' || m.id.length === 0) return false;
  if (typeof m.name !== 'string' || m.name.length === 0) return false;

  // Validate required number fields
  if (typeof m.price !== 'number' || m.price < 0) return false;
  if (typeof m.weight !== 'number' || m.weight <= 0) return false;

  // Validate unit is a valid enum value
  if (!isValidUnit(m.unit)) return false;

  // Validate timestamp fields (required)
  if (!isValidISODateString(m.createdAt)) return false;
  if (!isValidISODateString(m.updatedAt)) return false;

  // Validate optional description
  if (m.description !== undefined && typeof m.description !== 'string') {
    return false;
  }

  // Validate optional nutrition object
  if (m.nutrition !== undefined) {
    if (!validateNutritionStructure(m.nutrition)) return false;
  }

  return true;
}

/**
 * 驗證配方結構的所有必要欄位
 * @param recipe 待驗證的配方物件
 * @returns 是否為有效的配方結構
 */
function validateRecipeStructure(recipe: unknown): recipe is Recipe {
  if (!recipe || typeof recipe !== 'object') return false;

  const r = recipe as Record<string, unknown>;

  // Validate required string fields
  if (typeof r.id !== 'string' || r.id.length === 0) return false;
  if (typeof r.name !== 'string' || r.name.length === 0) return false;

  // Validate timestamp fields (required)
  if (!isValidISODateString(r.createdAt)) return false;
  if (!isValidISODateString(r.updatedAt)) return false;

  // Validate ingredients array
  if (!Array.isArray(r.ingredients)) return false;
  for (const ingredient of r.ingredients) {
    if (!validateIngredientStructure(ingredient)) return false;
  }

  // Validate optional description
  if (r.description !== undefined && typeof r.description !== 'string') {
    return false;
  }

  // Validate optional servings
  if (r.servings !== undefined) {
    if (typeof r.servings !== 'number' || r.servings < 1) return false;
  }

  return true;
}

/**
 * 匯出所有資料為JSON格式
 * @param materials 材料陣列
 * @param recipes 配方陣列
 * @returns 匯出資料結構
 */
export function exportData(
  materials: Material[],
  recipes: Recipe[]
): ExportData {
  return {
    version: CURRENT_EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    metadata: {
      appName: APP_NAME,
      appVersion: APP_VERSION,
      materialsCount: materials.length,
      recipesCount: recipes.length,
    },
    data: {
      materials,
      recipes,
    },
  };
}

/**
 * 下載JSON檔案到使用者裝置
 * @param data 匯出資料
 * @param filename 檔案名稱（選填）
 */
export function downloadJsonFile(data: ExportData, filename?: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename || `recipe-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 驗證匯入資料結構
 * @param data 待驗證的資料
 * @returns 是否為有效的匯出資料
 */
export function validateImportData(data: unknown): data is ExportData {
  // Step 1: 檢查是否為物件
  if (!data || typeof data !== 'object') return false;

  // Step 2: 使用 Record<string, unknown> 型別斷言
  const obj = data as Record<string, unknown>;

  // Step 3: 驗證頂層必要欄位
  if (typeof obj.version !== 'number') return false;
  if (typeof obj.exportDate !== 'string') return false;

  // Step 4: 驗證 metadata 物件
  if (!obj.metadata || typeof obj.metadata !== 'object') return false;
  const metadata = obj.metadata as Record<string, unknown>;
  if (typeof metadata.appName !== 'string') return false;
  if (typeof metadata.appVersion !== 'string') return false;
  if (typeof metadata.materialsCount !== 'number') return false;
  if (typeof metadata.recipesCount !== 'number') return false;

  // Step 5: 驗證 data 物件存在且為物件
  if (!obj.data || typeof obj.data !== 'object') return false;

  // Step 6: 安全地收窄 data 型別
  const dataObj = obj.data as Record<string, unknown>;

  // Step 7: 驗證 materials 陣列存在且為陣列
  if (!Array.isArray(dataObj.materials)) return false;

  // Step 8: 驗證 recipes 陣列存在且為陣列
  if (!Array.isArray(dataObj.recipes)) return false;

  // Step 9: 驗證每個材料的結構
  for (const material of dataObj.materials) {
    if (!validateMaterialStructure(material)) return false;
  }

  // Step 10: 驗證每個配方的結構
  for (const recipe of dataObj.recipes) {
    if (!validateRecipeStructure(recipe)) return false;
  }

  return true;
}

/**
 * 匯入資料並處理衝突
 * @param importedData 匯入的資料
 * @param existingMaterials 現有材料
 * @param existingRecipes 現有配方
 * @param options 匯入選項
 * @returns 匯入結果
 */
export function importData(
  importedData: ExportData,
  existingMaterials: Material[],
  existingRecipes: Recipe[],
  options: ImportOptions
): ImportResult {
  const result: ImportResult = {
    success: false,
    materialsImported: 0,
    recipesImported: 0,
    skipped: 0,
    errors: [],
  };

  try {
    let finalMaterials = [...existingMaterials];
    let finalRecipes = [...existingRecipes];

    // 匯入材料
    if (options.includeMaterials) {
      if (options.mode === 'replace') {
        finalMaterials = importedData.data.materials;
        result.materialsImported = finalMaterials.length;
      } else {
        // 合併模式
        for (const importedMaterial of importedData.data.materials) {
          const existingIndex = finalMaterials.findIndex(
            m => m.id === importedMaterial.id
          );

          if (existingIndex >= 0) {
            // 衝突處理
            if (options.handleConflicts === 'overwrite') {
              finalMaterials[existingIndex] = importedMaterial;
              result.materialsImported++;
            } else if (options.handleConflicts === 'rename') {
              const newMaterial = {
                ...importedMaterial,
                id: crypto.randomUUID(),
                name: `${importedMaterial.name} (匯入)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              finalMaterials.push(newMaterial);
              result.materialsImported++;
            } else {
              result.skipped++;
            }
          } else {
            finalMaterials.push(importedMaterial);
            result.materialsImported++;
          }
        }
      }
    }

    // 匯入配方
    if (options.includeRecipes) {
      if (options.mode === 'replace') {
        // 在取代模式下，仍需檢查參照完整性
        const orphaned = findOrphanedReferences(
          importedData.data.recipes,
          finalMaterials
        );
        if (orphaned.length > 0) {
          result.errors.push(
            `匯入的配方中有 ${orphaned.length} 個配方引用了不存在的材料`
          );
          return result;
        }
        finalRecipes = importedData.data.recipes;
        result.recipesImported = finalRecipes.length;
      } else {
        // 合併模式
        for (const importedRecipe of importedData.data.recipes) {
          // 驗證所有材料參照是否存在
          const missingMaterials = importedRecipe.ingredients.filter(
            ing => !finalMaterials.some(m => m.id === ing.materialId)
          );

          if (missingMaterials.length > 0) {
            result.errors.push(
              `配方 "${importedRecipe.name}" 引用了不存在的材料，已跳過`
            );
            result.skipped++;
            continue;
          }

          const existingIndex = finalRecipes.findIndex(
            r => r.id === importedRecipe.id
          );

          if (existingIndex >= 0) {
            // 衝突處理
            if (options.handleConflicts === 'overwrite') {
              finalRecipes[existingIndex] = importedRecipe;
              result.recipesImported++;
            } else if (options.handleConflicts === 'rename') {
              const newRecipe = {
                ...importedRecipe,
                id: crypto.randomUUID(),
                name: `${importedRecipe.name} (匯入)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              finalRecipes.push(newRecipe);
              result.recipesImported++;
            } else {
              result.skipped++;
            }
          } else {
            finalRecipes.push(importedRecipe);
            result.recipesImported++;
          }
        }
      }
    }

    result.success = true;
    result.materials = finalMaterials;
    result.recipes = finalRecipes;
    return result;
  } catch (error) {
    result.errors.push(`匯入失敗: ${(error as Error).message}`);
    return result;
  }
}
