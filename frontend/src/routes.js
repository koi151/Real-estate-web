import LayoutDefault from "./components/Layouts/LayoutDefault/layoutDefault";
import Home from "./pages/Home/home";
import CreateProperty from "./pages/Properties/create";
import PropertyDetail from "./pages/Properties/detail";
import EditProperty from "./pages/Properties/edit";
import Properties from "./pages/Properties/properties";
import PropertyCategories from "./pages/PropertyCategories/PropertyCategories";

export const routes = [
  {
    path: '/admin',
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />
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
      }
    ]
  }
]