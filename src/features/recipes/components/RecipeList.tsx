import React, { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Empty, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Recipe } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import RecipeCard from './RecipeCard';

const { Search } = Input;

interface RecipeListProps {
  recipes: Recipe[];
  materials: Material[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onView: (recipe: Recipe) => void;
}

type SortOption = 'name' | 'cost' | 'createdAt';

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  materials,
  onEdit,
  onDelete,
  onCopy,
  onView,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');

  // 搜尋和排序
  const filteredAndSortedRecipes = useMemo(() => {
    let result = [...recipes];

    // 搜尋
    if (searchText) {
      result = result.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh-TW');
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [recipes, searchText, sortBy]);

  return (
    <div>
      {/* 搜尋和篩選工具列 */}
      <Space style={{ width: '100%', marginBottom: '24px' }} direction="vertical" size={12}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Search
            placeholder="搜尋配方名稱"
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}
          />

          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: '150px' }}
            options={[
              { label: '最新建立', value: 'createdAt' },
              { label: '名稱排序', value: 'name' },
            ]}
          />
        </div>

        <div style={{ color: '#666', fontSize: '14px' }}>
          共 {filteredAndSortedRecipes.length} 個配方
        </div>
      </Space>

      {/* 配方卡片列表 */}
      {filteredAndSortedRecipes.length === 0 ? (
        <Empty
          description={searchText ? '找不到符合的配方' : '尚無配方，請新增第一個配方'}
          style={{ marginTop: '60px' }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredAndSortedRecipes.map((recipe) => (
            <Col key={recipe.id} xs={24} sm={12} lg={8}>
              <RecipeCard
                recipe={recipe}
                materials={materials}
                onEdit={onEdit}
                onDelete={onDelete}
                onCopy={onCopy}
                onView={onView}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RecipeList;
