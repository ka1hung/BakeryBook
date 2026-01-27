import React from 'react';
import { Form, InputNumber, Row, Col, Typography } from 'antd';
import { nutritionRules } from '../../../utils/validators';

const { Text } = Typography;

const NutritionForm: React.FC = () => {
  return (
    <div>
      <Text strong style={{ fontSize: '15px', color: '#5B9BD5' }}>
        營養成分（選填）
      </Text>
      <div style={{ marginTop: '12px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="熱量"
              name={['nutrition', 'calories']}
              rules={nutritionRules}
            >
              <InputNumber
                placeholder="卡路里"
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="蛋白質"
              name={['nutrition', 'protein']}
              rules={nutritionRules}
            >
              <InputNumber
                placeholder="克"
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="脂肪"
              name={['nutrition', 'fat']}
              rules={nutritionRules}
            >
              <InputNumber
                placeholder="克"
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="碳水化合物"
              name={['nutrition', 'carbohydrates']}
              rules={nutritionRules}
            >
              <InputNumber
                placeholder="克"
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NutritionForm;
