import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/property-categories.controller';

router.get('/category-tree', controller.categoryTree);

export const propertyCategoriesRoutesClient: Router = router;