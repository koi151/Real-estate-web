import { Menu } from "antd";
import { DashboardOutlined, FileOutlined, LockOutlined, SettingOutlined } 
        from '@ant-design/icons'
import { Link, useLocation } from "react-router-dom";
import './siderMenu.scss'

function SiderMenu() {
  const location = useLocation();

  const items = [
    {
        key: 'Dashboard',
        label: <Link to={'/admin/dashboard'}>Dashboard</Link>,
        icon: <DashboardOutlined className="sider-icon" />,
    },
    {
        key: 'properties',
        label: <Link to={'/admin/properties'}>Properties</Link>,
        icon: <SettingOutlined className="sider-icon"/>
    },
    {
        key: 'categories',
        label: <Link to={'/admin/categories'}>Categories</Link>,
        icon: <SettingOutlined className="sider-icon"/>
    },
    {
        key: 'CRM',
        label: 'CRM',
        icon: <FileOutlined className="sider-icon"/>,
    },
    {
        key: 'Authentication',
        label: 'Authentication',
        icon: <LockOutlined className="sider-icon"/>,
        children: []
    },
  ]

  return (
    <Menu 
        className="sider-menu"
        theme='dark'
        items={items} 
        mode="inline"
        // defaultOpenKeys={["CRM"]}
        defaultSelectedKeys={location.pathname}
        style={{overflowY: 'auto'}}
    />
  )
}

export default SiderMenu;