import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/admin/roles.controller';
import * as validate from '../../validates/admin/adminRole.validate';

router.get('/', controller.index);
router.get('/titles', controller.roleTitles);
router.get('/detail/:roleId', controller.detail);

router.post(
  '/create',
  validate.createAdminRole, 
  controller.createPost
);

router.patch(
  '/edit/:roleId',
  validate.createAdminRole,  
  controller.editPatch
);

router.delete('/delete/:roleId', controller.singleDelete);

export const rolesRoutes: Router = router;