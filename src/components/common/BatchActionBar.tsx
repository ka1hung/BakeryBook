import React from 'react';
import { Button, Space, Typography } from 'antd';
import { DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchDelete: () => void;
  onBatchExport: () => void;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  onBatchDelete,
  onBatchExport,
}) => {
  const visible = selectedCount > 0;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: visible ? 0 : -80,
        left: 0,
        right: 0,
        height: 64,
        background: 'linear-gradient(135deg, #FFFAF0 0%, #FDF5E6 100%)',
        borderTop: '2px solid #DEB887',
        boxShadow: '0 -4px 16px rgba(139, 69, 19, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'bottom 0.3s ease',
        zIndex: 100,
      }}
    >
      <Space size={16}>
        <Text strong style={{ color: '#3E2723', fontSize: '14px' }}>
          已選擇 {selectedCount} / {totalCount} 個項目
        </Text>
        <Button
          type="link"
          size="small"
          onClick={isAllSelected ? onDeselectAll : onSelectAll}
          style={{ color: '#8B4513', padding: 0 }}
        >
          {isAllSelected ? '取消全選' : '全選'}
        </Button>
        <Button
          type="link"
          size="small"
          onClick={onDeselectAll}
          style={{ color: '#5D4037', padding: 0 }}
        >
          清除選取
        </Button>
      </Space>

      <Space size={12}>
        <Button
          icon={<FileExcelOutlined />}
          onClick={onBatchExport}
          style={{ borderColor: '#6B8E23', color: '#6B8E23' }}
        >
          匯出 XLSX
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={onBatchDelete}
        >
          批次刪除
        </Button>
      </Space>
    </div>
  );
};

export default BatchActionBar;
