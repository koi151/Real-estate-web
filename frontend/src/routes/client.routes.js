import LayOutDefaultClient from "../components/client/Layouts/layoutDefault";

import Properties from "../pages/client/Properties/properties";

import PageNotFound from "../components/PageNotFound/pageNotFound";

export const clientRoutes = [
  {
    path: '/',
    element: <LayOutDefaultClient />,
    children: [
      {
        path: "properties",
        element: <Properties />,
      },
    ]
  }, 
  {
    path: '*',
    element: <PageNotFound />,
  }
]