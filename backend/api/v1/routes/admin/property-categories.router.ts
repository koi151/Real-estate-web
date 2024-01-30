import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from '../../controllers/admin/property-categories.controller';
// import * as validate from '../../validates/admin/property.validate';
import * as uploadCloud from '../../../../middlewares/admin/uploadCloud.middleware'

const upload = multer();

router.get('/', controller.index);
router.get('/detail/:categoryId', controller.detail)

// router.post(
//   '/create',
//   upload.fields([{ name: 'images', maxCount: 8 }]),
//   validate.createPost,
//   uploadCloud.uploadFields,
//   controller.createPost
// );

router.patch(
  '/edit/:categoryId', 
  upload.fields([{ name: 'images', maxCount: 8 }]),
  // validate.createPost,
  uploadCloud.uploadFields,
  controller.editPatch
);

router.patch('/change-status/:status/:propertyId', controller.changeStatus);
// router.patch('/multi-change', controller.multiChange);

router.delete('/delete/:categoryId', controller.singleDelete);

export const propertyCategoriesRoutes: Router = router;