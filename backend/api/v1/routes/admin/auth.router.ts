import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/admin/auth.controller';

router.post('/login', controller.loginPost);

router.post('/refresh', controller.refreshToken);

// router.get("/logout", controller.logout);

export const authRoutes: Router = router;