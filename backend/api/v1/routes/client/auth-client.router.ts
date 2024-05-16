import { Router } from "express";
import * as controller from '../../controllers/client/auth-client.controller';
import rateLimit from 'express-rate-limit';

const router: Router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, 
  message: 'Too many login request, please try again later!.',
});

router.get('/logout', limiter, controller.logout);

router.post('/login', controller.loginPost);
router.post('/register', controller.registerPost);
router.post('/refresh', controller.clientRefreshToken);

export const authRoutesClient: Router = router;