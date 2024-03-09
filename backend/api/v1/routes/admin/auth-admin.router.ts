import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/admin/auth-admin.controller';

router.post('/login', controller.loginPost);

router.post('/refresh', controller.refreshToken);

export const authRoutes: Router = router;