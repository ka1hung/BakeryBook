import React, { useState, useMemo } from 'react';
import { Typography, Button, Space, Modal, message, Upload } from 'antd';
import { PlusOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import { useMaterials } from '../../contexts/MaterialContext';
import { useRecipes } from '../../contexts/RecipeContext';
import type { Material, MaterialFormData, Unit, Nutrition } from '../../types/material';
import type { Recipe } from '../../types/recipe';
import MaterialForm from './components/MaterialForm';
import MaterialList from './components/MaterialList';
import MaterialSubstitution from './components/MaterialSubstitution';
import ImportPreviewModal from '../../components/common/ImportPreviewModal';
import { showConfirmDialog } from '../../components/common/ConfirmDialog';
import { replaceMaterialInRecipes } from '../../utils/referentialIntegrity';
import { exportMaterialsToXlsx } from '../../utils/xlsxExport';
import {
  parseMaterialXlsx,
  downloadMaterialTemplate,
  type ParsedMaterialRow,
} from '../../utils/xlsxImport';

const { Title } = Typography;

const MaterialsPage: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial, getMaterialUsage, setMaterials } = useMaterials();
  const { recipes, updateRecipe } = useRecipes();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [substitutionOpen, setSubstitutionOpen] = useState(false);
  const [substitutingMaterial, setSubstitutingMaterial] = useState<Material | null>(null);
  const [substitutionTargetRecipes, setSubstitutionTargetRecipes] = useState<Recipe[]>([]);

  // XLSX 匯入相關狀態
  const [importPreviewOpen, setImportPreviewOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedMaterialRow[]>([]);
  const [conflictStrategy, setConflictStrategy] = useState<'skip' | 'overwrite' | 'rename'>('skip');

  // 偵測重複
  const hasDuplicates = useMemo(
    () => parsedRows.some(row => materials.some(m => m.name === row.name)),
    [parsedRows, materials]
  );

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
    const material = materials.find(m => m.id === id);
    if (!material) return;

    const usedInRecipes = getMaterialUsage(id, recipes);

    if (usedInRecipes.length > 0) {
      Modal.confirm({
        title: '材料正在使用中',
        content: (
          <div>
            <p>此材料正在以下 {usedInRecipes.length} 個配方中使用：</p>
            <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
              {usedInRecipes.map(recipe => (
                <li key={recipe.id}>{recipe.name}</li>
              ))}
            </ul>
          </div>
        ),
        okText: '替換材料',
        cancelText: '取消',
        onOk: () => {
          setSubstitutingMaterial(material);
          setSubstitutionTargetRecipes(usedInRecipes);
          setSubstitutionOpen(true);
        },
      });
      return;
    }

    showConfirmDialog({
      title: '確認刪除',
      content: '確定要刪除這個材料嗎？此操作無法復原。',
      onOk: () => deleteMaterial(id, recipes),
    });
  };

  // 處理材料替換
  const handleSubstitution = (newMaterialId: string) => {
    if (!substitutingMaterial) return;

    const updatedRecipes = replaceMaterialInRecipes(
      recipes,
      substitutingMaterial.id,
      newMaterialId
    );

    updatedRecipes.forEach(recipe => {
      const original = recipes.find(r => r.id === recipe.id);
      if (original && JSON.stringify(original) !== JSON.stringify(recipe)) {
        updateRecipe(recipe.id, {
          name: recipe.name,
          description: recipe.description,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
        });
      }
    });

    deleteMaterial(substitutingMaterial.id, []);

    message.success(`已將 ${substitutionTargetRecipes.length} 個配方的材料替換完成`);
    setSubstitutionOpen(false);
    setSubstitutingMaterial(null);
    setSubstitutionTargetRecipes([]);
  };

  // 批次刪除
  const handleBatchDelete = (ids: string[]) => {
    // 檢查參照完整性
    const usedMaterials = ids.filter(id => getMaterialUsage(id, recipes).length > 0);

    if (usedMaterials.length > 0) {
      const usedNames = usedMaterials
        .map(id => materials.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join('、');

      Modal.warning({
        title: '部分材料無法刪除',
        content: `以下材料正在配方中使用，無法批次刪除：${usedNames}。請先移除配方中的引用或替換材料。`,
      });
      return;
    }

    showConfirmDialog({
      title: '批次刪除確認',
      content: `確定要刪除選取的 ${ids.length} 個材料嗎？此操作無法復原。`,
      onOk: () => {
        const idSet = new Set(ids);
        setMaterials(prev => prev.filter(m => !idSet.has(m.id)));
        message.success(`已刪除 ${ids.length} 個材料`);
      },
    });
  };

  // 批次匯出
  const handleBatchExport = (selectedMaterials: Material[]) => {
    exportMaterialsToXlsx(selectedMaterials);
    message.success(`已匯出 ${selectedMaterials.length} 個材料`);
  };

  // XLSX 匯入 - 上傳檔案
  const handleImportFile = async (file: File) => {
    try {
      const rows = await parseMaterialXlsx(file);
      if (rows.length === 0) {
        message.warning('檔案中沒有可匯入的資料');
        return;
      }
      setParsedRows(rows);
      setConflictStrategy('skip');
      setImportPreviewOpen(true);
    } catch {
      message.error('無法解析檔案，請確認檔案格式是否正確');
    }
  };

  // XLSX 匯入 - 確認
  const handleImportConfirm = () => {
    const validRows = parsedRows.filter(r => r.isValid);
    const now = new Date().toISOString();

    const existingNames = new Set(materials.map(m => m.name));
    const newMaterials: Material[] = [];

    for (const row of validRows) {
      const isDuplicate = existingNames.has(row.name);

      if (isDuplicate && conflictStrategy === 'skip') continue;

      const material: Material = {
        id: crypto.randomUUID(),
        name: isDuplicate && conflictStrategy === 'rename'
          ? `${row.name} (匯入)`
          : row.name,
        price: row.price,
        weight: row.weight,
        unit: row.unit as Unit,
        description: row.description,
        nutrition: row.nutrition ? row.nutrition as Nutrition : undefined,
        createdAt: now,
        updatedAt: now,
      };

      newMaterials.push(material);
    }

    if (conflictStrategy === 'overwrite') {
      const importNames = new Set(validRows.map(r => r.name));
      setMaterials(prev => [
        ...prev.filter(m => !importNames.has(m.name)),
        ...newMaterials,
      ]);
    } else {
      setMaterials(prev => [...prev, ...newMaterials]);
    }

    message.success(`成功匯入 ${newMaterials.length} 個材料`);
    setImportPreviewOpen(false);
    setParsedRows([]);
  };

  return (
    <div>
      {/* 頁面標題和操作按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={2} style={{ color: '#5B9BD5', margin: 0 }}>
          材料管理
        </Title>

        <Space wrap>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadMaterialTemplate()}
          >
            下載範本
          </Button>
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImportFile(file as unknown as File);
              return false;
            }}
          >
            <Button icon={<ImportOutlined />}>
              匯入 XLSX
            </Button>
          </Upload>
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
        onBatchDelete={handleBatchDelete}
        onBatchExport={handleBatchExport}
      />

      {/* 材料表單 Modal */}
      <MaterialForm
        open={formOpen}
        mode={formMode}
        initialValues={editingMaterial}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      />

      {/* 材料替換 Modal */}
      <MaterialSubstitution
        open={substitutionOpen}
        sourceMaterial={substitutingMaterial}
        targetRecipes={substitutionTargetRecipes}
        allMaterials={materials}
        onConfirm={handleSubstitution}
        onCancel={() => {
          setSubstitutionOpen(false);
          setSubstitutingMaterial(null);
          setSubstitutionTargetRecipes([]);
        }}
      />

      {/* XLSX 匯入預覽 Modal */}
      <ImportPreviewModal
        open={importPreviewOpen}
        onCancel={() => {
          setImportPreviewOpen(false);
          setParsedRows([]);
        }}
        onConfirm={handleImportConfirm}
        title="匯入材料預覽"
        materialRows={parsedRows}
        hasDuplicates={hasDuplicates}
        conflictStrategy={conflictStrategy}
        onConflictStrategyChange={setConflictStrategy}
      />
    </div>
  );
};

export default MaterialsPage;
