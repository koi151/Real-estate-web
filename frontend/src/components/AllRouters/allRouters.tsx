import { useRoutes } from 'react-router'
import { routes } from '../../routes.js';

const AllRouter = () => {
  const elements = useRoutes(routes)
  return elements;
}

export default AllRouter;
