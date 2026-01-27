import React, { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import type { Material, MaterialFormData } from '../types/material';
import type { Recipe } from '../types/recipe';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { findMaterialUsage } from '../utils/referentialIntegrity';
import { migrateMaterialData, needsMigration } from '../utils/migrations';

// Context 介面
interface MaterialContextType {
  materials: Material[];
  addMaterial: (materialData: MaterialFormData) => void;
  updateMaterial: (id: string, materialData: MaterialFormData) => void;
  deleteMaterial: (id: string, recipes: Recipe[]) => boolean;
  getMaterialById: (id: string) => Material | undefined;
  getMaterialUsage: (id: string, recipes: Recipe[]) => Recipe[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

// 建立 Context
const MaterialContext = createContext<MaterialContextType | undefined>(undefined);

// Provider 組件
export const MaterialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useLocalStorage<Material[]>(STORAGE_KEYS.MATERIALS, []);
  const hasMigrated = useRef(false);

  // 資料遷移：在載入時自動遷移舊格式的營養資料
  useEffect(() => {
    // 避免重複執行遷移
    if (hasMigrated.current) return;

    if (materials.length > 0 && needsMigration(materials)) {
      const migratedMaterials = migrateMaterialData(materials);
      setMaterials(migratedMaterials);
      message.info('營養資料已更新至台灣食品標示規範格式');
      hasMigrated.current = true;
    }
  }, [materials, setMaterials]);

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
    (id: string, recipes: Recipe[]) => {
      // 檢查材料是否被配方使用
      const usedInRecipes = findMaterialUsage(id, recipes);

      if (usedInRecipes.length > 0) {
        message.error(`無法刪除：此材料正在 ${usedInRecipes.length} 個配方中使用`);
        return false;
      }

      // 安全刪除
      setMaterials((prev) => prev.filter((material) => material.id !== id));
      message.success('材料已刪除');
      return true;
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

  // 取得材料使用狀況
  const getMaterialUsage = useCallback(
    (id: string, recipes: Recipe[]) => {
      return findMaterialUsage(id, recipes);
    },
    []
  );

  const value: MaterialContextType = {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    getMaterialUsage,
    setMaterials,
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
