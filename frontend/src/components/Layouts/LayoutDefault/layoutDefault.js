import { memo, useState } from "react";
import { Layout } from 'antd';
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Outlet } from 'react-router-dom';
// import MiniNotification from "../../MiniNotification/miniNotification";
import SiderMenu from "../../SiderMenu/siderMenu";

import { MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons'
import logo from '../../../assets/images/logo.png';
import logoFold from '../../../assets/images/logo-fold.png';
import './layoutDefault.scss';

function LayOutDefault() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout className="layout">
        <header className="layout__header">
          <div className={"layout__logo " + (collapsed && "layout__logo--fold")}>
            <img src={collapsed ? logoFold : logo} alt='Logo'/>
          </div>
          <div className="layout__nav">
            <ul className="nav-left">
              <span className="nav-left__icon-collapse" onClick={() => setCollapsed(!collapsed)}>
                <MenuUnfoldOutlined />
              </span>
              <span className="nav-left__icon-search">
                <SearchOutlined />
              </span>
            </ul>
            <ul className="nav-right">
              <span className="nav-right__icon-notify">
              {/* <MiniNotification /> */}
              </span>
            </ul>
          </div>
        </header>
      </Layout>
      <Layout>
        <Sider className="layout__sider" collapsed={collapsed}
               breakpoint="lg" onBreakpoint={(broken) => setCollapsed(broken)}
               style={{overflowY: 'auto'}}
        >
          <SiderMenu />
        </Sider>
        <Content className={"layout__content " + (collapsed && `layout__content--full`)}>
          <Outlet />
        </Content>
      </Layout>
    </>
  )
}

export default memo(LayOutDefault);