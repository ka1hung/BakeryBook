import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Tabs } from 'antd';
import { recipeNameRules, servingsRules } from '../../../utils/validators';
import type { Recipe, RecipeFormData } from '../../../types/recipe';
import type { Material } from '../../../types/material';
import IngredientSelector from './IngredientSelector';
import RecipeCalculationDisplay from './RecipeCalculation';
import { useRecipeCalculator } from '../hooks/useRecipeCalculator';

const { TextArea } = Input;

interface RecipeFormProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Recipe;
  materials: Material[];
  onSubmit: (values: RecipeFormData) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  open,
  mode,
  initialValues,
  materials,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // 監聽表單變化以即時計算
  const ingredients = Form.useWatch('ingredients', form) || [];
  const servings = Form.useWatch('servings', form);
  const calculation = useRecipeCalculator(ingredients, materials, servings);

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
      // 確保 ingredients 不為空
      if (!values.ingredients || values.ingredients.length === 0) {
        Modal.error({
          title: '請至少新增一個材料',
          content: '配方必須包含至少一個材料',
        });
        return;
      }
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

  const tabItems = [
    {
      key: '1',
      label: '基本資訊',
      children: (
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '4px' }}>
          <Form.Item label="配方名稱" name="name" rules={recipeNameRules}>
            <Input placeholder="請輸入配方名稱" />
          </Form.Item>

          <Form.Item label="配方描述（選填）" name="description">
            <TextArea
              placeholder="請輸入配方描述"
              rows={6}
              maxLength={3000}
              showCount
            />
          </Form.Item>

          <Form.Item label="預計製作份數（選填）" name="servings" rules={servingsRules}>
            <InputNumber
              placeholder="請輸入份數"
              style={{ width: '100%' }}
              min={1}
              precision={0}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      key: '2',
      label: '材料配比',
      children: (
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '4px' }}>
          <IngredientSelector materials={materials} />
        </div>
      ),
    },
    {
      key: '3',
      label: '計算結果',
      children: (
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '4px' }}>
          <RecipeCalculationDisplay calculation={calculation} />
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={mode === 'add' ? '新增配方' : '編輯配方'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={700}
      okText="確定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" autoComplete="off" initialValues={{ ingredients: [] }}>
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
};

export default RecipeForm;
