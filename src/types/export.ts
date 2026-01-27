import type { Material } from './material';
import type { Recipe } from './recipe';

/**
 * 匯出資料結構
 */
export interface ExportData {
  version: number;              // 結構版本號
  exportDate: string;           // 匯出時間 ISO 字串
  metadata: {
    appName: string;
    appVersion: string;
    materialsCount: number;
    recipesCount: number;
  };
  data: {
    materials: Material[];
    recipes: Recipe[];
  };
}

/**
 * 匯入選項
 */
export interface ImportOptions {
  mode: 'replace' | 'merge';                           // 匯入模式
  includeRecipes: boolean;                             // 是否匯入配方
  includeMaterials: boolean;                           // 是否匯入材料
  handleConflicts: 'skip' | 'overwrite' | 'rename';   // 衝突處理策略
}

/**
 * 匯入結果
 */
export interface ImportResult {
  success: boolean;
  materialsImported: number;
  recipesImported: number;
  skipped: number;
  errors: string[];
  materials?: Material[];
  recipes?: Recipe[];
}
