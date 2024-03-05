import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const menuItems = [
  {
    key: 'home',
    label: 'Home'
  },
  {
    key: 'properties',
    label: 'Properties'
  },
  {
    key: 'property-categories',
    label: 'Categories'
  }
]

const LayOutDefaultClient: React.FC = () => {

  const location = useLocation();
  const matchedMenuKey = menuItems.find(item => location.pathname.includes(item.key))?.key;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[matchedMenuKey || 'home']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 10rem' }}>
        <div
          style={{
            padding: "3rem",
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {new Date().getFullYear()} - Created by koi151
      </Footer>
    </Layout>
  );
};

export default LayOutDefaultClient;