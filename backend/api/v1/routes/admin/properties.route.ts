import { Router } from "express";
const router: Router = Router();

import * as controller from '../../controllers/admin/properties.controller';

router.get('/', controller.index);

router.get('/detail/:propertyId', controller.detail)

router.post('/create', controller.createPost);

router.patch('/edit/:propertyId', controller.editPatch);

router.delete('/delete/:propertyId', controller.singleDelete);

export const propertiesRoutes: Router = router;