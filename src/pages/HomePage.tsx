import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, BookOutlined } from '@ant-design/icons';
import { useMaterials } from '../contexts/MaterialContext';
import { useRecipes } from '../contexts/RecipeContext';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { materials } = useMaterials();
  const { recipes } = useRecipes();

  return (
    <div>
      <Title level={2} style={{ color: '#5B9BD5' }}>
        歡迎使用配方資料庫
      </Title>
      <Paragraph style={{ fontSize: '16px', color: '#666' }}>
        這是一個清新自然風格的配方管理系統，幫助您管理材料和配方。
      </Paragraph>

      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(91, 155, 213, 0.08)',
            }}
          >
            <Statistic
              title="材料總數"
              value={materials.length}
              prefix={<ShoppingOutlined style={{ color: '#5B9BD5' }} />}
              valueStyle={{ color: '#5B9BD5' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(91, 155, 213, 0.08)',
            }}
          >
            <Statistic
              title="配方總數"
              value={recipes.length}
              prefix={<BookOutlined style={{ color: '#81C784' }} />}
              valueStyle={{ color: '#81C784' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          marginTop: '32px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(91, 155, 213, 0.08)',
        }}
      >
        <Title level={4}>功能介紹</Title>
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
