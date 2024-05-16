import { Router } from "express";
import rateLimit from 'express-rate-limit';

const router: Router = Router();

import * as controller from '../../controllers/admin/auth-admin.controller';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, 
  message: 'Too many login request, please try again later!.'
});

router.get('/logout', controller.logout);

router.post('/login', limiter, controller.loginPost);
router.post('/register', controller.registerPost);

router.post('/refresh', controller.refreshToken);

export const authRoutes: Router = router;