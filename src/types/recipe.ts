import type { Unit } from './material';

// 配方材料項目
export interface RecipeIngredient {
  materialId: string;   // 材料 ID
  weight: number;       // 使用重量
  unit: Unit;           // 單位
}

// 配方介面
export interface Recipe {
  id: string;                     // UUID
  name: string;                   // 配方名稱（必填）
  description?: string;           // 配方描述（選填）
  servings?: number;              // 預計製作份數（選填）
  ingredients: RecipeIngredient[]; // 材料列表
  fuelCost?: number;              // 燃料費/電費 (NT$)（選填）
  laborCost?: number;             // 人工費用 (NT$)（選填）
  createdAt: string;              // ISO 日期字串
  updatedAt: string;              // ISO 日期字串
}

// 營養成分總計（符合台灣食藥署標示規範）
export interface NutritionTotal {
  calories: number;
  protein: number;
  fat: number;
  saturatedFat: number;
  transFat: number;
  carbohydrates: number;
  sugar: number;
  sodium: number;
  fiber: number;
  cholesterol: number;
}

// 配方計算結果
export interface RecipeCalculation {
  materialCost: number;           // 材料成本
  fuelCost: number;               // 燃料費/電費
  laborCost: number;              // 人工費用
  totalCost: number;              // 總成本 = materialCost + fuelCost + laborCost
  costPerServing?: number;        // 每份成本
  totalNutrition: NutritionTotal; // 總營養成分
  nutritionPerServing?: NutritionTotal; // 每份營養成分
}

// 配方表單資料類型（用於新增/編輯）
export type RecipeFormData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
