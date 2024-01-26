import React from "react";
import { Menu } from "antd";
import { DashboardOutlined, SettingOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

import './siderMenu.scss';

interface MenuItem {
  key: string;
  label: JSX.Element | string;
  icon: JSX.Element;
  children?: MenuItem[];
}

const SiderMenu: React.FC = () => {

  const items: MenuItem[] = [
    { key: 'Dashboard', label: <Link to={'/admin/dashboard'}>Dashboard</Link>, icon: <DashboardOutlined className="sider-icon" /> },
    { key: 'Properties', label: <Link to={'/admin/properties'}>Properties</Link>, icon: <SettingOutlined className="sider-icon" /> },
    { key: 'Categories', label: <Link to={'/admin/property-categories'}>Categories</Link>, icon: <SettingOutlined className="sider-icon" /> },
    { key: 'CRM', label: 'CRM', icon: <SettingOutlined className="sider-icon" /> },
    { key: 'Authentication', label: 'Authentication', icon: <LockOutlined className="sider-icon" />, children: [] },
  ];

  const menuItems = items.map(item => ({
    ...item,
    children: item.children && item.children.map(child => ({ ...child })),
  }));

  return (
    <Menu
      className="sider-menu"
      theme='dark'
      mode="inline"
      defaultSelectedKeys={['Properties']}
      style={{ overflowY: 'auto' }}
      items={menuItems}
    />
  );
}

export default SiderMenu;
