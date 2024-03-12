import React, { useEffect } from 'react';
import { Button, Layout, Menu, message, theme } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import HeaderLogo from '../../../assets/images/logo-dark.png'
import { useDispatch } from 'react-redux';

import { setListingType } from '../../../redux/reduxSlices/filtersSlice';

import './layoutDefault.scss'
import AccountHeader from '../../shared/AccountHeader/accountHeader';
import clientAccountsService from '../../../services/client/accounts.service';
import { setClientUser } from '../../../redux/reduxSlices/clientUserSlice';

const { Header, Content, Footer } = Layout;


const LayOutDefaultClient: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/properties',
      label: 'Home',
      action: () => dispatch(setListingType(undefined))
    },
    {
      key: '/properties?listingType=forSale',
      label: 'Real estate for sale',
      action: () => dispatch(setListingType('forSale'))
    },
    {
      key: '/properties?listingType=forRent',
      label: 'Real estate for rent',
      action: () => dispatch(setListingType('forRent'))
    }
  ];

  const matchedMenuKey = menuItems.find(item => location.pathname.includes(item.key))?.key;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await clientAccountsService.getSingleAccountLocal();
        if (response.code === 200 && response.user) {
          dispatch(setClientUser(response.user));
        }
        
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate(`/auth/login`);
        } else {
          console.error('Error occurred while fetching user data:', err);
        }
      }
    };
  
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Layout className='client-layout'>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: "#fff"
        }}
      >
        <div className='menu-wrapper'>
          <div className='menu-wrapper__left'>
            <div className='logo-wrapper'>
              <img className="logo-wrapper--logo" src={HeaderLogo} alt='header logo' />
            </div>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={[matchedMenuKey || 'home']}
              style={{ flex: 1, minWidth: 0 }}
            >
              {menuItems.map(item => (
                <Menu.Item key={item.key} onClick={item.action}>
                  <Link to={item.key}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </div>
          <div className='menu-wrapper__right'>
            <AccountHeader userType='client' navigateTo='/auth/login'/>
            <Button className='menu-wrapper__right--create-post'>
              <Link to='/properties/create'>
                Create post
              </Link>
            </Button>
          </div>
        </div>
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
