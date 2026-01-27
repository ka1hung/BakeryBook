import React from 'react';
import { Card, Typography, Tag, Space, Button, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { Recipe } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import { formatCurrency } from '../../../utils/calculations';
import { useRecipeCalculator } from '../hooks/useRecipeCalculator';

const { Text, Paragraph } = Typography;

interface RecipeCardProps {
  recipe: Recipe;
  materials: Material[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onView: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  materials,
  onEdit,
  onDelete,
  onCopy,
  onView,
}) => {
  const calculation = useRecipeCalculator(recipe.ingredients, materials, recipe.servings);

  return (
    <Card
      hoverable
      style={{
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(91, 155, 213, 0.08)',
        transition: 'all 0.3s ease',
      }}
      styles={{
        body: { padding: '20px' },
      }}
      actions={[
        <Tooltip title="查看詳情" key="view">
          <Button type="text" icon={<EyeOutlined />} onClick={() => onView(recipe)}>
            詳情
          </Button>
        </Tooltip>,
        <Tooltip title="編輯" key="edit">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(recipe)}>
            編輯
          </Button>
        </Tooltip>,
        <Tooltip title="複製" key="copy">
          <Button type="text" icon={<CopyOutlined />} onClick={() => onCopy(recipe.id)}>
            複製
          </Button>
        </Tooltip>,
        <Tooltip title="刪除" key="delete">
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(recipe.id)}>
            刪除
          </Button>
        </Tooltip>,
      ]}
    >
      {/* 配方名稱 */}
      <Text strong style={{ fontSize: '18px', color: '#333' }}>
        {recipe.name}
      </Text>

      {/* 總成本 */}
      <div style={{ marginTop: '12px' }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div>
            <Text type="secondary">總成本：</Text>
            <Text strong style={{ color: '#5B9BD5', fontSize: '20px' }}>
              {formatCurrency(calculation.totalCost)}
            </Text>
          </div>
          {calculation.costPerServing && (
            <div>
              <Text type="secondary">每份成本：</Text>
              <Text strong style={{ color: '#81C784', fontSize: '16px' }}>
                {formatCurrency(calculation.costPerServing)}
              </Text>
            </div>
          )}
        </Space>
      </div>

      {/* 配方描述 */}
      {recipe.description && (
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ marginTop: '12px', marginBottom: '8px', color: '#666' }}
        >
          {recipe.description}
        </Paragraph>
      )}

      {/* 標籤 */}
      <div style={{ marginTop: '12px' }}>
        <Space size={[8, 8]} wrap>
          <Tag icon={<ShoppingOutlined />} color="blue">
            {recipe.ingredients.length} 種材料
          </Tag>
          {recipe.servings && (
            <Tag color="green">
              {recipe.servings} 份
            </Tag>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default RecipeCard;
