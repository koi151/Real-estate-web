import { useRoutes } from 'react-router'; 
import { adminRoutes } from '../../routes/admin.routes.js';
import { clientRoutes } from '../../routes/client.routes.js';

const AllRouter = () => {
  const elements = useRoutes(adminRoutes.concat(clientRoutes));
  return elements;
}

export default AllRouter;
