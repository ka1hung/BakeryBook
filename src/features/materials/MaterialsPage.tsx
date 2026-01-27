import React, { useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useMaterials } from '../../contexts/MaterialContext';
import type { Material, MaterialFormData } from '../../types/material';
import MaterialForm from './components/MaterialForm';
import MaterialList from './components/MaterialList';
import { showConfirmDialog } from '../../components/common/ConfirmDialog';

const { Title } = Typography;

const MaterialsPage: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useMaterials();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();

  // 開啟新增表單
  const handleAdd = () => {
    setFormMode('add');
    setEditingMaterial(undefined);
    setFormOpen(true);
  };

  // 開啟編輯表單
  const handleEdit = (material: Material) => {
    setFormMode('edit');
    setEditingMaterial(material);
    setFormOpen(true);
  };

  // 處理表單提交
  const handleFormSubmit = (values: MaterialFormData) => {
    if (formMode === 'add') {
      addMaterial(values);
    } else if (formMode === 'edit' && editingMaterial) {
      updateMaterial(editingMaterial.id, values);
    }
    setFormOpen(false);
  };

  // 處理刪除
  const handleDelete = (id: string) => {
    showConfirmDialog({
      title: '確認刪除',
      content: '確定要刪除這個材料嗎？此操作無法復原。',
      onOk: () => deleteMaterial(id),
    });
  };

  return (
    <div>
      {/* 頁面標題和操作按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#5B9BD5', margin: 0 }}>
          材料管理
        </Title>

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            新增材料
          </Button>
        </Space>
      </div>

      {/* 材料列表 */}
      <MaterialList
        materials={materials}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 材料表單 Modal */}
      <MaterialForm
        open={formOpen}
        mode={formMode}
        initialValues={editingMaterial}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      />
    </div>
  );
};

export default MaterialsPage;
