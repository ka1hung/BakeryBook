import React, { useState, useMemo } from 'react';
import { Typography, Button, Space, message, Upload } from 'antd';
import { PlusOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRecipes } from '../../contexts/RecipeContext';
import { useMaterials } from '../../contexts/MaterialContext';
import type { Recipe, RecipeFormData, RecipeCalculation } from '../../types/recipe';
import type { Unit } from '../../types/material';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import RecipeDetailModal from './components/RecipeDetailModal';
import ImportPreviewModal from '../../components/common/ImportPreviewModal';
import { showConfirmDialog } from '../../components/common/ConfirmDialog';
import { calculateRecipe } from '../../utils/calculations';
import { exportRecipesToXlsx } from '../../utils/xlsxExport';
import {
  parseRecipeXlsx,
  groupRecipeRows,
  downloadRecipeTemplate,
  type ParsedRecipe,
} from '../../utils/xlsxImport';

const { Title } = Typography;

const RecipesPage: React.FC = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, copyRecipe, setRecipes } = useRecipes();
  const { materials } = useMaterials();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  // XLSX 匯入相關狀態
  const [importPreviewOpen, setImportPreviewOpen] = useState(false);
  const [parsedRecipes, setParsedRecipes] = useState<ParsedRecipe[]>([]);
  const [conflictStrategy, setConflictStrategy] = useState<'skip' | 'overwrite' | 'rename'>('skip');

  // 偵測重複
  const hasDuplicates = useMemo(
    () => parsedRecipes.some(pr => recipes.some(r => r.name === pr.name)),
    [parsedRecipes, recipes]
  );

  // 開啟新增表單
  const handleAdd = () => {
    setFormMode('add');
    setEditingRecipe(undefined);
    setFormOpen(true);
  };

  // 開啟編輯表單
  const handleEdit = (recipe: Recipe) => {
    setFormMode('edit');
    setEditingRecipe(recipe);
    setFormOpen(true);
  };

  // 處理表單提交
  const handleFormSubmit = (values: RecipeFormData) => {
    if (formMode === 'add') {
      addRecipe(values);
    } else if (formMode === 'edit' && editingRecipe) {
      updateRecipe(editingRecipe.id, values);
    }
    setFormOpen(false);
  };

  // 處理刪除
  const handleDelete = (id: string) => {
    showConfirmDialog({
      title: '確認刪除',
      content: '確定要刪除這個配方嗎？此操作無法復原。',
      onOk: () => deleteRecipe(id),
    });
  };

  // 處理複製
  const handleCopy = (id: string) => {
    copyRecipe(id);
  };

  // 處理查看詳情
  const handleView = (recipe: Recipe) => {
    setViewingRecipe(recipe);
    setDetailModalOpen(true);
  };

  // 批次刪除
  const handleBatchDelete = (ids: string[]) => {
    showConfirmDialog({
      title: '批次刪除確認',
      content: `確定要刪除選取的 ${ids.length} 個配方嗎？此操作無法復原。`,
      onOk: () => {
        const idSet = new Set(ids);
        setRecipes(prev => prev.filter(r => !idSet.has(r.id)));
        message.success(`已刪除 ${ids.length} 個配方`);
      },
    });
  };

  // 批次匯出
  const handleBatchExport = (selectedRecipes: Recipe[]) => {
    const calculations = new Map<string, RecipeCalculation>();
    selectedRecipes.forEach(recipe => {
      calculations.set(
        recipe.id,
        calculateRecipe(
          recipe.ingredients,
          materials,
          recipe.servings,
          recipe.fuelCost || 0,
          recipe.laborCost || 0
        )
      );
    });

    exportRecipesToXlsx(selectedRecipes, materials, calculations);
    message.success(`已匯出 ${selectedRecipes.length} 個配方`);
  };

  // XLSX 匯入 - 上傳檔案
  const handleImportFile = async (file: File) => {
    try {
      const rows = await parseRecipeXlsx(file);
      if (rows.length === 0) {
        message.warning('檔案中沒有可匯入的資料');
        return;
      }
      const grouped = groupRecipeRows(rows, materials);
      setParsedRecipes(grouped);
      setConflictStrategy('skip');
      setImportPreviewOpen(true);
    } catch {
      message.error('無法解析檔案，請確認檔案格式是否正確');
    }
  };

  // XLSX 匯入 - 確認
  const handleImportConfirm = () => {
    const validRecipes = parsedRecipes.filter(r => r.isValid);
    const now = new Date().toISOString();
    const existingNames = new Set(recipes.map(r => r.name));
    const newRecipes: Recipe[] = [];

    for (const parsed of validRecipes) {
      const isDuplicate = existingNames.has(parsed.name);

      if (isDuplicate && conflictStrategy === 'skip') continue;

      const recipe: Recipe = {
        id: crypto.randomUUID(),
        name: isDuplicate && conflictStrategy === 'rename'
          ? `${parsed.name} (匯入)`
          : parsed.name,
        description: parsed.description,
        servings: parsed.servings,
        fuelCost: parsed.fuelCost,
        laborCost: parsed.laborCost,
        ingredients: parsed.ingredients.map(ing => {
          const material = materials.find(m => m.name === ing.materialName);
          return {
            materialId: material!.id,
            weight: ing.weight,
            unit: ing.unit as Unit,
          };
        }),
        createdAt: now,
        updatedAt: now,
      };

      newRecipes.push(recipe);
    }

    if (conflictStrategy === 'overwrite') {
      const importNames = new Set(validRecipes.map(r => r.name));
      setRecipes(prev => [
        ...prev.filter(r => !importNames.has(r.name)),
        ...newRecipes,
      ]);
    } else {
      setRecipes(prev => [...prev, ...newRecipes]);
    }

    message.success(`成功匯入 ${newRecipes.length} 個配方`);
    setImportPreviewOpen(false);
    setParsedRecipes([]);
  };

  return (
    <div>
      {/* 頁面標題和操作按鈕 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <Title level={2} style={{ color: '#5B9BD5', margin: 0 }}>
          配方管理
        </Title>

        <Space wrap>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadRecipeTemplate()}
          >
            下載範本
          </Button>
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImportFile(file as unknown as File);
              return false;
            }}
          >
            <Button icon={<ImportOutlined />}>
              匯入 XLSX
            </Button>
          </Upload>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
            新增配方
          </Button>
        </Space>
      </div>

      {/* 配方列表 */}
      <RecipeList
        recipes={recipes}
        materials={materials}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onView={handleView}
        onBatchDelete={handleBatchDelete}
        onBatchExport={handleBatchExport}
      />

      {/* 配方表單 Modal */}
      <RecipeForm
        open={formOpen}
        mode={formMode}
        initialValues={editingRecipe}
        materials={materials}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      />

      {/* 配方詳情 Modal */}
      <RecipeDetailModal
        open={detailModalOpen}
        recipe={viewingRecipe}
        materials={materials}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* XLSX 匯入預覽 Modal */}
      <ImportPreviewModal
        open={importPreviewOpen}
        onCancel={() => {
          setImportPreviewOpen(false);
          setParsedRecipes([]);
        }}
        onConfirm={handleImportConfirm}
        title="匯入配方預覽"
        parsedRecipes={parsedRecipes}
        hasDuplicates={hasDuplicates}
        conflictStrategy={conflictStrategy}
        onConflictStrategyChange={setConflictStrategy}
      />
    </div>
  );
};

export default RecipesPage;
