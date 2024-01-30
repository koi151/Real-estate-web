import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/admin/roles.controller';
// import * as validate from '../../validates/admin/property.validate';

router.get('/', controller.index);
router.get('/detail/:roleId', controller.detail);

router.patch('/edit/:roleId', controller.editPatch);

router.delete('/delete/:roleId', controller.singleDelete);

export const RolesRoutes: Router = router;