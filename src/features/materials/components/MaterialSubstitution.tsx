import React, { useState } from 'react';
import { Modal, Select, Typography, Alert, Space } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import type { Material } from '../../../types/material';
import type { Recipe } from '../../../types/recipe';

const { Text } = Typography;

interface MaterialSubstitutionProps {
  open: boolean;
  sourceMaterial: Material | null;
  targetRecipes: Recipe[];
  allMaterials: Material[];
  onConfirm: (newMaterialId: string) => void;
  onCancel: () => void;
}

const MaterialSubstitution: React.FC<MaterialSubstitutionProps> = ({
  open,
  sourceMaterial,
  targetRecipes,
  allMaterials,
  onConfirm,
  onCancel,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>();

  const handleOk = () => {
    if (selectedMaterialId) {
      onConfirm(selectedMaterialId);
      setSelectedMaterialId(undefined);
    }
  };

  const handleCancel = () => {
    setSelectedMaterialId(undefined);
    onCancel();
  };

  if (!sourceMaterial) {
    return null;
  }

  const availableMaterials = allMaterials.filter(m => m.id !== sourceMaterial.id);

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined />
          <span>替換材料</span>
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="替換"
      cancelText="取消"
      okButtonProps={{ disabled: !selectedMaterialId }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message={`「${sourceMaterial.name}」正在 ${targetRecipes.length} 個配方中使用`}
          description="您可以將所有配方中的此材料替換為另一個材料"
          type="info"
          showIcon
        />

        <div>
          <Text strong>選擇替換材料：</Text>
          <Select
            style={{ width: '100%', marginTop: '8px' }}
            placeholder="選擇新材料"
            value={selectedMaterialId}
            onChange={setSelectedMaterialId}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={availableMaterials.map(m => ({
              label: `${m.name} (${m.price}元 / ${m.weight}${m.unit})`,
              value: m.id,
            }))}
          />
        </div>

        {selectedMaterialId && (
          <Alert
            message="注意"
            description={`所有使用「${sourceMaterial.name}」的配方將改用新材料，原材料將被刪除。`}
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};

export default MaterialSubstitution;
