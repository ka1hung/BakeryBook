import React, { useState } from 'react';
import { Form, InputNumber, Row, Col, Typography, Collapse, Space } from 'antd';
import { FireOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { NUTRITION_FIELDS } from '../../../types/material';
import { nutritionRules } from '../../../utils/validators';

const { Text } = Typography;
const { Panel } = Collapse;

const NutritionForm: React.FC = () => {
  const [showExtended, setShowExtended] = useState(false);

  const coreFields = NUTRITION_FIELDS.filter(f => f.category === 'core');
  const extendedFields = NUTRITION_FIELDS.filter(f => f.category === 'extended');

  const renderFieldGroup = (fields: typeof NUTRITION_FIELDS) => (
    <Row gutter={[16, 8]}>
      {fields.map(field => (
        <Col xs={24} sm={12} md={8} key={field.key}>
          <Form.Item
            label={field.label}
            name={['nutrition', field.key]}
            rules={nutritionRules}
          >
            <InputNumber
              placeholder={field.unit}
              style={{ width: '100%' }}
              min={0}
              precision={2}
              addonAfter={field.unit}
            />
          </Form.Item>
        </Col>
      ))}
    </Row>
  );

  return (
    <div>
      <Space style={{ marginBottom: '12px' }}>
        <FireOutlined style={{ color: '#FFB74D', fontSize: '16px' }} />
        <Text strong style={{ fontSize: '15px', color: '#5B9BD5' }}>
          營養成分（依台灣食品標示規範）
        </Text>
      </Space>

      {/* 核心營養素 */}
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
          核心營養素
        </Text>
        {renderFieldGroup(coreFields)}
      </div>

      {/* 額外營養素 - 可摺疊 */}
      <Collapse
        ghost
        activeKey={showExtended ? ['extended'] : []}
        onChange={() => setShowExtended(!showExtended)}
        style={{ backgroundColor: 'transparent' }}
      >
        <Panel
          header={
            <Space>
              {showExtended ? <MinusOutlined /> : <PlusOutlined />}
              <Text type="secondary" style={{ fontSize: '13px' }}>
                額外營養素（選填）
              </Text>
            </Space>
          }
          key="extended"
          showArrow={false}
        >
          {renderFieldGroup(extendedFields)}
        </Panel>
      </Collapse>
    </div>
  );
};

export default NutritionForm;
