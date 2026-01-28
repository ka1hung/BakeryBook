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
  const { materialCost, fuelCost, laborCost, totalCost, costPerServing, totalNutrition, nutritionPerServing } = calculation;

  return (
    <Card
      style={{
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(139, 69, 19, 0.08)',
        background: 'linear-gradient(135deg, #FFFAF0 0%, #FAEBD7 100%)',
        border: '1px solid #DEB887',
      }}
    >
      <Text strong style={{ fontSize: '16px', color: '#8B4513' }}>
        配方計算結果
      </Text>

      {/* 成本明細 */}
      <div style={{ marginTop: '16px' }}>
        <Text strong style={{ fontSize: '14px', color: '#5D4037' }}>
          成本明細
        </Text>
        <Row gutter={[12, 8]} style={{ marginTop: '8px' }}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#FFF8DC', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>材料成本</Text>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B4513' }}>
                NT$ {formatNumber(materialCost)}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#FFE4B5', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>燃料費/電費</Text>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#CD853F' }}>
                NT$ {formatNumber(fuelCost)}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#FAEBD7', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>人工費用</Text>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#A0522D' }}>
                NT$ {formatNumber(laborCost)}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 總成本統計 */}
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={costPerServing ? 12 : 24}>
          <Statistic
            title="總成本"
            value={totalCost}
            precision={2}
            prefix={<DollarOutlined style={{ color: '#8B4513' }} />}
            suffix="元"
            valueStyle={{ color: '#8B4513', fontSize: '28px', fontWeight: 'bold' }}
          />
        </Col>
        {costPerServing && (
          <Col span={12}>
            <Statistic
              title="每份成本"
              value={costPerServing}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#6B8E23' }} />}
              suffix="元"
              valueStyle={{ color: '#6B8E23', fontSize: '24px' }}
            />
          </Col>
        )}
      </Row>

      <Divider style={{ margin: '16px 0' }} />

      {/* 營養成分統計 */}
      <div>
        <Text strong style={{ fontSize: '15px', color: '#5D4037' }}>
          <FireOutlined style={{ marginRight: '6px', color: '#DAA520' }} />
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
