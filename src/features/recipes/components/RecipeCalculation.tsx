import React from 'react';
import { Card, Statistic, Row, Col, Divider, Typography } from 'antd';
import { DollarOutlined, FireOutlined } from '@ant-design/icons';
import type { RecipeCalculation } from '../../../types/recipe';
import { formatCurrency, formatNumber } from '../../../utils/calculations';

const { Text } = Typography;

interface RecipeCalculationProps {
  calculation: RecipeCalculation;
}

const RecipeCalculationDisplay: React.FC<RecipeCalculationProps> = ({ calculation }) => {
  const { totalCost, costPerServing, totalNutrition, nutritionPerServing } = calculation;

  return (
    <Card
      style={{
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(91, 155, 213, 0.12)',
        background: 'linear-gradient(135deg, #F0F8FF 0%, #E3F2FD 100%)',
      }}
    >
      <Text strong style={{ fontSize: '16px', color: '#5B9BD5' }}>
        配方計算結果
      </Text>

      {/* 成本統計 */}
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={costPerServing ? 12 : 24}>
          <Statistic
            title="總成本"
            value={totalCost}
            precision={2}
            prefix={<DollarOutlined style={{ color: '#5B9BD5' }} />}
            suffix="元"
            valueStyle={{ color: '#5B9BD5', fontSize: '28px', fontWeight: 'bold' }}
          />
        </Col>
        {costPerServing && (
          <Col span={12}>
            <Statistic
              title="每份成本"
              value={costPerServing}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#81C784' }} />}
              suffix="元"
              valueStyle={{ color: '#81C784', fontSize: '24px' }}
            />
          </Col>
        )}
      </Row>

      <Divider style={{ margin: '16px 0' }} />

      {/* 營養成分統計 */}
      <div>
        <Text strong style={{ fontSize: '15px', color: '#666' }}>
          <FireOutlined style={{ marginRight: '6px', color: '#FFB74D' }} />
          營養成分
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: '12px' }}>
          <Col span={12}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(255, 183, 77, 0.1)', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>熱量</Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFB74D' }}>
                {formatNumber(nutritionPerServing?.calories || totalNutrition.calories)}
                <Text style={{ fontSize: '14px', marginLeft: '4px' }}>卡</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(129, 199, 132, 0.1)', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>蛋白質</Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#81C784' }}>
                {formatNumber(nutritionPerServing?.protein || totalNutrition.protein)}
                <Text style={{ fontSize: '14px', marginLeft: '4px' }}>g</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(239, 154, 154, 0.1)', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>脂肪</Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF9A9A' }}>
                {formatNumber(nutritionPerServing?.fat || totalNutrition.fat)}
                <Text style={{ fontSize: '14px', marginLeft: '4px' }}>g</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(91, 155, 213, 0.1)', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>碳水化合物</Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5B9BD5' }}>
                {formatNumber(nutritionPerServing?.carbohydrates || totalNutrition.carbohydrates)}
                <Text style={{ fontSize: '14px', marginLeft: '4px' }}>g</Text>
              </div>
            </div>
          </Col>
        </Row>

        {nutritionPerServing && (
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              * 以上為每份營養成分
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeCalculationDisplay;
