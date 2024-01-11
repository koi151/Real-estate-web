import LayoutDefault from "./components/Layouts/LayoutDefault/layoutDefault";
import Home from "./pages/Home/home";
import PropertyDetail from "./pages/Properties/detail";
import Properties from "./pages/Properties/properties";

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
      }
    ]
  }
]