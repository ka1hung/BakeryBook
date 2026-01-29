import type { ThemeConfig } from 'antd';

// 烘焙主題配置 - Bakery Theme
export const theme: ThemeConfig = {
  token: {
    // 主色彩 - 暖棕咖啡色系
    colorPrimary: '#8B4513',      // 咖啡棕
    colorSuccess: '#6B8E23',      // 橄欖綠
    colorWarning: '#DAA520',      // 金黃
    colorError: '#CD5C5C',        // 印度紅
    colorInfo: '#CD853F',         // 秘魯棕

    // 背景色 - 奶油/暖白色調
    colorBgContainer: '#FFFAF0',  // 花白
    colorBgLayout: '#FDF5E6',     // 奶油白

    // 文字色
    colorText: '#3E2723',         // 深棕
    colorTextSecondary: '#5D4037', // 棕

    // 邊框色
    colorBorder: '#DEB887',       // 麥色
    colorBorderSecondary: '#FAEBD7', // 古董白

    // 圓角設計 - 稍微縮小讓介面更俐落
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // 字型
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 26,
    fontSizeHeading3: 22,
    fontSizeHeading4: 18,
    fontSizeHeading5: 16,

    // 間距
    padding: 16,
    margin: 16,

    // 陰影（暖棕色調）
    boxShadow: '0 2px 8px rgba(139, 69, 19, 0.08)',
    boxShadowSecondary: '0 4px 16px rgba(139, 69, 19, 0.12)',
  },
  components: {
    // 按鈕組件
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingContentHorizontal: 24,
      primaryShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
    },
    // 卡片組件
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(139, 69, 19, 0.06)',
      paddingLG: 24,
      colorBgContainer: '#FFFAF0',
    },
    // 輸入框組件
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      paddingBlock: 8,
      paddingInline: 12,
      colorBgContainer: '#FFFFFF',
    },
    // 選擇器組件
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#FFFFFF',
    },
    // Modal 對話框
    Modal: {
      borderRadius: 12,
      colorBgElevated: '#FFFAF0',
    },
    // 表單組件
    Form: {
      labelFontSize: 14,
      itemMarginBottom: 20,
      labelColor: '#5D4037',
    },
    // 訊息提示
    Message: {
      borderRadius: 8,
    },
    // 統計數值
    Statistic: {
      contentFontSize: 28,
      titleFontSize: 14,
    },
    // 選單組件
    Menu: {
      colorBgContainer: '#FFFAF0',
      colorItemBgSelected: '#FFE4B5',
      colorItemTextSelected: '#8B4513',
      colorItemBgHover: '#FAEBD7',
    },
    // 標籤頁組件
    Tabs: {
      colorPrimary: '#8B4513',
      colorBorderSecondary: '#DEB887',
    },
    // 標籤組件
    Tag: {
      borderRadiusSM: 6,
    },
    // 表格組件
    Table: {
      borderRadius: 12,
      colorBgContainer: '#FFFAF0',
      headerBg: '#FDF5E6',
      headerColor: '#3E2723',
      rowHoverBg: '#FFF8EE',
      borderColor: '#FAEBD7',
    },
    // 分段控制器
    Segmented: {
      borderRadius: 8,
      colorBgLayout: '#FDF5E6',
      itemSelectedBg: '#FFFAF0',
      itemSelectedColor: '#8B4513',
    },
  },
};
