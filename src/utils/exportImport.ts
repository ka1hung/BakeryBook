import type { Material } from '../types/material';
import type { Recipe } from '../types/recipe';
import type { ExportData, ImportOptions, ImportResult } from '../types/export';
import { findOrphanedReferences } from './referentialIntegrity';

const APP_NAME = 'Recipe Database';
const APP_VERSION = '0.2.0';
const CURRENT_EXPORT_VERSION = 1;

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
  if (!data || typeof data !== 'object') return false;

  const exportData = data as Partial<ExportData>;

  // 檢查必要欄位
  if (!exportData.version || !exportData.data) return false;
  if (
    !Array.isArray(exportData.data.materials) ||
    !Array.isArray(exportData.data.recipes)
  ) {
    return false;
  }

  // 驗證材料結構
  for (const material of exportData.data.materials) {
    if (
      !material.id ||
      !material.name ||
      material.price === undefined ||
      material.weight === undefined ||
      !material.unit
    ) {
      return false;
    }
  }

  // 驗證配方結構
  for (const recipe of exportData.data.recipes) {
    if (!recipe.id || !recipe.name || !Array.isArray(recipe.ingredients)) {
      return false;
    }
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
