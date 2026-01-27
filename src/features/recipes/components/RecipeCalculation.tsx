import React from 'react';
import { Card, Statistic, Row, Col, Divider, Typography, Tabs } from 'antd';
import { DollarOutlined, FireOutlined } from '@ant-design/icons';
import type { RecipeCalculation } from '../../../types/recipe';
import { formatNumber } from '../../../utils/calculations';
import { NUTRITION_FIELDS } from '../../../types/material';

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

        <Tabs
          defaultActiveKey="summary"
          style={{ marginTop: '12px' }}
          items={[
            {
              key: 'summary',
              label: '概要',
              children: (
                <Row gutter={[16, 16]}>
                  {['calories', 'protein', 'carbohydrates', 'fat'].map(key => {
                    const field = NUTRITION_FIELDS.find(f => f.key === key);
                    if (!field) return null;
                    const value = nutritionPerServing?.[key as keyof typeof nutritionPerServing] || totalNutrition[key as keyof typeof totalNutrition];
                    return (
                      <Col xs={12} sm={12} md={6} key={key}>
                        <div style={{
                          textAlign: 'center',
                          padding: '12px',
                          backgroundColor: `${field.color}15`,
                          borderRadius: '8px',
                          border: `1px solid ${field.color}40`
                        }}>
                          <Text type="secondary" style={{ fontSize: '13px' }}>{field.label}</Text>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: field.color }}>
                            {formatNumber(value)}
                            <Text style={{ fontSize: '14px', marginLeft: '4px' }}>{field.unit}</Text>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              ),
            },
            {
              key: 'detailed',
              label: '詳細',
              children: (
                <Row gutter={[16, 16]}>
                  {NUTRITION_FIELDS.map(field => {
                    const value = nutritionPerServing?.[field.key as keyof typeof nutritionPerServing] || totalNutrition[field.key as keyof typeof totalNutrition];
                    return (
                      <Col xs={12} sm={8} md={6} key={field.key}>
                        <div style={{
                          textAlign: 'center',
                          padding: '12px',
                          backgroundColor: `${field.color}15`,
                          borderRadius: '8px',
                          border: `1px solid ${field.color}40`
                        }}>
                          <Text type="secondary" style={{ fontSize: '13px' }}>{field.label}</Text>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: field.color }}>
                            {formatNumber(value)}
                            <Text style={{ fontSize: '12px', marginLeft: '4px' }}>{field.unit}</Text>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              ),
            },
          ]}
        />

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
