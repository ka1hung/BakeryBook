/**
 * 表單驗證工具函數
 * 提供常用的驗證規則
 */

import type { Rule } from 'antd/es/form';

// 必填驗證
export const requiredRule: Rule = {
  required: true,
  message: '此欄位為必填',
};

// 材料名稱驗證
export const materialNameRules: Rule[] = [
  requiredRule,
  {
    min: 1,
    max: 50,
    message: '材料名稱長度應在 1-50 字元之間',
  },
];

// 價錢驗證
export const priceRules: Rule[] = [
  requiredRule,
  {
    type: 'number',
    min: 0.01,
    message: '價錢必須大於 0',
  },
];

// 重量驗證
export const weightRules: Rule[] = [
  requiredRule,
  {
    type: 'number',
    min: 0.01,
    message: '重量必須大於 0',
  },
];

// 單位驗證
export const unitRules: Rule[] = [requiredRule];

// 配方名稱驗證
export const recipeNameRules: Rule[] = [
  requiredRule,
  {
    min: 1,
    max: 100,
    message: '配方名稱長度應在 1-100 字元之間',
  },
];

// 份數驗證
export const servingsRules: Rule[] = [
  {
    type: 'number',
    min: 1,
    message: '份數必須至少為 1',
  },
];

// 營養成分驗證（選填，但如果有值則必須大於等於 0）
export const nutritionRules: Rule[] = [
  {
    type: 'number',
    min: 0,
    message: '營養成分值必須大於或等於 0',
  },
];
