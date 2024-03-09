import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from '../../controllers/client/properties.controller';

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

export const propertiesRoutes: Router = router;