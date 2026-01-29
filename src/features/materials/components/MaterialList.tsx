import React, { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Empty, Space, Segmented, Checkbox } from 'antd';
import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { Material } from '../../../types/material';
import MaterialCard from './MaterialCard';
import MaterialTable from './MaterialTable';
import BatchActionBar from '../../../components/common/BatchActionBar';
import { useViewMode } from '../../../hooks/useViewMode';
import { useSelection } from '../../../hooks/useSelection';
import { STORAGE_KEYS } from '../../../utils/storage';
import type { ViewMode } from '../../../hooks/useViewMode';

const { Search } = Input;

interface MaterialListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
  onBatchExport: (materials: Material[]) => void;
}

type SortOption = 'name' | 'price' | 'createdAt';

const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  onEdit,
  onDelete,
  onBatchDelete,
  onBatchExport,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [viewMode, setViewMode] = useViewMode(STORAGE_KEYS.MATERIAL_VIEW_MODE);

  // 搜尋和排序
  const filteredAndSortedMaterials = useMemo(() => {
    let result = [...materials];

    // 搜尋
    if (searchText) {
      result = result.filter((material) =>
        material.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 排序（僅在卡片模式生效，表格有內建排序）
    if (viewMode === 'card') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name, 'zh-TW');
          case 'price':
            return b.price - a.price;
          case 'createdAt':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    }

    return result;
  }, [materials, searchText, sortBy, viewMode]);

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
  } = useSelection(filteredAndSortedMaterials);

  return (
    <div>
      {/* 搜尋和篩選工具列 */}
      <Space style={{ width: '100%', marginBottom: '24px' }} direction="vertical" size={12}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Search
            placeholder="搜尋材料名稱"
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
                { label: '價格排序', value: 'price' },
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
          共 {filteredAndSortedMaterials.length} 個材料
        </div>
      </Space>

      {/* 材料列表 */}
      {filteredAndSortedMaterials.length === 0 ? (
        <Empty
          description={searchText ? '找不到符合的材料' : '尚無材料，請新增第一個材料'}
          style={{ marginTop: '60px' }}
        />
      ) : viewMode === 'card' ? (
        <Row gutter={[24, 24]}>
          {filteredAndSortedMaterials.map((material) => (
            <Col key={material.id} xs={24} sm={12} lg={8} xl={6}>
              <div style={{ position: 'relative' }}>
                <Checkbox
                  checked={selectedIds.has(material.id)}
                  onChange={() => toggleItem(material.id)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 1,
                  }}
                />
                <MaterialCard material={material} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <MaterialTable
          materials={filteredAndSortedMaterials}
          onEdit={onEdit}
          onDelete={onDelete}
          rowSelection={{
            selectedRowKeys: Array.from(selectedIds),
            onChange: (keys) => setSelectedIds(new Set(keys as string[])),
          }}
        />
      )}

      {/* 批次操作列 */}
      <BatchActionBar
        selectedCount={selectedCount}
        totalCount={filteredAndSortedMaterials.length}
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

export default MaterialList;
