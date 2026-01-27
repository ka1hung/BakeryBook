# 配方資料庫 Recipe Database

一個清新自然風格（淺藍色系）的配方管理系統，幫助您管理材料和配方。

## 功能特色

### 材料管理
- ✅ 新增、編輯、刪除材料
- ✅ 記錄材料價格、重量和單位
- ✅ 支援營養成分記錄（熱量、蛋白質、脂肪、碳水化合物）
- ✅ 材料搜尋和排序功能
- ✅ 卡片式視覺呈現

### 配方管理
- ✅ 建立配方，選擇多種材料
- ✅ 自動計算總成本和每份成本
- ✅ 自動計算營養成分（依重量比例）
- ✅ 配方詳情查看
- ✅ 配方複製功能
- ✅ 配方搜尋和排序

### 技術特點
- ✅ React 18 + TypeScript
- ✅ Ant Design 5.x UI 組件庫
- ✅ Tailwind CSS 樣式
- ✅ LocalStorage 本地儲存
- ✅ Context API 狀態管理
- ✅ 響應式設計（支援手機、平板、桌面）

## 技術架構

```
前端框架: React 18 + TypeScript
UI 框架: Ant Design 5.x
樣式: Tailwind CSS
狀態管理: React Context API
資料儲存: LocalStorage
建置工具: Vite
圖示: Ant Design Icons + Lucide React
```

## 開始使用

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 http://localhost:5173/ 啟動

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
rrh/
├── public/
├── src/
│   ├── components/           # 共用組件
│   │   ├── Layout/          # 版面配置
│   │   │   ├── MainLayout.tsx
│   │   │   └── Navigation.tsx
│   │   └── common/          # 通用組件
│   │       └── ConfirmDialog.tsx
│   ├── features/            # 功能模組
│   │   ├── materials/       # 材料管理模組
│   │   │   ├── components/
│   │   │   │   ├── MaterialForm.tsx
│   │   │   │   ├── MaterialCard.tsx
│   │   │   │   ├── MaterialList.tsx
│   │   │   │   └── NutritionForm.tsx
│   │   │   └── MaterialsPage.tsx
│   │   └── recipes/         # 配方管理模組
│   │       ├── components/
│   │       │   ├── RecipeForm.tsx
│   │       │   ├── RecipeCard.tsx
│   │       │   ├── RecipeList.tsx
│   │       │   ├── RecipeDetailModal.tsx
│   │       │   ├── IngredientSelector.tsx
│   │       │   └── RecipeCalculation.tsx
│   │       ├── hooks/
│   │       │   └── useRecipeCalculator.ts
│   │       └── RecipesPage.tsx
│   ├── contexts/            # Context API
│   │   ├── MaterialContext.tsx
│   │   └── RecipeContext.tsx
│   ├── hooks/               # 共用 Hooks
│   │   └── useLocalStorage.ts
│   ├── types/               # TypeScript 類型定義
│   │   ├── material.ts
│   │   └── recipe.ts
│   ├── utils/               # 工具函數
│   │   ├── calculations.ts  # 計算邏輯
│   │   ├── storage.ts       # LocalStorage 操作
│   │   └── validators.ts    # 表單驗證
│   ├── styles/              # 全域樣式
│   │   └── theme.ts         # Ant Design 主題配置
│   ├── pages/               # 頁面組件
│   │   └── HomePage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 使用指南

### 1. 新增材料

1. 點擊左側選單的「材料管理」
2. 點擊右上角「新增材料」按鈕
3. 填寫材料資訊：
   - 材料名稱（必填）
   - 價錢（必填）
   - 重量和單位（必填）
   - 材料說明（選填）
   - 營養成分（選填）
4. 點擊「確定」儲存

### 2. 建立配方

1. 點擊左側選單的「配方管理」
2. 點擊右上角「新增配方」按鈕
3. 在「基本資訊」分頁填寫配方名稱、描述和份數
4. 切換到「材料配比」分頁
5. 點擊「新增材料」選擇材料並輸入使用重量
6. 可以新增多個材料
7. 切換到「計算結果」分頁查看成本和營養成分
8. 點擊「確定」儲存配方

### 3. 查看配方詳情

1. 在配方列表中點擊配方卡片上的「詳情」按鈕
2. 查看完整的配方資訊和計算結果

### 4. 複製配方

1. 在配方列表中點擊配方卡片上的「複製」按鈕
2. 系統會自動建立一個配方副本

## 配色方案（淺藍色系）

- Primary: #5B9BD5（天空藍）
- Background: #F0F8FF（淺藍白）
- Success: #81C784（淺綠）
- Warning: #FFB74D（淺橙）
- Error: #EF9A9A（淺紅）

## 資料儲存

所有資料儲存在瀏覽器的 LocalStorage 中，無需網路連線即可使用。

**注意事項：**
- LocalStorage 容量限制約 5-10MB
- 清除瀏覽器資料會刪除所有儲存的材料和配方
- 建議定期備份重要資料

## 未來擴展功能

- [ ] 匯出配方為 PDF
- [ ] 配方分享功能
- [ ] 材料庫存管理
- [ ] 成本趨勢圖表
- [ ] 配方分類標籤系統
- [ ] 後端 API 整合
- [ ] 多用戶支援
- [ ] 圖片上傳功能

## 開發團隊

由 Claude Sonnet 4.5 協助開發

## 授權

MIT License
