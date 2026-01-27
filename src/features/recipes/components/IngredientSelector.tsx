import React from 'react';
import { Form, Select, InputNumber, Button, Space, Typography, Empty } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Material } from '../../../types/material';
import { formatCurrency, calculateIngredientCost } from '../../../utils/calculations';

const { Text } = Typography;

interface IngredientSelectorProps {
  materials: Material[];
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ materials }) => {
  if (materials.length === 0) {
    return (
      <Empty
        description="尚無材料，請先新增材料"
        style={{ padding: '24px 0' }}
      />
    );
  }

  return (
    <div>
      <Form.List name="ingredients">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#F0F8FF',
                  borderRadius: '12px',
                  border: '1px solid #E3F2FD',
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  {/* 材料選擇 */}
                  <Form.Item
                    {...restField}
                    name={[name, 'materialId']}
                    rules={[{ required: true, message: '請選擇材料' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      placeholder="選擇材料"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={materials.map((material) => ({
                        label: `${material.name} (${formatCurrency(material.price)} / ${material.weight}${material.unit})`,
                        value: material.id,
                      }))}
                    />
                  </Form.Item>

                  {/* 重量和單位 */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'weight']}
                      rules={[
                        { required: true, message: '請輸入重量' },
                        { type: 'number', min: 0.01, message: '重量必須大於 0' },
                      ]}
                      style={{ marginBottom: 0, flex: 2 }}
                    >
                      <InputNumber
                        placeholder="使用重量"
                        style={{ width: '100%' }}
                        min={0.01}
                        precision={2}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'unit']}
                      rules={[{ required: true, message: '請選擇單位' }]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <Select placeholder="單位">
                        <Select.Option value="g">克 (g)</Select.Option>
                        <Select.Option value="kg">公斤 (kg)</Select.Option>
                        <Select.Option value="ml">毫升 (ml)</Select.Option>
                        <Select.Option value="l">公升 (l)</Select.Option>
                      </Select>
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    >
                      移除
                    </Button>
                  </div>

                  {/* 顯示小計成本（如果有選擇材料和重量） */}
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const materialId = getFieldValue(['ingredients', name, 'materialId']);
                      const weight = getFieldValue(['ingredients', name, 'weight']);
                      const unit = getFieldValue(['ingredients', name, 'unit']);

                      if (materialId && weight && unit) {
                        const material = materials.find((m) => m.id === materialId);
                        if (material) {
                          const cost = calculateIngredientCost(material, weight, unit);
                          return (
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                              小計：{formatCurrency(cost)}
                            </Text>
                          );
                        }
                      }
                      return null;
                    }}
                  </Form.Item>
                </Space>
              </div>
            ))}

            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              style={{
                marginTop: fields.length > 0 ? '12px' : 0,
                borderRadius: '12px',
                height: '48px',
                fontSize: '15px',
              }}
            >
              新增材料
            </Button>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default IngredientSelector;
