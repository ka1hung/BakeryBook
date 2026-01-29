import type { Material } from '../types/material';
import type { Recipe, RecipeCalculation } from '../types/recipe';

export async function exportMaterialsToXlsx(materials: Material[]): Promise<void> {
  const XLSX = await import('xlsx');

  const data = materials.map(m => ({
    '名稱': m.name,
    '價錢 (NT$)': m.price,
    '重量': m.weight,
    '單位': m.unit,
    '說明': m.description || '',
    '熱量 (大卡)': m.nutrition?.calories ?? '',
    '蛋白質 (g)': m.nutrition?.protein ?? '',
    '脂肪 (g)': m.nutrition?.fat ?? '',
    '飽和脂肪 (g)': m.nutrition?.saturatedFat ?? '',
    '反式脂肪 (g)': m.nutrition?.transFat ?? '',
    '碳水化合物 (g)': m.nutrition?.carbohydrates ?? '',
    '糖 (g)': m.nutrition?.sugar ?? '',
    '鈉 (mg)': m.nutrition?.sodium ?? '',
    '膳食纖維 (g)': m.nutrition?.fiber ?? '',
    '膽固醇 (mg)': m.nutrition?.cholesterol ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '材料');

  // 設定欄寬
  ws['!cols'] = [
    { wch: 18 }, // 名稱
    { wch: 12 }, // 價錢
    { wch: 10 }, // 重量
    { wch: 6 },  // 單位
    { wch: 30 }, // 說明
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
    { wch: 14 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
  ];

  XLSX.writeFile(wb, `材料匯出_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export async function exportRecipesToXlsx(
  recipes: Recipe[],
  materials: Material[],
  calculations: Map<string, RecipeCalculation>
): Promise<void> {
  const XLSX = await import('xlsx');

  const data: Record<string, unknown>[] = [];

  for (const recipe of recipes) {
    const calc = calculations.get(recipe.id);
    if (recipe.ingredients.length === 0) {
      data.push({
        '配方名稱': recipe.name,
        '描述': recipe.description || '',
        '份數': recipe.servings ?? '',
        '燃料費 (NT$)': recipe.fuelCost ?? '',
        '人工費 (NT$)': recipe.laborCost ?? '',
        '總成本 (NT$)': calc?.totalCost ?? '',
        '每份成本 (NT$)': calc?.costPerServing ?? '',
        '材料名稱': '',
        '用量': '',
        '用量單位': '',
      });
    } else {
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ing = recipe.ingredients[i];
        const mat = materials.find(m => m.id === ing.materialId);
        data.push({
          '配方名稱': recipe.name,
          '描述': i === 0 ? (recipe.description || '') : '',
          '份數': i === 0 ? (recipe.servings ?? '') : '',
          '燃料費 (NT$)': i === 0 ? (recipe.fuelCost ?? '') : '',
          '人工費 (NT$)': i === 0 ? (recipe.laborCost ?? '') : '',
          '總成本 (NT$)': i === 0 ? (calc?.totalCost ?? '') : '',
          '每份成本 (NT$)': i === 0 ? (calc?.costPerServing ?? '') : '',
          '材料名稱': mat?.name || '(未知材料)',
          '用量': ing.weight,
          '用量單位': ing.unit,
        });
      }
    }
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '配方');

  ws['!cols'] = [
    { wch: 18 }, { wch: 30 }, { wch: 8 }, { wch: 12 }, { wch: 12 },
    { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 10 }, { wch: 10 },
  ];

  XLSX.writeFile(wb, `配方匯出_${new Date().toISOString().split('T')[0]}.xlsx`);
}
