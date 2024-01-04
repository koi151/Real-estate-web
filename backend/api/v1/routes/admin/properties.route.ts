import { Router } from "express";
const router: Router = Router();

import * as controller from '../../controllers/admin/properties.controller';

router.get('/', controller.index);

router.post('/create', controller.createPost);

export const propertiesRoutes: Router = router;