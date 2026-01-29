import React, { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Empty, Space, Segmented, Checkbox } from 'antd';
import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { Recipe } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import RecipeCard from './RecipeCard';
import RecipeTable from './RecipeTable';
import BatchActionBar from '../../../components/common/BatchActionBar';
import { useViewMode } from '../../../hooks/useViewMode';
import { useSelection } from '../../../hooks/useSelection';
import { STORAGE_KEYS } from '../../../utils/storage';
import type { ViewMode } from '../../../hooks/useViewMode';

const { Search } = Input;

interface RecipeListProps {
  recipes: Recipe[];
  materials: Material[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onView: (recipe: Recipe) => void;
  onBatchDelete: (ids: string[]) => void;
  onBatchExport: (recipes: Recipe[]) => void;
}

type SortOption = 'name' | 'createdAt';

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  materials,
  onEdit,
  onDelete,
  onCopy,
  onView,
  onBatchDelete,
  onBatchExport,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [viewMode, setViewMode] = useViewMode(STORAGE_KEYS.RECIPE_VIEW_MODE);

  // 搜尋和排序
  const filteredAndSortedRecipes = useMemo(() => {
    let result = [...recipes];

    // 搜尋
    if (searchText) {
      result = result.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 排序（僅在卡片模式生效，表格有內建排序）
    if (viewMode === 'card') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name, 'zh-TW');
          case 'createdAt':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    }

    return result;
  }, [recipes, searchText, sortBy, viewMode]);

  const {
    selectedIds,
    setSelectedIds,
    toggleItem,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedItems,
    selectedCount,
    hasSelection,
  } = useSelection(filteredAndSortedRecipes);

  return (
    <div>
      {/* 搜尋和篩選工具列 */}
      <Space style={{ width: '100%', marginBottom: '24px' }} direction="vertical" size={12}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Search
            placeholder="搜尋配方名稱"
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}
          />

          {viewMode === 'card' && (
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '150px' }}
              options={[
                { label: '最新建立', value: 'createdAt' },
                { label: '名稱排序', value: 'name' },
              ]}
            />
          )}

          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            options={[
              { label: '卡片', value: 'card', icon: <AppstoreOutlined /> },
              { label: '表格', value: 'table', icon: <UnorderedListOutlined /> },
            ]}
          />
        </div>

        <div style={{ color: '#666', fontSize: '14px' }}>
          共 {filteredAndSortedRecipes.length} 個配方
        </div>
      </Space>

      {/* 配方列表 */}
      {filteredAndSortedRecipes.length === 0 ? (
        <Empty
          description={searchText ? '找不到符合的配方' : '尚無配方，請新增第一個配方'}
          style={{ marginTop: '60px' }}
        />
      ) : viewMode === 'card' ? (
        <Row gutter={[24, 24]}>
          {filteredAndSortedRecipes.map((recipe) => (
            <Col key={recipe.id} xs={24} sm={12} lg={8}>
              <div style={{ position: 'relative' }}>
                <Checkbox
                  checked={selectedIds.has(recipe.id)}
                  onChange={() => toggleItem(recipe.id)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 1,
                  }}
                />
                <RecipeCard
                  recipe={recipe}
                  materials={materials}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onView={onView}
                />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <RecipeTable
          recipes={filteredAndSortedRecipes}
          materials={materials}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopy={onCopy}
          onView={onView}
          rowSelection={{
            selectedRowKeys: Array.from(selectedIds),
            onChange: (keys) => setSelectedIds(new Set(keys as string[])),
          }}
        />
      )}

      {/* 批次操作列 */}
      <BatchActionBar
        selectedCount={selectedCount}
        totalCount={filteredAndSortedRecipes.length}
        isAllSelected={isAllSelected}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBatchDelete={() => {
          onBatchDelete(Array.from(selectedIds));
          deselectAll();
        }}
        onBatchExport={() => {
          onBatchExport(selectedItems);
          deselectAll();
        }}
      />

      {/* 為 BatchActionBar 預留底部空間 */}
      {hasSelection && <div style={{ height: 80 }} />}
    </div>
  );
};

export default RecipeList;
