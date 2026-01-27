import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, List, message } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useMaterials } from '../../contexts/MaterialContext';
import { useRecipes } from '../../contexts/RecipeContext';
import { findOrphanedReferences, cleanOrphanedReferences, type OrphanedReference } from '../../utils/referentialIntegrity';

const DataHealthCheck: React.FC = () => {
  const { materials } = useMaterials();
  const { recipes, updateRecipe } = useRecipes();
  const [orphanedRefs, setOrphanedRefs] = useState<OrphanedReference[]>([]);

  useEffect(() => {
    // 啟動時檢查孤立參照
    const orphaned = findOrphanedReferences(recipes, materials);
    setOrphanedRefs(orphaned);
  }, [recipes, materials]);

  const handleCleanup = () => {
    Modal.confirm({
      title: '清理孤立資料',
      icon: <WarningOutlined />,
      content: (
        <div>
          <p>將從 {orphanedRefs.length} 個配方中移除失效的材料引用。</p>
          <p>此操作會修改以下配方：</p>
          <List
            size="small"
            dataSource={orphanedRefs}
            renderItem={item => <List.Item>{item.recipeName}</List.Item>}
            style={{ marginTop: '8px', maxHeight: '200px', overflow: 'auto' }}
          />
        </div>
      ),
      okText: '清理',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        const cleanedRecipes = cleanOrphanedReferences(recipes, materials);

        // 更新所有受影響的配方
        cleanedRecipes.forEach(recipe => {
          const original = recipes.find(r => r.id === recipe.id);
          if (original && original.ingredients.length !== recipe.ingredients.length) {
            updateRecipe(recipe.id, {
              name: recipe.name,
              description: recipe.description,
              servings: recipe.servings,
              ingredients: recipe.ingredients,
            });
          }
        });

        message.success('已清理孤立資料');
        setOrphanedRefs([]);
      },
    });
  };

  if (orphanedRefs.length === 0) {
    return null;
  }

  return (
    <Alert
      message="發現資料完整性問題"
      description={
        <div>
          <p>{orphanedRefs.length} 個配方引用了不存在的材料。</p>
          <List
            size="small"
            dataSource={orphanedRefs.slice(0, 5)}
            renderItem={item => (
              <List.Item>
                <span>{item.recipeName}</span>
                <span style={{ color: '#999', marginLeft: '8px' }}>
                  ({item.missingMaterials.length} 個失效材料)
                </span>
              </List.Item>
            )}
            style={{ marginTop: '8px' }}
          />
          {orphanedRefs.length > 5 && (
            <p style={{ marginTop: '8px', color: '#999' }}>
              ...還有 {orphanedRefs.length - 5} 個配方
            </p>
          )}
          <Button type="primary" danger onClick={handleCleanup} style={{ marginTop: '12px' }}>
            自動清理
          </Button>
        </div>
      }
      type="warning"
      showIcon
      closable
      style={{ marginBottom: '16px' }}
    />
  );
};

export default DataHealthCheck;
