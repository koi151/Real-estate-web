import LayOutDefaultClient from "../components/client/Layouts/layoutDefault";

import Properties from "../pages/client/Properties/properties";

import PageNotFound from "../components/PageNotFound/pageNotFound";
import PropertyDetail from "../pages/client/Properties/detail";

export const clientRoutes = [
  {
    path: '/',
    element: <LayOutDefaultClient />,
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
    path: '*',
    element: <PageNotFound />,
  }
]