import LayoutDefault from "./components/admin/LayoutDefault/layoutDefault";
import DashBoard from "./pages/Dashboard/dashboard";
import CreateProperty from "./pages/Properties/create";
import PropertyDetail from "./pages/Properties/detail";
import EditProperty from "./pages/Properties/edit";
import Properties from "./pages/Properties/properties";
import PropertyCategoriesDetail from "./pages/PropertyCategories/detail";
import EditPropertyCategories from "./pages/PropertyCategories/edit";

import PropertyCategories from "./pages/PropertyCategories/propertyCategories.tsx";
import RoleDetail from "./pages/Roles/detail";
import EditRole from "./pages/Roles/edit";
import AdminRoles from "./pages/Roles/roles";


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
        path: 'property-categories/edit/:id',
        element: <EditPropertyCategories />
      },
      {
        path: 'roles',
        element: <AdminRoles />
      },
      {
        path: 'roles/edit/:id',
        element: <EditRole />
      },
      {
        path: 'roles/detail/:id',
        element: <RoleDetail />
      }
    ]
  }
]