import LayoutDefault from "../components/admin/Layouts/layoutDefault";

import DashBoard from "../pages/admin/Home/dashboard";

import Properties from "../pages/admin/Properties/properties";
import PropertyDetail from "../pages/admin/Properties/detail";
import CreateProperty from "../pages/admin/Properties/create";
import EditProperty from "../pages/admin/Properties/edit";

import PropertyCategories from "../pages/admin/PropertyCategories/propertyCategories";
import PropertyCategoriesDetail from "../pages/admin/PropertyCategories/detail";
import EditPropertyCategories from "../pages/admin/PropertyCategories/edit";
import CreatePropertyCategory from "../pages/admin/PropertyCategories/create";

import AdminRoles from "../pages/Roles/roles";
import AdminRoleDetail from "../pages/Roles/detail";
import CreateAdminRole from "../pages/Roles/create";
import EditAdminRole from "../pages/Roles/edit";

import AdminAccounts from "../pages/admin/Accounts/accounts";
import AdminAccountsDetail from "../pages/admin/Accounts/detail";
import CreateAdminAccounts from "../pages/admin/Accounts/create";
import EditAdminAccounts from "../pages/admin/Accounts/edit";
import AdminRegister from "../pages/admin/RegisterAndLogin/adminRegisterLogin";

import PageNotFound from "../components/shared/PageNotFound/pageNotFound";

export const adminRoutes = [
  {
    path: '/admin',
    element: <LayoutDefault />,
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
        path: '/admin/auth/login',
        element: <AdminRegister />
      },
      {
        path: '/admin/auth/register',
        element: <AdminRegister isRegisterPage/>
      }
    ]
  }, 
  {
    path: '*',
    element: <PageNotFound />,
  }
]