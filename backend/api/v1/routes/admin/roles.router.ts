import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from '../../controllers/admin/roles.controller';
// import * as validate from '../../validates/admin/property.validate';

router.get('/', controller.index);

router.delete('/delete/:roleId', controller.singleDelete);

export const RolesRoutes: Router = router;