import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from '../../controllers/client/properties.controller';

const upload = multer();

router.get('/', controller.index);

export const propertiesRoutes: Router = router;