import { Router } from "express";

const router: Router = Router();

import * as controller from '../../controllers/client/order.controller';

router.post('/deposit/vnpay/create-payment-url', controller.createPaymentUrl);



export const orderRoutes: Router = router;