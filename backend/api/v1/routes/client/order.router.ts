import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/order.controller';

router.post('/deposit/vnpay/create-payment-url', controller.createPaymentUrl);

router.get('/deposit/vnpay/vnpay-return', controller.vnPayReturn);

export const orderRoutes: Router = router;