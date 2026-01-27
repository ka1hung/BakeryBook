// 單位類型
export type Unit = 'g' | 'kg' | 'ml' | 'l';

// 營養成分介面
export interface Nutrition {
  calories?: number;      // 熱量（卡路里）
  protein?: number;       // 蛋白質（克）
  fat?: number;           // 脂肪（克）
  carbohydrates?: number; // 碳水化合物（克）
  [key: string]: number | undefined; // 允許自定義欄位
}

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
