import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/accounts.controller';

router.get('/detail/:id', controller.detail);
router.get('/my-detail', controller.localDetail);

router.patch('/favorite-posts/:accountId', controller.favorites);
router.patch('/update-balance/:accountId', controller.patchBalance);

export const accountsRoutesClient: Router = router;