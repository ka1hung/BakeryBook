import { useMemo } from 'react';
import type { RecipeIngredient, RecipeCalculation } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import { calculateRecipe } from '../../../utils/calculations';

/**
 * useRecipeCalculator Hook
 * 計算配方的成本和營養成分
 */
export const useRecipeCalculator = (
  ingredients: RecipeIngredient[],
  materials: Material[],
  servings?: number,
  fuelCost: number = 0,
  laborCost: number = 0
): RecipeCalculation => {
  return useMemo(() => {
    return calculateRecipe(ingredients, materials, servings, fuelCost, laborCost);
  }, [ingredients, materials, servings, fuelCost, laborCost]);
};
