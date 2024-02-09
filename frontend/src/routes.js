import LayoutDefault from "./components/admin/LayoutDefault/layoutDefault";

import DashBoard from "./pages/Home/dashboard";

import Properties from "./pages/Properties/properties";
import PropertyDetail from "./pages/Properties/detail";
import CreateProperty from "./pages/Properties/create";
import EditProperty from "./pages/Properties/edit";

import PropertyCategories from "./pages/PropertyCategories/propertyCategories.tsx";
import PropertyCategoriesDetail from "./pages/PropertyCategories/detail";
import EditPropertyCategories from "./pages/PropertyCategories/edit";
import CreatePropertyCategory from "./pages/PropertyCategories/create";

import AdminRoles from "./pages/Roles/roles";
import AdminRoleDetail from "./pages/Roles/detail";
import CreateAdminRole from "./pages/Roles/create";
import EditAdminRole from "./pages/Roles/edit";

import AdminAccounts from "./pages/Accounts/accounts";
import AdminAccountsDetail from "./pages/Accounts/detail";
import CreateAdminAccounts from "./pages/Accounts/create";
import EditAdminAccounts from "./pages/Accounts/edit";
import AdminRegister from "./pages/Register/adminRegister";


export const routes = [
  {
    path: '/admin',
    element: <LayoutDefault />,
    children: [
      {
        index: true,
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
        path: 'accounts',
        element: <AdminAccounts />
      },
      {
        path: 'accounts/detail/:id',
        element: <AdminAccountsDetail />
      },
      {
        path: 'accounts/create',
        element: <CreateAdminAccounts />
      },
      {
        path: 'accounts/edit/:id',
        element: <EditAdminAccounts />
      },
      {
        path: '/admin/auth/register',
        element: <AdminRegister />
      }
    ]
  }
]