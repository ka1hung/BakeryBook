import React from 'react';
import { Table, Button, Space, Tag, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { Material } from '../../../types/material';
import { formatCurrency, convertToBaseUnit } from '../../../utils/calculations';

const { Text } = Typography;

const unitDisplay: Record<string, string> = {
  g: '克',
  kg: '公斤',
  ml: '毫升',
  l: '公升',
};

interface MaterialTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  rowSelection?: TableProps<Material>['rowSelection'];
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  materials,
  onEdit,
  onDelete,
  rowSelection,
}) => {
  const columns: ColumnsType<Material> = [
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
      title: '價錢',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => (
        <Text style={{ color: '#8B4513', fontWeight: 600 }}>
          {formatCurrency(price)}
        </Text>
      ),
      width: 140,
    },
    {
      title: '重量',
      key: 'weight',
      sorter: (a, b) =>
        convertToBaseUnit(a.weight, a.unit) - convertToBaseUnit(b.weight, b.unit),
      render: (_: unknown, record: Material) => (
        <Text>{record.weight} {unitDisplay[record.unit]}</Text>
      ),
      width: 120,
    },
    {
      title: '營養',
      key: 'nutrition',
      width: 100,
      filters: [
        { text: '含營養成分', value: true },
        { text: '無營養成分', value: false },
      ],
      onFilter: (value, record) => {
        const has = !!(record.nutrition && Object.keys(record.nutrition).length > 0);
        return has === value;
      },
      render: (_: unknown, record: Material) => {
        const has = record.nutrition && Object.keys(record.nutrition).length > 0;
        return has ? (
          <Tag icon={<FireOutlined />} color="orange">含營養</Tag>
        ) : null;
      },
    },
    {
      title: '說明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: { showTitle: true },
      render: (desc: string) => desc || '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_: unknown, record: Material) => (
        <Space size={4}>
          <Tooltip title="編輯">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
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
    <Table<Material>
      columns={columns}
      dataSource={materials}
      rowKey="id"
      rowSelection={rowSelection}
      scroll={{ x: 800 }}
      pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 個材料` }}
      size="middle"
      style={{ background: '#FFFAF0', borderRadius: '12px' }}
    />
  );
};

export default MaterialTable;
