import React from "react";
import { Menu } from "antd";
import { DashboardOutlined, SettingOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
import './siderMenu.scss';

interface MenuItem {
  key: string;
  label: JSX.Element | string;
  icon: JSX.Element;
  children?: MenuItem[];
}

const SiderMenu: React.FC = () => {
  const location = useLocation();

  const items: MenuItem[] = [
    { key: 'Dashboard', label: <Link to={'/admin/dashboard'}>Dashboard</Link>, icon: <DashboardOutlined className="sider-icon" /> },
    { key: 'properties', label: <Link to={'/admin/properties'}>Properties</Link>, icon: <SettingOutlined className="sider-icon" /> },
    { key: 'categories', label: <Link to={'/admin/categories'}>Categories</Link>, icon: <SettingOutlined className="sider-icon" /> },
    { key: 'CRM', label: 'CRM', icon: <SettingOutlined className="sider-icon" /> },
    { key: 'Authentication', label: 'Authentication', icon: <LockOutlined className="sider-icon" />, children: [] },
  ];

  return (
    <Menu 
      className="sider-menu" 
      theme='dark' 
      mode="inline" 
      defaultSelectedKeys={[location.pathname]} 
      style={{ overflowY: 'auto' }} 
    >
      {items.map(item => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
          {item.children && item.children.map(child => (
            <Menu.Item key={child.key} icon={child.icon}>
              {child.label}
            </Menu.Item>
          ))}
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default SiderMenu;
