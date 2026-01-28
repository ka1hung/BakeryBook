import React from 'react';
import { Card, Typography, Row, Col, Statistic, message } from 'antd';
import { ShoppingOutlined, BookOutlined } from '@ant-design/icons';
import { useMaterials } from '../contexts/MaterialContext';
import { useRecipes } from '../contexts/RecipeContext';
import DataHealthCheck from '../components/common/DataHealthCheck';
import DataManagement from '../components/common/DataManagement';
import {
  exportData,
  downloadJsonFile,
  validateImportData,
  importData,
} from '../utils/exportImport';
import type { ImportOptions } from '../types/export';

const { Title, Paragraph } = Typography;

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { materials, setMaterials } = useMaterials();
  const { recipes, setRecipes } = useRecipes();

  // 處理匯出
  const handleExport = () => {
    const data = exportData(materials, recipes);
    downloadJsonFile(data);
    message.success('資料已匯出');
  };

  // 處理匯入
  const handleImport = async (file: File, options: ImportOptions) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateImportData(data)) {
        message.error('檔案格式錯誤');
        return;
      }

      const result = importData(data, materials, recipes, options);

      if (result.success && result.materials && result.recipes) {
        if (options.mode === 'replace') {
          if (options.includeMaterials) {
            setMaterials(result.materials);
          }
          if (options.includeRecipes) {
            setRecipes(result.recipes);
          }
        } else {
          // 合併模式
          setMaterials(result.materials);
          setRecipes(result.recipes);
        }

        message.success(
          `匯入成功！材料: ${result.materialsImported}, 配方: ${result.recipesImported}`
        );

        if (result.skipped > 0) {
          message.warning(`已跳過 ${result.skipped} 筆衝突資料`);
        }

        if (result.errors.length > 0) {
          result.errors.forEach(error => message.warning(error));
        }
      } else {
        message.error(`匯入失敗: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      message.error('檔案讀取失敗');
      console.log(error)
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div>
          <Title level={2} style={{ color: '#8B4513', margin: 0 }}>
            歡迎使用配方資料庫
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#5D4037', marginTop: '8px' }}>
            專業烘焙配方管理系統，幫助您精準管理材料成本和營養成分。
          </Paragraph>
        </div>
        <DataManagement onExport={handleExport} onImport={handleImport} />
      </div>

      {/* 資料健康檢查 */}
      <DataHealthCheck />

      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            onClick={() => onPageChange('materials')}
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(139, 69, 19, 0.06)',
              border: '1px solid #FAEBD7',
              cursor: 'pointer',
            }}
          >
            <Statistic
              title="材料總數"
              value={materials.length}
              prefix={<ShoppingOutlined style={{ color: '#8B4513' }} />}
              valueStyle={{ color: '#8B4513' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            onClick={() => onPageChange('recipes')}
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(139, 69, 19, 0.06)',
              border: '1px solid #FAEBD7',
              cursor: 'pointer',
            }}
          >
            <Statistic
              title="配方總數"
              value={recipes.length}
              prefix={<BookOutlined style={{ color: '#6B8E23' }} />}
              valueStyle={{ color: '#6B8E23' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          marginTop: '32px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(139, 69, 19, 0.06)',
          border: '1px solid #FAEBD7',
        }}
      >
        <Title level={4} style={{ color: '#8B4513' }}>功能介紹</Title>
        <ul style={{ fontSize: '15px', lineHeight: '2' }}>
          <li>
            <strong>材料管理：</strong>新增、編輯、刪除材料，支援營養成分記錄
          </li>
          <li>
            <strong>配方管理：</strong>建立配方、選擇材料、自動計算成本和營養成分
          </li>
          <li>
            <strong>即時計算：</strong>根據材料價格和重量，自動計算配方總成本
          </li>
          <li>
            <strong>資料持久化：</strong>所有資料儲存在瀏覽器本地，無需網路連線
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default HomePage;
