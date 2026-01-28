import React from 'react';
import { Card, Typography, Tag, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import type { Material } from '../../../types/material';
import { formatCurrency } from '../../../utils/calculations';

const { Text, Paragraph } = Typography;

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit, onDelete }) => {
  const unitDisplay = {
    g: '克',
    kg: '公斤',
    ml: '毫升',
    l: '公升',
  };

  const hasNutrition = material.nutrition && Object.keys(material.nutrition).length > 0;

  return (
    <Card
      hoverable
      style={{
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(139, 69, 19, 0.06)',
        border: '1px solid #FAEBD7',
        transition: 'all 0.3s ease',
      }}
      styles={{
        body: { padding: '20px' },
      }}
      actions={[
        <Tooltip title="編輯" key="edit">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(material)}
          >
            編輯
          </Button>
        </Tooltip>,
        <Tooltip title="刪除" key="delete">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(material.id)}
          >
            刪除
          </Button>
        </Tooltip>,
      ]}
    >
      {/* 材料名稱 */}
      <Text strong style={{ fontSize: '18px', color: '#3E2723' }}>
        {material.name}
      </Text>

      {/* 價錢和重量 */}
      <div style={{ marginTop: '12px' }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div>
            <Text type="secondary">價錢：</Text>
            <Text strong style={{ color: '#8B4513', fontSize: '16px' }}>
              {formatCurrency(material.price)}
            </Text>
          </div>
          <div>
            <Text type="secondary">重量：</Text>
            <Text strong style={{ color: '#5D4037' }}>
              {material.weight} {unitDisplay[material.unit]}
            </Text>
          </div>
        </Space>
      </div>

      {/* 材料說明 */}
      {material.description && (
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ marginTop: '12px', marginBottom: '8px', color: '#5D4037' }}
        >
          {material.description}
        </Paragraph>
      )}

      {/* 營養標籤 */}
      {hasNutrition && (
        <div style={{ marginTop: '12px' }}>
          <Tag icon={<FireOutlined />} color="orange">
            含營養成分
          </Tag>
        </div>
      )}
    </Card>
  );
};

export default MaterialCard;
