import React, { useState } from 'react';
import { Typography, Button, Space, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useMaterials } from '../../contexts/MaterialContext';
import { useRecipes } from '../../contexts/RecipeContext';
import type { Material, MaterialFormData } from '../../types/material';
import type { Recipe } from '../../types/recipe';
import MaterialForm from './components/MaterialForm';
import MaterialList from './components/MaterialList';
import MaterialSubstitution from './components/MaterialSubstitution';
import { showConfirmDialog } from '../../components/common/ConfirmDialog';
import { replaceMaterialInRecipes } from '../../utils/referentialIntegrity';

const { Title } = Typography;

const MaterialsPage: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial, getMaterialUsage } = useMaterials();
  const { recipes, updateRecipe } = useRecipes();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [substitutionOpen, setSubstitutionOpen] = useState(false);
  const [substitutingMaterial, setSubstitutingMaterial] = useState<Material | null>(null);
  const [substitutionTargetRecipes, setSubstitutionTargetRecipes] = useState<Recipe[]>([]);

  // 開啟新增表單
  const handleAdd = () => {
    setFormMode('add');
    setEditingMaterial(undefined);
    setFormOpen(true);
  };

  // 開啟編輯表單
  const handleEdit = (material: Material) => {
    setFormMode('edit');
    setEditingMaterial(material);
    setFormOpen(true);
  };

  // 處理表單提交
  const handleFormSubmit = (values: MaterialFormData) => {
    if (formMode === 'add') {
      addMaterial(values);
    } else if (formMode === 'edit' && editingMaterial) {
      updateMaterial(editingMaterial.id, values);
    }
    setFormOpen(false);
  };

  // 處理刪除
  const handleDelete = (id: string) => {
    const material = materials.find(m => m.id === id);
    if (!material) return;

    const usedInRecipes = getMaterialUsage(id, recipes);

    if (usedInRecipes.length > 0) {
      // 材料正在使用中，提供替換選項
      Modal.confirm({
        title: '材料正在使用中',
        content: (
          <div>
            <p>此材料正在以下 {usedInRecipes.length} 個配方中使用：</p>
            <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
              {usedInRecipes.map(recipe => (
                <li key={recipe.id}>{recipe.name}</li>
              ))}
            </ul>
          </div>
        ),
        okText: '替換材料',
        cancelText: '取消',
        onOk: () => {
          setSubstitutingMaterial(material);
          setSubstitutionTargetRecipes(usedInRecipes);
          setSubstitutionOpen(true);
        },
      });
      return;
    }

    // 材料未使用，直接刪除
    showConfirmDialog({
      title: '確認刪除',
      content: '確定要刪除這個材料嗎？此操作無法復原。',
      onOk: () => deleteMaterial(id, recipes),
    });
  };

  // 處理材料替換
  const handleSubstitution = (newMaterialId: string) => {
    if (!substitutingMaterial) return;

    // 替換所有配方中的材料
    const updatedRecipes = replaceMaterialInRecipes(
      recipes,
      substitutingMaterial.id,
      newMaterialId
    );

    // 更新所有受影響的配方
    updatedRecipes.forEach(recipe => {
      const original = recipes.find(r => r.id === recipe.id);
      if (original && JSON.stringify(original) !== JSON.stringify(recipe)) {
        updateRecipe(recipe.id, {
          name: recipe.name,
          description: recipe.description,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
        });
      }
    });

    // 現在可以安全刪除原材料
    deleteMaterial(substitutingMaterial.id, []);

    message.success(`已將 ${substitutionTargetRecipes.length} 個配方的材料替換完成`);
    setSubstitutionOpen(false);
    setSubstitutingMaterial(null);
    setSubstitutionTargetRecipes([]);
  };

  return (
    <div>
      {/* 頁面標題和操作按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#5B9BD5', margin: 0 }}>
          材料管理
        </Title>

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            新增材料
          </Button>
        </Space>
      </div>

      {/* 材料列表 */}
      <MaterialList
        materials={materials}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 材料表單 Modal */}
      <MaterialForm
        open={formOpen}
        mode={formMode}
        initialValues={editingMaterial}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      />

      {/* 材料替換 Modal */}
      <MaterialSubstitution
        open={substitutionOpen}
        sourceMaterial={substitutingMaterial}
        targetRecipes={substitutionTargetRecipes}
        allMaterials={materials}
        onConfirm={handleSubstitution}
        onCancel={() => {
          setSubstitutionOpen(false);
          setSubstitutingMaterial(null);
          setSubstitutionTargetRecipes([]);
        }}
      />
    </div>
  );
};

export default MaterialsPage;
