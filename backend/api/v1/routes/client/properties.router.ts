import { Router } from "express";
import multer from "multer";

import * as controller from '../../controllers/client/properties.controller';
import * as validate from '../../validates/client/property.validate';
import * as uploadCloud from '../../../../middlewares/client/uploadCloud.middleware';

const upload = multer();
const router: Router = Router();


router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.post(
  '/create',
  upload.fields([{ name: 'images', maxCount: 8 }]),
  validate.createProperty,
  uploadCloud.uploadFields,
  controller.createPost
);

export const propertiesRoutes: Router = router;