import React from 'react';
import { Modal, Table, Tag, Alert, Radio, Space, Typography, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ParsedMaterialRow, ParsedRecipe } from '../../utils/xlsxImport';

const { Text } = Typography;

type ConflictStrategy = 'skip' | 'overwrite' | 'rename';

interface ImportPreviewModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  materialRows?: ParsedMaterialRow[];
  parsedRecipes?: ParsedRecipe[];
  hasDuplicates: boolean;
  conflictStrategy: ConflictStrategy;
  onConflictStrategyChange: (strategy: ConflictStrategy) => void;
}

const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  open,
  onCancel,
  onConfirm,
  title,
  materialRows,
  parsedRecipes,
  hasDuplicates,
  conflictStrategy,
  onConflictStrategyChange,
}) => {
  // 材料預覽表格
  const materialColumns = [
    {
      title: '列',
      dataIndex: 'rowIndex',
      key: 'rowIndex',
      width: 60,
    },
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: '價錢',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: '重量',
      key: 'weight',
      width: 100,
      render: (_: unknown, row: ParsedMaterialRow) => `${row.weight} ${row.unit}`,
    },
    {
      title: '狀態',
      key: 'status',
      width: 120,
      render: (_: unknown, row: ParsedMaterialRow) =>
        row.isValid ? (
          <Tag icon={<CheckCircleOutlined />} color="success">有效</Tag>
        ) : (
          <Tooltip title={row.errors.join('；')}>
            <Tag icon={<CloseCircleOutlined />} color="error">有錯誤</Tag>
          </Tooltip>
        ),
    },
  ];

  // 配方預覽表格
  const recipeColumns = [
    {
      title: '配方名稱',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: '材料數',
      key: 'ingredientCount',
      width: 80,
      render: (_: unknown, row: ParsedRecipe) => row.ingredients.length,
    },
    {
      title: '份數',
      dataIndex: 'servings',
      key: 'servings',
      width: 80,
      render: (v: number | undefined) => v ?? '-',
    },
    {
      title: '狀態',
      key: 'status',
      width: 120,
      render: (_: unknown, row: ParsedRecipe) =>
        row.isValid ? (
          <Tag icon={<CheckCircleOutlined />} color="success">有效</Tag>
        ) : (
          <Tooltip title={row.errors.join('；')}>
            <Tag icon={<CloseCircleOutlined />} color="error">有錯誤</Tag>
          </Tooltip>
        ),
    },
  ];

  const isMaterial = !!materialRows;
  const data = isMaterial ? materialRows : parsedRecipes;
  const totalCount = data?.length ?? 0;
  const validCount = data?.filter((r: ParsedMaterialRow | ParsedRecipe) => r.isValid).length ?? 0;
  const errorCount = totalCount - validCount;
  const hasValidItems = validCount > 0;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      title={title}
      width={800}
      okText={`確認匯入 (${validCount} 筆)`}
      cancelText="取消"
      okButtonProps={{ disabled: !hasValidItems }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* 摘要 */}
        <Alert
          type={errorCount > 0 ? 'warning' : 'success'}
          message={
            <span>
              共解析 <Text strong>{totalCount}</Text> 筆資料，
              <Text strong style={{ color: '#6B8E23' }}>{validCount}</Text> 筆有效
              {errorCount > 0 && (
                <>，<Text strong style={{ color: '#CD5C5C' }}>{errorCount}</Text> 筆有錯誤（將被跳過）</>
              )}
            </span>
          }
        />

        {/* 衝突處理 */}
        {hasDuplicates && (
          <div
            style={{
              padding: '12px 16px',
              background: '#FFF8EE',
              borderRadius: 8,
              border: '1px solid #FAEBD7',
            }}
          >
            <Text strong style={{ display: 'block', marginBottom: 8, color: '#3E2723' }}>
              偵測到重複名稱，衝突處理方式：
            </Text>
            <Radio.Group
              value={conflictStrategy}
              onChange={(e) => onConflictStrategyChange(e.target.value)}
            >
              <Space direction="vertical">
                <Radio value="skip">跳過重複項目</Radio>
                <Radio value="overwrite">覆蓋現有項目</Radio>
                <Radio value="rename">重新命名（加上「(匯入)」後綴）</Radio>
              </Space>
            </Radio.Group>
          </div>
        )}

        {/* 資料預覽表格 */}
        {isMaterial ? (
          <Table
            columns={materialColumns}
            dataSource={materialRows}
            rowKey="rowIndex"
            size="small"
            pagination={{ pageSize: 10 }}
            scroll={{ y: 300 }}
            rowClassName={(record: ParsedMaterialRow) => record.isValid ? '' : 'import-row-error'}
          />
        ) : (
          <Table
            columns={recipeColumns}
            dataSource={parsedRecipes}
            rowKey="name"
            size="small"
            pagination={{ pageSize: 10 }}
            scroll={{ y: 300 }}
            rowClassName={(record: ParsedRecipe) => record.isValid ? '' : 'import-row-error'}
          />
        )}
      </Space>
    </Modal>
  );
};

export default ImportPreviewModal;
