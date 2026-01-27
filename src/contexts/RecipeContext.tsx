import React, { createContext, useContext, useCallback } from 'react';
import { message } from 'antd';
import type { Recipe, RecipeFormData } from '../types/recipe';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';

// Context 介面
interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipeData: RecipeFormData) => void;
  updateRecipe: (id: string, recipeData: RecipeFormData) => void;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  copyRecipe: (id: string) => void;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

// 建立 Context
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Provider 組件
export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(STORAGE_KEYS.RECIPES, []);

  // 新增配方
  const addRecipe = useCallback(
    (recipeData: RecipeFormData) => {
      const newRecipe: Recipe = {
        ...recipeData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRecipes((prev) => [...prev, newRecipe]);
      message.success('配方新增成功');
    },
    [setRecipes]
  );

  // 更新配方
  const updateRecipe = useCallback(
    (id: string, recipeData: RecipeFormData) => {
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id
            ? {
                ...recipeData,
                id,
                createdAt: recipe.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : recipe
        )
      );
      message.success('配方更新成功');
    },
    [setRecipes]
  );

  // 刪除配方
  const deleteRecipe = useCallback(
    (id: string) => {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      message.success('配方已刪除');
    },
    [setRecipes]
  );

  // 根據 ID 獲取配方
  const getRecipeById = useCallback(
    (id: string) => {
      return recipes.find((recipe) => recipe.id === id);
    },
    [recipes]
  );

  // 複製配方
  const copyRecipe = useCallback(
    (id: string) => {
      const recipe = recipes.find((r) => r.id === id);
      if (!recipe) {
        message.error('找不到要複製的配方');
        return;
      }

      const copiedRecipe: Recipe = {
        ...recipe,
        id: crypto.randomUUID(),
        name: `${recipe.name} (副本)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRecipes((prev) => [...prev, copiedRecipe]);
      message.success('配方複製成功');
    },
    [recipes, setRecipes]
  );

  const value: RecipeContextType = {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    copyRecipe,
    setRecipes,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

// Hook for using Recipe Context
export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
