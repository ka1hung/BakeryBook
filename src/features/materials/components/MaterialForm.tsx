import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Modal, Collapse } from 'antd';
import { materialNameRules, priceRules, weightRules, unitRules } from '../../../utils/validators';
import type { Material, MaterialFormData } from '../../../types/material';
import NutritionForm from './NutritionForm';

const { TextArea } = Input;

interface MaterialFormProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Material;
  onSubmit: (values: MaterialFormData) => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  open,
  mode,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === 'add' ? '新增材料' : '編輯材料'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText="確定"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        {/* 材料名稱 */}
        <Form.Item
          label="材料名稱"
          name="name"
          rules={materialNameRules}
        >
          <Input placeholder="請輸入材料名稱" />
        </Form.Item>

        {/* 價錢 */}
        <Form.Item
          label="價錢（NT$）"
          name="price"
          rules={priceRules}
        >
          <InputNumber
            placeholder="請輸入價錢"
            style={{ width: '100%' }}
            min={0.01}
            precision={2}
            prefix="NT$"
          />
        </Form.Item>

        {/* 重量和單位 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Form.Item
            label="重量"
            name="weight"
            rules={weightRules}
            style={{ flex: 2 }}
          >
            <InputNumber
              placeholder="請輸入重量"
              style={{ width: '100%' }}
              min={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="單位"
            name="unit"
            rules={unitRules}
            style={{ flex: 1 }}
          >
            <Select placeholder="選擇單位">
              <Select.Option value="g">克 (g)</Select.Option>
              <Select.Option value="kg">公斤 (kg)</Select.Option>
              <Select.Option value="ml">毫升 (ml)</Select.Option>
              <Select.Option value="l">公升 (l)</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* 材料說明 */}
        <Form.Item
          label="材料說明（選填）"
          name="description"
        >
          <TextArea
            placeholder="請輸入材料說明"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* 營養成分（可摺疊） */}
        <Collapse
          items={[
            {
              key: '1',
              label: '營養成分（選填）',
              children: <NutritionForm />,
            },
          ]}
          style={{ marginBottom: '16px' }}
        />
      </Form>
    </Modal>
  );
};

export default MaterialForm;
