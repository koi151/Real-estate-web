import { Router } from "express";
const router: Router = Router();

import * as controller from '../../controllers/admin/properties.controller';
import * as validate from '../../validates/admin/property.validate'

router.get('/', controller.index);

router.get('/detail/:propertyId', controller.detail)

router.post(
  '/create',
  validate.createPost, 
  controller.createPost
);

router.patch('/edit/:propertyId', controller.editPatch);
router.patch('/change-status/:status/:propertyId', controller.changeStatus);
router.patch('/multi-change', controller.multiChange);

router.delete('/delete/:propertyId', controller.singleDelete);

export const propertiesRoutes: Router = router;