import React, { useRef } from 'react';
import { Button, Card, Typography, Space, message } from 'antd';
import { DownloadOutlined, FileImageOutlined } from '@ant-design/icons';
import type { NutritionTotal } from '../../../types/recipe';
import { formatNumber } from '../../../utils/calculations';

const { Text, Title } = Typography;

interface NutritionLabelProps {
  nutrition: NutritionTotal;
  recipeName: string;
  servings?: number;
  totalWeight?: number; // 總重量（克）
}

// 台灣每日營養素參考值 (DRV)
const DAILY_REFERENCE_VALUES = {
  calories: 2000,      // 大卡
  protein: 60,         // 克
  fat: 60,             // 克
  saturatedFat: 18,    // 克
  transFat: 0,         // 克 (應盡量減少)
  carbohydrates: 300,  // 克
  sugar: 50,           // 克
  sodium: 2000,        // 毫克
  fiber: 25,           // 克
  cholesterol: 300,    // 毫克
};

const NutritionLabel: React.FC<NutritionLabelProps> = ({
  nutrition,
  recipeName,
  servings = 1,
  totalWeight,
}) => {
  const labelRef = useRef<HTMLDivElement>(null);

  // 計算每份營養素
  const perServing = {
    calories: nutrition.calories / servings,
    protein: nutrition.protein / servings,
    fat: nutrition.fat / servings,
    saturatedFat: nutrition.saturatedFat / servings,
    transFat: nutrition.transFat / servings,
    carbohydrates: nutrition.carbohydrates / servings,
    sugar: nutrition.sugar / servings,
    sodium: nutrition.sodium / servings,
    fiber: nutrition.fiber / servings,
    cholesterol: nutrition.cholesterol / servings,
  };

  // 計算每日參考值百分比
  const getDailyPercent = (value: number, key: keyof typeof DAILY_REFERENCE_VALUES): string => {
    const drv = DAILY_REFERENCE_VALUES[key];
    if (drv === 0) return '-';
    const percent = (value / drv) * 100;
    return `${Math.round(percent)}%`;
  };

  // 下載為 PNG
  const downloadAsPng = async () => {
    if (!labelRef.current) return;

    try {
      // 動態載入 html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(labelRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高解析度
      });

      const link = document.createElement('a');
      link.download = `${recipeName}_營養標示.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      message.success('營養標示已下載');
    } catch (error) {
      console.error('下載失敗:', error);
      message.error('下載失敗，請稍後再試');
    }
  };

  // 複製為圖片
  const copyToClipboard = async () => {
    if (!labelRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(labelRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          message.success('已複製到剪貼簿');
        }
      });
    } catch (error) {
      console.error('複製失敗:', error);
      message.error('複製失敗，請稍後再試');
    }
  };

  const labelStyle: React.CSSProperties = {
    width: '280px',
    padding: '16px',
    border: '2px solid #000',
    backgroundColor: '#fff',
    fontFamily: 'Arial, "Noto Sans TC", sans-serif',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px solid #ddd',
  };

  const headerRowStyle: React.CSSProperties = {
    ...rowStyle,
    fontWeight: 'bold',
    borderBottom: '2px solid #000',
  };

  const subRowStyle: React.CSSProperties = {
    ...rowStyle,
    paddingLeft: '16px',
  };

  return (
    <Card
      style={{
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(139, 69, 19, 0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={5} style={{ margin: 0, color: '#8B4513' }}>
          台灣食品營養標示
        </Title>
        <Space>
          <Button
            icon={<FileImageOutlined />}
            onClick={copyToClipboard}
            size="small"
          >
            複製
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={downloadAsPng}
            size="small"
            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
          >
            下載 PNG
          </Button>
        </Space>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div ref={labelRef} style={labelStyle}>
          {/* 標題 */}
          <div style={{ textAlign: 'center', borderBottom: '8px solid #000', paddingBottom: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>營養標示</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{recipeName}</div>
          </div>

          {/* 份量資訊 */}
          <div style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>
            <div style={{ fontSize: '13px' }}>
              <strong>每份</strong>
              {totalWeight && servings && (
                <span> {formatNumber(totalWeight / servings)} 公克</span>
              )}
            </div>
            <div style={{ fontSize: '13px' }}>
              <strong>本包裝含</strong> {servings} 份
            </div>
          </div>

          {/* 表頭 */}
          <div style={headerRowStyle}>
            <span style={{ flex: 2 }}>營養素</span>
            <span style={{ flex: 1, textAlign: 'right' }}>每份</span>
            <span style={{ flex: 1, textAlign: 'right' }}>每日參考值%</span>
          </div>

          {/* 熱量 */}
          <div style={{ ...rowStyle, fontWeight: 'bold' }}>
            <span style={{ flex: 2 }}>熱量</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.calories)} 大卡</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.calories, 'calories')}</span>
          </div>

          {/* 蛋白質 */}
          <div style={rowStyle}>
            <span style={{ flex: 2 }}>蛋白質</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.protein)} 公克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.protein, 'protein')}</span>
          </div>

          {/* 脂肪 */}
          <div style={{ ...rowStyle, fontWeight: 'bold' }}>
            <span style={{ flex: 2 }}>脂肪</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.fat)} 公克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.fat, 'fat')}</span>
          </div>

          {/* 飽和脂肪 */}
          <div style={subRowStyle}>
            <span style={{ flex: 2 }}>飽和脂肪</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.saturatedFat)} 公克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.saturatedFat, 'saturatedFat')}</span>
          </div>

          {/* 反式脂肪 */}
          <div style={subRowStyle}>
            <span style={{ flex: 2 }}>反式脂肪</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.transFat)} 公克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>-</span>
          </div>

          {/* 碳水化合物 */}
          <div style={{ ...rowStyle, fontWeight: 'bold' }}>
            <span style={{ flex: 2 }}>碳水化合物</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.carbohydrates)} 公克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.carbohydrates, 'carbohydrates')}</span>
          </div>

          {/* 糖 */}
          <div style={subRowStyle}>
            <span style={{ flex: 2 }}>糖</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.sugar)} 公克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.sugar, 'sugar')}</span>
          </div>

          {/* 鈉 */}
          <div style={{ ...rowStyle, fontWeight: 'bold' }}>
            <span style={{ flex: 2 }}>鈉</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.sodium)} 毫克</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.sodium, 'sodium')}</span>
          </div>

          {/* 膳食纖維（選填） */}
          {perServing.fiber > 0 && (
            <div style={rowStyle}>
              <span style={{ flex: 2 }}>膳食纖維</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.fiber)} 公克</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.fiber, 'fiber')}</span>
            </div>
          )}

          {/* 膽固醇（選填） */}
          {perServing.cholesterol > 0 && (
            <div style={rowStyle}>
              <span style={{ flex: 2 }}>膽固醇</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{formatNumber(perServing.cholesterol)} 毫克</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{getDailyPercent(perServing.cholesterol, 'cholesterol')}</span>
            </div>
          )}

          {/* 備註 */}
          <div style={{ marginTop: '8px', borderTop: '4px solid #000', paddingTop: '8px' }}>
            <Text style={{ fontSize: '10px', color: '#666' }}>
              *每日參考值：熱量2000大卡、蛋白質60公克、脂肪60公克、飽和脂肪18公克、碳水化合物300公克、糖50公克、鈉2000毫克。
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NutritionLabel;
