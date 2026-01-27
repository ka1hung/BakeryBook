import type { Material } from '../types/material';
import type { Recipe } from '../types/recipe';

/**
 * 找出使用指定材料的所有配方
 * @param materialId 材料ID
 * @param recipes 配方陣列
 * @returns 使用該材料的配方陣列
 */
export function findMaterialUsage(
  materialId: string,
  recipes: Recipe[]
): Recipe[] {
  return recipes.filter(recipe =>
    recipe.ingredients.some(ing => ing.materialId === materialId)
  );
}

/**
 * 取得使用指定材料的配方數量
 * @param materialId 材料ID
 * @param recipes 配方陣列
 * @returns 使用該材料的配方數量
 */
export function getMaterialUsageCount(
  materialId: string,
  recipes: Recipe[]
): number {
  return findMaterialUsage(materialId, recipes).length;
}

/**
 * 孤立參照資訊
 */
export interface OrphanedReference {
  recipeId: string;
  recipeName: string;
  missingMaterials: string[];
}

/**
 * 找出所有包含孤立材料參照的配方
 * @param recipes 配方陣列
 * @param materials 材料陣列
 * @returns 包含孤立參照的配方資訊
 */
export function findOrphanedReferences(
  recipes: Recipe[],
  materials: Material[]
): OrphanedReference[] {
  const materialIds = new Set(materials.map(m => m.id));
  const orphaned: OrphanedReference[] = [];

  recipes.forEach(recipe => {
    const missingMaterials = recipe.ingredients
      .filter(ing => !materialIds.has(ing.materialId))
      .map(ing => ing.materialId);

    if (missingMaterials.length > 0) {
      orphaned.push({
        recipeId: recipe.id,
        recipeName: recipe.name,
        missingMaterials,
      });
    }
  });

  return orphaned;
}

/**
 * 清理配方中的孤立材料參照
 * @param recipes 配方陣列
 * @param materials 材料陣列
 * @returns 清理後的配方陣列
 */
export function cleanOrphanedReferences(
  recipes: Recipe[],
  materials: Material[]
): Recipe[] {
  const materialIds = new Set(materials.map(m => m.id));

  return recipes.map(recipe => ({
    ...recipe,
    ingredients: recipe.ingredients.filter(ing => materialIds.has(ing.materialId)),
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * 替換配方中的材料ID
 * @param recipes 配方陣列
 * @param oldMaterialId 舊材料ID
 * @param newMaterialId 新材料ID
 * @returns 更新後的配方陣列
 */
export function replaceMaterialInRecipes(
  recipes: Recipe[],
  oldMaterialId: string,
  newMaterialId: string
): Recipe[] {
  return recipes.map(recipe => {
    const hasOldMaterial = recipe.ingredients.some(
      ing => ing.materialId === oldMaterialId
    );

    if (!hasOldMaterial) {
      return recipe;
    }

    return {
      ...recipe,
      ingredients: recipe.ingredients.map(ing =>
        ing.materialId === oldMaterialId
          ? { ...ing, materialId: newMaterialId }
          : ing
      ),
      updatedAt: new Date().toISOString(),
    };
  });
}
