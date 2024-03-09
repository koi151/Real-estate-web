import { Router } from "express";
import * as controller from '../../controllers/client/auth-client.controller';

const router: Router = Router();

router.post('/login', controller.loginPost);

router.post('/refresh', controller.clientRefreshToken);

export const authRoutesClient: Router = router;