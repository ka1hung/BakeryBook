// 單位類型
export type Unit = 'g' | 'kg' | 'ml' | 'l';

// 營養成分介面（符合台灣食藥署標示規範）
export interface Nutrition {
  // 核心營養素
  calories?: number;          // 熱量（大卡）
  protein?: number;           // 蛋白質（克）
  fat?: number;               // 脂肪（克）
  saturatedFat?: number;      // 飽和脂肪（克）
  transFat?: number;          // 反式脂肪（克）
  carbohydrates?: number;     // 碳水化合物（克）
  sugar?: number;             // 糖（克）
  sodium?: number;            // 鈉（毫克）
  // 額外營養素
  fiber?: number;             // 膳食纖維（克）
  cholesterol?: number;       // 膽固醇（毫克）
  [key: string]: number | undefined; // 允許自定義欄位
}

// 營養欄位元資料
export interface NutritionFieldMeta {
  key: keyof Nutrition;
  label: string;
  unit: string;
  category: 'core' | 'extended';
  color: string;
}

// 營養欄位定義（用於動態渲染）
export const NUTRITION_FIELDS: NutritionFieldMeta[] = [
  { key: 'calories', label: '熱量', unit: '大卡', category: 'core', color: '#FFB74D' },
  { key: 'protein', label: '蛋白質', unit: 'g', category: 'core', color: '#81C784' },
  { key: 'fat', label: '脂肪', unit: 'g', category: 'core', color: '#EF9A9A' },
  { key: 'saturatedFat', label: '飽和脂肪', unit: 'g', category: 'core', color: '#E57373' },
  { key: 'transFat', label: '反式脂肪', unit: 'g', category: 'core', color: '#F44336' },
  { key: 'carbohydrates', label: '碳水化合物', unit: 'g', category: 'core', color: '#5B9BD5' },
  { key: 'sugar', label: '糖', unit: 'g', category: 'core', color: '#64B5F6' },
  { key: 'sodium', label: '鈉', unit: 'mg', category: 'core', color: '#FFD54F' },
  { key: 'fiber', label: '膳食纖維', unit: 'g', category: 'extended', color: '#AED581' },
  { key: 'cholesterol', label: '膽固醇', unit: 'mg', category: 'extended', color: '#FF8A65' },
];

// 材料介面
export interface Material {
  id: string;                // UUID
  name: string;              // 材料名稱（必填）
  price: number;             // 價錢（必填）
  weight: number;            // 重量數值（必填）
  unit: Unit;                // 單位（必填）
  description?: string;      // 材料說明（選填）
  nutrition?: Nutrition;     // 營養成分（選填）
  createdAt: string;         // ISO 日期字串
  updatedAt: string;         // ISO 日期字串
}

// 材料表單資料類型（用於新增/編輯）
export type MaterialFormData = Omit<Material, 'id' | 'createdAt' | 'updatedAt'>;
