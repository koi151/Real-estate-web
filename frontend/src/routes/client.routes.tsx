import React from 'react';
import { RouteObject } from 'react-router-dom';
import LayOutDefaultClient from "../components/client/Layouts/layoutDefault";
import Properties from "../pages/client/Properties/properties";
import PropertyDetail from "../pages/client/Properties/detail";
import RegisterAndLogin from "../pages/client/RegisterAndLogin/registerLogin";
import PageNotFound from "../components/shared/PageNotFound/pageNotFound";
import ProtectedRoute from '../components/shared/ProtectedRoute/protectedRoute';

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
        path: 'properties/detail/:id',
        element: <PropertyDetail />
      },
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