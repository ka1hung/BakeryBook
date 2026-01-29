import type { Material } from '../types/material';

// ---- 型別定義 ----

export interface ParsedMaterialRow {
  rowIndex: number;
  name: string;
  price: number;
  weight: number;
  unit: string;
  description?: string;
  nutrition?: Record<string, number>;
  errors: string[];
  isValid: boolean;
}

export interface ParsedRecipeRow {
  rowIndex: number;
  recipeName: string;
  description?: string;
  servings?: number;
  fuelCost?: number;
  laborCost?: number;
  materialName: string;
  ingredientWeight: number;
  ingredientUnit: string;
  errors: string[];
  isValid: boolean;
}

export interface ParsedRecipe {
  name: string;
  description?: string;
  servings?: number;
  fuelCost?: number;
  laborCost?: number;
  ingredients: { materialName: string; weight: number; unit: string }[];
  errors: string[];
  isValid: boolean;
}

const VALID_UNITS = ['g', 'kg', 'ml', 'l'];

const NUTRITION_COLUMN_MAP: Record<string, string> = {
  '熱量 (大卡)': 'calories',
  '蛋白質 (g)': 'protein',
  '脂肪 (g)': 'fat',
  '飽和脂肪 (g)': 'saturatedFat',
  '反式脂肪 (g)': 'transFat',
  '碳水化合物 (g)': 'carbohydrates',
  '糖 (g)': 'sugar',
  '鈉 (mg)': 'sodium',
  '膳食纖維 (g)': 'fiber',
  '膽固醇 (mg)': 'cholesterol',
};

// ---- 範本下載 ----

export async function downloadMaterialTemplate(): Promise<void> {
  const XLSX = await import('xlsx');

  const templateData = [
    {
      '名稱': '(範例) 高筋麵粉',
      '價錢': 45,
      '重量': 1000,
      '單位': 'g',
      '說明': '蛋白質含量較高的麵粉',
      '熱量 (大卡)': 364,
      '蛋白質 (g)': 12.7,
      '脂肪 (g)': 1.3,
      '飽和脂肪 (g)': 0.2,
      '反式脂肪 (g)': 0,
      '碳水化合物 (g)': 72.5,
      '糖 (g)': 0.3,
      '鈉 (mg)': 2,
      '膳食纖維 (g)': 2.7,
      '膽固醇 (mg)': 0,
    },
    {
      '名稱': '(範例) 無鹽奶油',
      '價錢': 120,
      '重量': 500,
      '單位': 'g',
      '說明': '',
      '熱量 (大卡)': 717,
      '蛋白質 (g)': 0.85,
      '脂肪 (g)': 81,
      '飽和脂肪 (g)': 51,
      '反式脂肪 (g)': 3.3,
      '碳水化合物 (g)': 0.06,
      '糖 (g)': 0.06,
      '鈉 (mg)': 11,
      '膳食纖維 (g)': 0,
      '膽固醇 (mg)': 215,
    },
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '材料');

  ws['!cols'] = [
    { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 6 }, { wch: 30 },
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
    { wch: 14 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
  ];

  XLSX.writeFile(wb, '材料匯入範本.xlsx');
}

export async function downloadRecipeTemplate(): Promise<void> {
  const XLSX = await import('xlsx');

  const templateData = [
    {
      '配方名稱': '(範例) 基礎吐司',
      '描述': '經典白吐司配方',
      '份數': 2,
      '燃料費': 15,
      '人工費': 50,
      '材料名稱': '高筋麵粉',
      '用量': 500,
      '用量單位': 'g',
    },
    {
      '配方名稱': '(範例) 基礎吐司',
      '描述': '',
      '份數': '',
      '燃料費': '',
      '人工費': '',
      '材料名稱': '無鹽奶油',
      '用量': 30,
      '用量單位': 'g',
    },
    {
      '配方名稱': '(範例) 巧克力蛋糕',
      '描述': '濃郁巧克力蛋糕',
      '份數': 8,
      '燃料費': 20,
      '人工費': 80,
      '材料名稱': '高筋麵粉',
      '用量': 200,
      '用量單位': 'g',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '配方');

  ws['!cols'] = [
    { wch: 18 }, { wch: 30 }, { wch: 8 }, { wch: 10 }, { wch: 10 },
    { wch: 18 }, { wch: 10 }, { wch: 10 },
  ];

  XLSX.writeFile(wb, '配方匯入範本.xlsx');
}

// ---- 解析 ----

export async function parseMaterialXlsx(file: File): Promise<ParsedMaterialRow[]> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { raw: true });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

  const parsed: ParsedMaterialRow[] = [];

  rows.forEach((row, index) => {
    const errors: string[] = [];

    // 名稱
    const name = String(row['名稱'] ?? '').trim();
    if (!name) errors.push('名稱為必填');

    // 價錢
    const priceRaw = row['價錢'];
    const price = Number(priceRaw);
    if (priceRaw === undefined || priceRaw === '' || isNaN(price) || price < 0) {
      errors.push('價錢必須為大於等於 0 的數字');
    }

    // 重量
    const weightRaw = row['重量'];
    const weight = Number(weightRaw);
    if (weightRaw === undefined || weightRaw === '' || isNaN(weight) || weight <= 0) {
      errors.push('重量必須為大於 0 的數字');
    }

    // 單位
    const unit = String(row['單位'] ?? '').trim().toLowerCase();
    if (!VALID_UNITS.includes(unit)) {
      errors.push(`單位必須為 ${VALID_UNITS.join('、')} 其中之一`);
    }

    // 說明
    const description = row['說明'] ? String(row['說明']).trim() : undefined;

    // 營養成分
    const nutrition: Record<string, number> = {};
    let hasNutrition = false;
    for (const [colName, fieldKey] of Object.entries(NUTRITION_COLUMN_MAP)) {
      const val = row[colName];
      if (val !== undefined && val !== '' && val !== null) {
        const num = Number(val);
        if (isNaN(num) || num < 0) {
          errors.push(`${colName} 必須為大於等於 0 的數字`);
        } else {
          nutrition[fieldKey] = num;
          hasNutrition = true;
        }
      }
    }

    parsed.push({
      rowIndex: index + 2, // Excel 第 2 列開始（第 1 列為標題）
      name,
      price: isNaN(price) ? 0 : price,
      weight: isNaN(weight) ? 0 : weight,
      unit,
      description,
      nutrition: hasNutrition ? nutrition : undefined,
      errors,
      isValid: errors.length === 0,
    });
  });

  return parsed;
}

export async function parseRecipeXlsx(file: File): Promise<ParsedRecipeRow[]> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { raw: true });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

  const parsed: ParsedRecipeRow[] = [];

  rows.forEach((row, index) => {
    const errors: string[] = [];

    const recipeName = String(row['配方名稱'] ?? '').trim();
    if (!recipeName) errors.push('配方名稱為必填');

    const description = row['描述'] ? String(row['描述']).trim() : undefined;

    let servings: number | undefined;
    if (row['份數'] !== undefined && row['份數'] !== '' && row['份數'] !== null) {
      servings = Number(row['份數']);
      if (isNaN(servings) || servings < 1 || !Number.isInteger(servings)) {
        errors.push('份數必須為大於等於 1 的整數');
        servings = undefined;
      }
    }

    let fuelCost: number | undefined;
    if (row['燃料費'] !== undefined && row['燃料費'] !== '' && row['燃料費'] !== null) {
      fuelCost = Number(row['燃料費']);
      if (isNaN(fuelCost) || fuelCost < 0) {
        errors.push('燃料費必須為大於等於 0 的數字');
        fuelCost = undefined;
      }
    }

    let laborCost: number | undefined;
    if (row['人工費'] !== undefined && row['人工費'] !== '' && row['人工費'] !== null) {
      laborCost = Number(row['人工費']);
      if (isNaN(laborCost) || laborCost < 0) {
        errors.push('人工費必須為大於等於 0 的數字');
        laborCost = undefined;
      }
    }

    const materialName = String(row['材料名稱'] ?? '').trim();
    if (!materialName) errors.push('材料名稱為必填');

    const weightRaw = row['用量'];
    const ingredientWeight = Number(weightRaw);
    if (weightRaw === undefined || weightRaw === '' || isNaN(ingredientWeight) || ingredientWeight <= 0) {
      errors.push('用量必須為大於 0 的數字');
    }

    const ingredientUnit = String(row['用量單位'] ?? '').trim().toLowerCase();
    if (!VALID_UNITS.includes(ingredientUnit)) {
      errors.push(`用量單位必須為 ${VALID_UNITS.join('、')} 其中之一`);
    }

    parsed.push({
      rowIndex: index + 2,
      recipeName,
      description,
      servings,
      fuelCost,
      laborCost,
      materialName,
      ingredientWeight: isNaN(ingredientWeight) ? 0 : ingredientWeight,
      ingredientUnit,
      errors,
      isValid: errors.length === 0,
    });
  });

  return parsed;
}

export function groupRecipeRows(
  rows: ParsedRecipeRow[],
  materials: Material[]
): ParsedRecipe[] {
  const groups = new Map<string, ParsedRecipeRow[]>();

  // 按配方名稱分組
  for (const row of rows) {
    if (!row.recipeName) continue;
    const existing = groups.get(row.recipeName) || [];
    existing.push(row);
    groups.set(row.recipeName, existing);
  }

  const recipes: ParsedRecipe[] = [];

  for (const [name, groupRows] of groups) {
    const firstRow = groupRows[0];
    const errors: string[] = [];
    const ingredients: { materialName: string; weight: number; unit: string }[] = [];

    for (const row of groupRows) {
      // 合併列級錯誤
      errors.push(...row.errors);

      if (row.materialName) {
        // 驗證材料名稱是否存在
        const material = materials.find(m => m.name === row.materialName);
        if (!material) {
          errors.push(`找不到材料「${row.materialName}」，請先新增此材料`);
        }

        if (row.isValid || row.errors.every(e => !e.includes('材料名稱') && !e.includes('用量'))) {
          ingredients.push({
            materialName: row.materialName,
            weight: row.ingredientWeight,
            unit: row.ingredientUnit,
          });
        }
      }
    }

    const uniqueErrors = [...new Set(errors)];

    recipes.push({
      name,
      description: firstRow.description,
      servings: firstRow.servings,
      fuelCost: firstRow.fuelCost,
      laborCost: firstRow.laborCost,
      ingredients,
      errors: uniqueErrors,
      isValid: uniqueErrors.length === 0 && ingredients.length > 0,
    });
  }

  return recipes;
}
