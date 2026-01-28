import React, { useMemo } from 'react';
import { Modal, Typography, Divider, List, Tag } from 'antd';
import type { Recipe } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import RecipeCalculationDisplay from './RecipeCalculation';
import NutritionLabel from './NutritionLabel';
import { useRecipeCalculator } from '../hooks/useRecipeCalculator';
import { convertToBaseUnit } from '../../../utils/calculations';

const { Title, Text, Paragraph } = Typography;

interface RecipeDetailModalProps {
  open: boolean;
  recipe: Recipe | null;
  materials: Material[];
  onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  open,
  recipe,
  materials,
  onClose,
}) => {
  if (!recipe) return null;

  const calculation = useRecipeCalculator(
    recipe.ingredients,
    materials,
    recipe.servings,
    recipe.fuelCost || 0,
    recipe.laborCost || 0
  );

  // 計算配方總重量（克）
  const totalWeight = useMemo(() => {
    return recipe.ingredients.reduce((total, ingredient) => {
      return total + convertToBaseUnit(ingredient.weight, ingredient.unit);
    }, 0);
  }, [recipe.ingredients]);

  // 檢查是否有營養資料
  const hasNutritionData = useMemo(() => {
    const { totalNutrition } = calculation;
    return totalNutrition.calories > 0 || totalNutrition.protein > 0 || totalNutrition.fat > 0;
  }, [calculation]);

  const unitDisplay = {
    g: '克',
    kg: '公斤',
    ml: '毫升',
    l: '公升',
  };

  // 取得材料資訊的輔助函數
  const getMaterialInfo = (materialId: string) => {
    return materials.find((m) => m.id === materialId);
  };

  return (
    <Modal
      title={recipe.name}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {/* 配方描述 */}
      {recipe.description && (
        <>
          <Paragraph style={{ color: '#5D4037', fontSize: '15px' }}>
            {recipe.description}
          </Paragraph>
          <Divider />
        </>
      )}

      {/* 基本資訊 */}
      {recipe.servings && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary">預計製作份數：</Text>
            <Tag color="green" style={{ marginLeft: '8px', fontSize: '14px' }}>
              {recipe.servings} 份
            </Tag>
          </div>
          <Divider />
        </>
      )}

      {/* 材料列表 */}
      <Title level={5} style={{ color: '#8B4513' }}>
        材料列表
      </Title>
      <List
        dataSource={recipe.ingredients}
        renderItem={(ingredient) => {
          const material = getMaterialInfo(ingredient.materialId);
          return (
            <List.Item>
              <List.Item.Meta
                title={material?.name || '未知材料'}
                description={
                  <Text>
                    {ingredient.weight} {unitDisplay[ingredient.unit]}
                  </Text>
                }
              />
            </List.Item>
          );
        }}
        style={{ marginBottom: '24px' }}
      />

      <Divider />

      {/* 計算結果 */}
      <Title level={5} style={{ color: '#8B4513', marginBottom: '16px' }}>
        計算結果
      </Title>
      <RecipeCalculationDisplay calculation={calculation} />

      {/* 台灣食品營養標示 */}
      {hasNutritionData && (
        <>
          <Divider />
          <Title level={5} style={{ color: '#8B4513', marginBottom: '16px' }}>
            營養標示下載
          </Title>
          <NutritionLabel
            nutrition={calculation.totalNutrition}
            recipeName={recipe.name}
            servings={recipe.servings || 1}
            totalWeight={totalWeight}
          />
        </>
      )}
    </Modal>
  );
};

export default RecipeDetailModal;
