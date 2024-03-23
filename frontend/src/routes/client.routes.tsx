import React from 'react';
import { RouteObject } from 'react-router-dom';
import LayOutDefaultClient from "../components/client/Layouts/layoutDefault";
import Properties from "../pages/client/Properties/properties";
import PropertyDetail from "../pages/client/Properties/detail";
import RegisterAndLogin from "../pages/client/RegisterAndLogin/registerLogin";
import PageNotFound from "../components/shared/PageNotFound/pageNotFound";
import ProtectedRoute from '../components/shared/ProtectedRoute/protectedRoute';
import CreatePropertyPost from '../pages/client/Properties/createPropertyPost';
import DepositMethods from '../pages/client/Deposit/deposit';
import DepositDetail from '../pages/client/Deposit/detail';
import VNPayResult from '../pages/client/VNPay/vnPayResult';

export const clientRoutes: RouteObject[] = [
  {
    path: '/',
    element: 
      <ProtectedRoute userType='client'>
        <LayOutDefaultClient />
      </ProtectedRoute>,
    children: [
      {
        path: "properties",
        element: <Properties />,
      },
      {
        path: 'properties/create',
        element: <CreatePropertyPost />
      },
      {
        path: 'properties/detail/:id',
        element: <PropertyDetail />
      },
      {
        path: 'deposit',
        element: <DepositMethods />
      },
      {
        path: 'order/deposit/vnpay',
        element: <DepositDetail />
      },
      {
        path: 'order/deposit/vnpay/vnpay-return',
        element: <VNPayResult />
      }
    ]
  }, 
  {
    path: '/auth/login',
    element: <RegisterAndLogin isRegisterPage={false} />
  },
  {
    path: '/auth/register',
    element: <RegisterAndLogin isRegisterPage />
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];