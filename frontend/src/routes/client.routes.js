import LayOutDefaultClient from "../components/client/Layouts/layoutDefault";

import Properties from "../pages/client/Properties/properties";
import PropertyDetail from "../pages/client/Properties/detail";

import RegisterAndLogin from "../pages/client/RegisterAndLogin/registerLogin.tsx";

import PageNotFound from "../components/shared/PageNotFound/pageNotFound";

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
      {
        path: '/auth/login',
        element: <RegisterAndLogin />
      },
      {
        path: '/auth/register',
        element: <RegisterAndLogin isRegisterPage/>
      }
    ]
  }, 
  {
    path: '*',
    element: <PageNotFound />,
  }
]