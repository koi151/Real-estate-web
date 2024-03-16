import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/accounts.controller';

router.get('/detail/:id/:accountType', controller.detail);
router.get('/detail-local', controller.localDetail);

router.patch('/favorite-posts/:id', controller.favorites);

export const accountsRoutesClient: Router = router;