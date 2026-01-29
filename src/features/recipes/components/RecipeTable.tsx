import React, { useMemo } from 'react';
import { Table, Button, Space, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { Recipe } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import type { RecipeCalculation } from '../../../types/recipe';
import { formatCurrency, calculateRecipe } from '../../../utils/calculations';

const { Text } = Typography;

interface RecipeTableProps {
  recipes: Recipe[];
  materials: Material[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onView: (recipe: Recipe) => void;
  rowSelection?: TableProps<Recipe>['rowSelection'];
}

const RecipeTable: React.FC<RecipeTableProps> = ({
  recipes,
  materials,
  onEdit,
  onDelete,
  onCopy,
  onView,
  rowSelection,
}) => {
  const recipeCalculations = useMemo(() => {
    const map = new Map<string, RecipeCalculation>();
    recipes.forEach(recipe => {
      map.set(
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
    return map;
  }, [recipes, materials]);

  const columns: ColumnsType<Recipe> = [
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name, 'zh-TW'),
      render: (name: string) => (
        <Text strong style={{ color: '#3E2723' }}>{name}</Text>
      ),
    },
    {
      title: '總成本',
      key: 'totalCost',
      sorter: (a, b) =>
        (recipeCalculations.get(a.id)?.totalCost ?? 0) -
        (recipeCalculations.get(b.id)?.totalCost ?? 0),
      render: (_: unknown, record: Recipe) => (
        <Text style={{ color: '#8B4513', fontWeight: 600 }}>
          {formatCurrency(recipeCalculations.get(record.id)?.totalCost ?? 0)}
        </Text>
      ),
      width: 140,
    },
    {
      title: '每份成本',
      key: 'costPerServing',
      sorter: (a, b) =>
        (recipeCalculations.get(a.id)?.costPerServing ?? 0) -
        (recipeCalculations.get(b.id)?.costPerServing ?? 0),
      render: (_: unknown, record: Recipe) => {
        const cost = recipeCalculations.get(record.id)?.costPerServing;
        return cost ? (
          <Text style={{ color: '#6B8E23', fontWeight: 600 }}>
            {formatCurrency(cost)}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
      width: 140,
    },
    {
      title: '材料數',
      key: 'ingredientCount',
      sorter: (a, b) => a.ingredients.length - b.ingredients.length,
      render: (_: unknown, record: Recipe) => record.ingredients.length,
      width: 80,
    },
    {
      title: '份數',
      dataIndex: 'servings',
      key: 'servings',
      sorter: (a, b) => (a.servings ?? 0) - (b.servings ?? 0),
      render: (servings: number | undefined) =>
        servings ? `${servings} 份` : <Text type="secondary">-</Text>,
      width: 80,
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: Recipe) => (
        <Space size={4}>
          <Tooltip title="查看詳情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="編輯">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="複製">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => onCopy(record.id)}
            />
          </Tooltip>
          <Tooltip title="刪除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table<Recipe>
      columns={columns}
      dataSource={recipes}
      rowKey="id"
      rowSelection={rowSelection}
      scroll={{ x: 800 }}
      pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 個配方` }}
      size="middle"
      style={{ background: '#FFFAF0', borderRadius: '12px' }}
    />
  );
};

export default RecipeTable;
