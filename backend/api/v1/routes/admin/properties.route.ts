import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from '../../controllers/admin/properties.controller';
import * as validate from '../../validates/admin/property.validate';
import * as uploadCloud from '../../../../middlewares/admin/uploadCloud.middleware'

const upload = multer();

router.get('/', controller.index);
router.get('/detail/:propertyId', controller.detail)

router.post(
  '/create',
  upload.fields([{ name: 'images', maxCount: 8 }]),
  validate.createPost,
  uploadCloud.uploadFields,
  controller.createPost
);

router.patch(
  '/edit/:propertyId', 
  upload.fields([{ name: 'images', maxCount: 8 }]),
  validate.createPost,
  uploadCloud.uploadFields,
  controller.editPatch
);
router.patch('/change-status/:status/:propertyId', controller.changeStatus);
router.patch('/multi-change', controller.multiChange);

router.delete('/delete/:propertyId', controller.singleDelete);

export const propertiesRoutes: Router = router;