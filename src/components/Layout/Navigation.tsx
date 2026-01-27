import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, ShoppingOutlined, BookOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首頁',
    },
    {
      key: 'materials',
      icon: <ShoppingOutlined />,
      label: '材料管理',
    },
    {
      key: 'recipes',
      icon: <BookOutlined />,
      label: '配方管理',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    onPageChange(e.key);
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[currentPage]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{
        height: '100%',
        borderRight: 0,
        backgroundColor: '#FFFFFF',
      }}
    />
  );
};

export default Navigation;
