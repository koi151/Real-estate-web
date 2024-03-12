import React, { useEffect } from 'react';
import { memo, useState } from "react";
import { Layout, message } from 'antd';
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate } from 'react-router-dom';
import { MenuUnfoldOutlined } from '@ant-design/icons';

import AccountHeader from '../../shared/AccountHeader/accountHeader';
import SiderMenu from "../SiderMenu/siderMenu";
// import MiniNotification from "../../MiniNotification/miniNotification";

import logo from '../../../assets/images/logo.png';
import logoFold from '../../../assets/images/logo-fold.png';
import './layoutDefault.scss';
import { useDispatch } from 'react-redux';
import { setAdminUser } from '../../../redux/reduxSlices/adminUserSlice';
import adminAccountsService from '../../../services/admin/accounts.service';

const LayOutDefault: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await adminAccountsService.getSingleAccountLocal();
        if (response.code === 200 && response.user) {
          dispatch(setAdminUser(response.user));
        }
        
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate(`/admin/auth/login`);
        } else {
          console.error('Error occurred while fetching user data:', err);
        }
      }
    };
  
    fetchUserData();

    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            </ul>
            <ul className="nav-right d-flex align-items-center">
              <span className="nav-right__icon-notify">
                {/* <MiniNotification /> */}
              </span>
              <AccountHeader userType='admin' navigateTo='/admin/auth/login'/>
            </ul>
          </div>
        </header>
      </Layout>
      <Layout>
        <Sider 
          className="layout__sider" collapsed={collapsed}
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