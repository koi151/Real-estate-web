import React from 'react';

import LayoutDefault from "../components/admin/Layouts/layoutDefault";

import DashBoard from "../pages/admin/Dashboard/dashboard";

import Properties from "../pages/admin/Properties/properties";
import PropertyDetail from "../pages/admin/Properties/detail";
import CreateProperty from "../pages/admin/Properties/create";
import EditProperty from "../pages/admin/Properties/edit";

import PropertyCategories from "../pages/admin/PropertyCategories/propertyCategories";
import PropertyCategoriesDetail from "../pages/admin/PropertyCategories/detail";
import EditPropertyCategories from "../pages/admin/PropertyCategories/edit";
import CreatePropertyCategory from "../pages/admin/PropertyCategories/create";

import AdminRoles from "../pages/admin/Roles/roles";
import AdminRoleDetail from "../pages/admin/Roles/detail";
import CreateAdminRole from "../pages/admin/Roles/create";
import EditAdminRole from "../pages/admin/Roles/edit";

import AdminAccounts from "../pages/admin/AdminAccounts/accounts";
import AdminAccountsDetail from "../pages/admin/AdminAccounts/detail";
import CreateAdminAccounts from "../pages/admin/AdminAccounts/create";
import EditAdminAccounts from "../pages/admin/AdminAccounts/edit";

import RegisterAndLogin from "../pages/admin/RegisterAndLogin/adminRegisterLogin";

import PageNotFound from "../components/shared/PageNotFound/pageNotFound";
import ProtectedRoute from "../components/shared/ProtectedRoute/protectedRoute";
import { RouteObject } from "react-router-dom";

// Updated routes:
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: 
      <ProtectedRoute userType='admin'>
        <LayoutDefault />
      </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <DashBoard />
      },
      {
        path: "properties",
        element: <Properties />,
      },
      {
        path: 'properties/detail/:id',
        element: <PropertyDetail />
      },
      {
        path: 'properties/create',
        element: <CreateProperty />
      },
      {
        path: 'properties/edit/:id',
        element: <EditProperty />
      },
      {
        path: 'property-categories',
        element: <PropertyCategories />
      },
      {
        path: 'property-categories/detail/:id',
        element: <PropertyCategoriesDetail />
      },
      {
        path: 'property-categories/create',
        element: <CreatePropertyCategory />
      },
      {
        path: 'property-categories/edit/:id',
        element: <EditPropertyCategories />
      },
      {
        path: 'roles',
        element: <AdminRoles />
      },
      {
        path: 'roles/create',
        element: <CreateAdminRole />
      },
      {
        path: 'roles/edit/:id',
        element: <EditAdminRole />
      },
      {
        path: 'roles/detail/:id',
        element: <AdminRoleDetail />
      },
      {
        path: 'admin-accounts',
        element: <AdminAccounts />
      },
      {
        path: 'admin-accounts/detail/:id',
        element: <AdminAccountsDetail />
      },
      {
        path: 'admin-accounts/create',
        element: <CreateAdminAccounts />
      },
      {
        path: 'admin-accounts/edit/:id',
        element: <EditAdminAccounts />
      },
    ],
  },
  {
    path: '/admin/auth/login',
    element: <RegisterAndLogin isRegisterPage={false} />
  },
  {
    path: '/admin/auth/register',
    element: <RegisterAndLogin isRegisterPage/>
  },
  {
    path: '*',
    element: <PageNotFound />,
  }
];
