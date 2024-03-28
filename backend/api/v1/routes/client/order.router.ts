import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/order.controller';

router.post('/deposit/vnpay/create-payment-url', controller.createPaymentUrl);

router.post('/deposit/vnpay/create-bill', controller.billPost);

export const orderRoutes: Router = router;