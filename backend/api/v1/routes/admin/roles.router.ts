import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from '../../controllers/admin/roles.controller';
// import * as validate from '../../validates/admin/property.validate';

router.get('/', controller.index);

export const RolesRoutes: Router = router;