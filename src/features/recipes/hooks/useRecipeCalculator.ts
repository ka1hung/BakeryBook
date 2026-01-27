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
  servings?: number
): RecipeCalculation => {
  return useMemo(() => {
    return calculateRecipe(ingredients, materials, servings);
  }, [ingredients, materials, servings]);
};
