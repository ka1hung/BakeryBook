import React, { useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRecipes } from '../../contexts/RecipeContext';
import { useMaterials } from '../../contexts/MaterialContext';
import type { Recipe, RecipeFormData } from '../../types/recipe';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import RecipeDetailModal from './components/RecipeDetailModal';
import { showConfirmDialog } from '../../components/common/ConfirmDialog';

const { Title } = Typography;

const RecipesPage: React.FC = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, copyRecipe } = useRecipes();
  const { materials } = useMaterials();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

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

  return (
    <div>
      {/* 頁面標題和操作按鈕 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Title level={2} style={{ color: '#5B9BD5', margin: 0 }}>
          配方管理
        </Title>

        <Space>
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
    </div>
  );
};

export default RecipesPage;
