import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/third-party.controller';

router.get('/google-cloud', controller.googleCloudAPI);

router.get('/open-cage', controller.openCageApiKey);

export const thirdPartyRoutes: Router = router;