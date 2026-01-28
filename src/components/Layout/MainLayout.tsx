import React, { useState } from 'react';
import { Layout, Typography, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Navigation from './Navigation';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#FDF5E6' }}>
      {/* Header */}
      <Header
        style={{
          backgroundColor: '#FFFAF0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.06)',
          borderBottom: '1px solid #DEB887',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
            color: '#8B4513',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          🥐 配方資料庫
        </Title>

        {/* 手機版選單按鈕 */}
        <Button
          className="md:hidden"
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleDrawer}
        />
      </Header>

      <Layout>
        {/* 桌面版側邊欄 */}
        <Sider
          width={240}
          breakpoint="md"
          collapsedWidth={0}
          className="hidden md:block"
          style={{
            backgroundColor: '#FFFAF0',
            boxShadow: '2px 0 8px rgba(139, 69, 19, 0.04)',
            borderRight: '1px solid #FAEBD7',
          }}
        >
          <Navigation currentPage={currentPage} onPageChange={onPageChange} />
        </Sider>

        {/* 手機版抽屜選單 */}
        <Drawer
          title="選單"
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Navigation currentPage={currentPage} onPageChange={onPageChange} />
        </Drawer>

        {/* 主要內容區 */}
        <Content
          style={{
            padding: '24px',
            backgroundColor: '#FDF5E6',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
