import type { Material, Unit } from '../types/material';
import type { RecipeIngredient, NutritionTotal, RecipeCalculation } from '../types/recipe';

/**
 * 單位轉換：將所有重量轉換為基礎單位（g 或 ml）
 * g = 克（固體）, kg = 公斤
 * ml = 毫升（液體）, l = 公升
 */
export function convertToBaseUnit(weight: number, unit: Unit): number {
  switch (unit) {
    case 'kg':
      return weight * 1000; // kg to g
    case 'l':
      return weight * 1000; // l to ml
    case 'g':
    case 'ml':
    default:
      return weight;
  }
}

/**
 * 計算單個材料在配方中的成本
 * @param material - 材料資料
 * @param usedWeight - 配方中使用的重量
 * @param usedUnit - 配方中使用的單位
 * @returns 成本
 */
export function calculateIngredientCost(
  material: Material,
  usedWeight: number,
  usedUnit: Unit
): number {
  // 轉換為基礎單位
  const materialBaseWeight = convertToBaseUnit(material.weight, material.unit);
  const usedBaseWeight = convertToBaseUnit(usedWeight, usedUnit);

  // 計算單位成本（每克或每毫升的價錢）
  const unitCost = material.price / materialBaseWeight;

  // 計算總成本
  return unitCost * usedBaseWeight;
}

/**
 * 計算配方的總成本
 * @param ingredients - 配方材料列表
 * @param materials - 所有材料資料
 * @returns 總成本
 */
export function calculateTotalCost(
  ingredients: RecipeIngredient[],
  materials: Material[]
): number {
  return ingredients.reduce((total, ingredient) => {
    if (!ingredient) return total;
    const material = materials.find((m) => m.id === ingredient.materialId);
    if (!material) return total;

    const cost = calculateIngredientCost(material, ingredient.weight, ingredient.unit);
    return total + cost;
  }, 0);
}

/**
 * 計算單個材料在配方中的營養成分
 * @param material - 材料資料
 * @param usedWeight - 配方中使用的重量
 * @param usedUnit - 配方中使用的單位
 * @returns 營養成分
 */
export function calculateIngredientNutrition(
  material: Material,
  usedWeight: number,
  usedUnit: Unit
): NutritionTotal {
  const defaultNutrition: NutritionTotal = {
    calories: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0,
    cholesterol: 0,
  };

  if (!material.nutrition) {
    return defaultNutrition;
  }

  // 轉換為基礎單位
  const materialBaseWeight = convertToBaseUnit(material.weight, material.unit);
  const usedBaseWeight = convertToBaseUnit(usedWeight, usedUnit);

  // 計算比例
  const ratio = usedBaseWeight / materialBaseWeight;

  return {
    calories: (material.nutrition.calories || 0) * ratio,
    protein: (material.nutrition.protein || 0) * ratio,
    fat: (material.nutrition.fat || 0) * ratio,
    saturatedFat: (material.nutrition.saturatedFat || 0) * ratio,
    transFat: (material.nutrition.transFat || 0) * ratio,
    carbohydrates: (material.nutrition.carbohydrates || 0) * ratio,
    sugar: (material.nutrition.sugar || 0) * ratio,
    sodium: (material.nutrition.sodium || 0) * ratio,
    fiber: (material.nutrition.fiber || 0) * ratio,
    cholesterol: (material.nutrition.cholesterol || 0) * ratio,
  };
}

/**
 * 計算配方的總營養成分
 * @param ingredients - 配方材料列表
 * @param materials - 所有材料資料
 * @returns 總營養成分
 */
export function calculateTotalNutrition(
  ingredients: RecipeIngredient[],
  materials: Material[]
): NutritionTotal {
  return ingredients.reduce(
    (total, ingredient) => {
      if (!ingredient) return total;
      const material = materials.find((m) => m.id === ingredient.materialId);
      if (!material) return total;

      const nutrition = calculateIngredientNutrition(
        material,
        ingredient.weight,
        ingredient.unit
      );

      return {
        calories: total.calories + nutrition.calories,
        protein: total.protein + nutrition.protein,
        fat: total.fat + nutrition.fat,
        saturatedFat: total.saturatedFat + nutrition.saturatedFat,
        transFat: total.transFat + nutrition.transFat,
        carbohydrates: total.carbohydrates + nutrition.carbohydrates,
        sugar: total.sugar + nutrition.sugar,
        sodium: total.sodium + nutrition.sodium,
        fiber: total.fiber + nutrition.fiber,
        cholesterol: total.cholesterol + nutrition.cholesterol,
      };
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      saturatedFat: 0,
      transFat: 0,
      carbohydrates: 0,
      sugar: 0,
      sodium: 0,
      fiber: 0,
      cholesterol: 0,
    }
  );
}

/**
 * 計算每份營養成分
 * @param total - 總營養成分
 * @param servings - 份數
 * @returns 每份營養成分
 */
export function calculatePerServing(
  total: NutritionTotal,
  servings: number
): NutritionTotal {
  if (servings <= 0) {
    return total;
  }

  return {
    calories: total.calories / servings,
    protein: total.protein / servings,
    fat: total.fat / servings,
    saturatedFat: total.saturatedFat / servings,
    transFat: total.transFat / servings,
    carbohydrates: total.carbohydrates / servings,
    sugar: total.sugar / servings,
    sodium: total.sodium / servings,
    fiber: total.fiber / servings,
    cholesterol: total.cholesterol / servings,
  };
}

/**
 * 計算配方的完整計算結果
 * @param ingredients - 配方材料列表
 * @param materials - 所有材料資料
 * @param servings - 份數（選填）
 * @returns 計算結果
 */
export function calculateRecipe(
  ingredients: RecipeIngredient[],
  materials: Material[],
  servings?: number
): RecipeCalculation {
  const totalCost = calculateTotalCost(ingredients, materials);
  const totalNutrition = calculateTotalNutrition(ingredients, materials);

  const result: RecipeCalculation = {
    totalCost,
    totalNutrition,
  };

  if (servings && servings > 0) {
    result.costPerServing = totalCost / servings;
    result.nutritionPerServing = calculatePerServing(totalNutrition, servings);
  }

  return result;
}

/**
 * 格式化數值為小數點後兩位
 * @param value - 數值
 * @returns 格式化後的字串
 */
export function formatNumber(value: number): string {
  return value.toFixed(2);
}

/**
 * 格式化貨幣
 * @param value - 數值
 * @returns 格式化後的字串
 */
export function formatCurrency(value: number): string {
  return `NT$ ${formatNumber(value)}`;
}
