import React, { createContext, useContext, useCallback } from 'react';
import { message } from 'antd';
import type { Material, MaterialFormData } from '../types/material';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';

// Context 介面
interface MaterialContextType {
  materials: Material[];
  addMaterial: (materialData: MaterialFormData) => void;
  updateMaterial: (id: string, materialData: MaterialFormData) => void;
  deleteMaterial: (id: string) => void;
  getMaterialById: (id: string) => Material | undefined;
}

// 建立 Context
const MaterialContext = createContext<MaterialContextType | undefined>(undefined);

// Provider 組件
export const MaterialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useLocalStorage<Material[]>(STORAGE_KEYS.MATERIALS, []);

  // 新增材料
  const addMaterial = useCallback(
    (materialData: MaterialFormData) => {
      const newMaterial: Material = {
        ...materialData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMaterials((prev) => [...prev, newMaterial]);
      message.success('材料新增成功');
    },
    [setMaterials]
  );

  // 更新材料
  const updateMaterial = useCallback(
    (id: string, materialData: MaterialFormData) => {
      setMaterials((prev) =>
        prev.map((material) =>
          material.id === id
            ? {
                ...materialData,
                id,
                createdAt: material.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : material
        )
      );
      message.success('材料更新成功');
    },
    [setMaterials]
  );

  // 刪除材料
  const deleteMaterial = useCallback(
    (id: string) => {
      setMaterials((prev) => prev.filter((material) => material.id !== id));
      message.success('材料已刪除');
    },
    [setMaterials]
  );

  // 根據 ID 獲取材料
  const getMaterialById = useCallback(
    (id: string) => {
      return materials.find((material) => material.id === id);
    },
    [materials]
  );

  const value: MaterialContextType = {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
  };

  return <MaterialContext.Provider value={value}>{children}</MaterialContext.Provider>;
};

// Hook for using Material Context
export const useMaterials = () => {
  const context = useContext(MaterialContext);
  if (context === undefined) {
    throw new Error('useMaterials must be used within a MaterialProvider');
  }
  return context;
};
