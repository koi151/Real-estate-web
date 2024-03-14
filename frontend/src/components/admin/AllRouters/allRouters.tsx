import { useRoutes } from 'react-router'; 
import { adminRoutes } from '../../../routes/admin.routes.tsx';
import { clientRoutes } from '../../../routes/client.routes.tsx';

const AllRouter = () => {
  const routes = [
    ...adminRoutes,
    ...clientRoutes
  ];
  const elements = useRoutes(routes);
  return elements;
}

export default AllRouter;
