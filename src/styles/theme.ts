import type { ThemeConfig } from 'antd';

// 淺藍色系主題配置
export const theme: ThemeConfig = {
  token: {
    // 主色彩
    colorPrimary: '#5B9BD5', // 天空藍
    colorSuccess: '#81C784', // 淺綠
    colorWarning: '#FFB74D', // 淺橙
    colorError: '#EF9A9A',   // 淺紅
    colorInfo: '#64B5F6',    // 淺藍

    // 背景色
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F0F8FF', // 淺藍白背景

    // 圓角設計
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,

    // 字型
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // 間距
    padding: 16,
    margin: 16,

    // 陰影（柔和）
    boxShadow: '0 2px 8px rgba(91, 155, 213, 0.08)',
    boxShadowSecondary: '0 4px 16px rgba(91, 155, 213, 0.12)',
  },
  components: {
    // 按鈕組件
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingContentHorizontal: 24,
    },
    // 卡片組件
    Card: {
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(91, 155, 213, 0.08)',
      paddingLG: 24,
    },
    // 輸入框組件
    Input: {
      borderRadius: 10,
      controlHeight: 40,
      paddingBlock: 8,
      paddingInline: 12,
    },
    // 選擇器組件
    Select: {
      borderRadius: 10,
      controlHeight: 40,
    },
    // Modal 對話框
    Modal: {
      borderRadius: 16,
    },
    // 表單組件
    Form: {
      labelFontSize: 14,
      itemMarginBottom: 20,
    },
    // 訊息提示
    Message: {
      borderRadius: 10,
    },
    // 統計數值
    Statistic: {
      contentFontSize: 28,
      titleFontSize: 14,
    },
  },
};
