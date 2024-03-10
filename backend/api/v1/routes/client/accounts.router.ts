import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/accounts.controller';

router.get('/detail/local', controller.localDetail)

router.get('/avatar/:accountId', controller.getAvatar)

export const accountsRoutesClient: Router = router;