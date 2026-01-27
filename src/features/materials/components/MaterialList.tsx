import React, { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Empty, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Material } from '../../../types/material';
import MaterialCard from './MaterialCard';

const { Search } = Input;

interface MaterialListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

type SortOption = 'name' | 'price' | 'createdAt';

const MaterialList: React.FC<MaterialListProps> = ({ materials, onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');

  // 搜尋和排序
  const filteredAndSortedMaterials = useMemo(() => {
    let result = [...materials];

    // 搜尋
    if (searchText) {
      result = result.filter((material) =>
        material.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh-TW');
        case 'price':
          return b.price - a.price; // 價格由高到低
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 最新的在前
      }
    });

    return result;
  }, [materials, searchText, sortBy]);

  return (
    <div>
      {/* 搜尋和篩選工具列 */}
      <Space style={{ width: '100%', marginBottom: '24px' }} direction="vertical" size={12}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Search
            placeholder="搜尋材料名稱"
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
              { label: '價格排序', value: 'price' },
            ]}
          />
        </div>

        <div style={{ color: '#666', fontSize: '14px' }}>
          共 {filteredAndSortedMaterials.length} 個材料
        </div>
      </Space>

      {/* 材料卡片列表 */}
      {filteredAndSortedMaterials.length === 0 ? (
        <Empty
          description={searchText ? '找不到符合的材料' : '尚無材料，請新增第一個材料'}
          style={{ marginTop: '60px' }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredAndSortedMaterials.map((material) => (
            <Col key={material.id} xs={24} sm={12} lg={8} xl={6}>
              <MaterialCard material={material} onEdit={onEdit} onDelete={onDelete} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MaterialList;
