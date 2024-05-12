import { Request, Response } from "express"
import moment from "moment";
import { sortObject } from "../../../../helpers/sortObj";
import querystring from 'qs'
import crypto from 'crypto'
import PaymentBill from "../../models/paymentBills.model";

type VNPayParams = {
  vnp_Version?: string;
  vnp_Command?: string;
  vnp_TmnCode?: string;
  vnp_Locale?: string;
  vnp_CurrCode?: string;
  vnp_TxnRef?: string;
  vnp_OrderInfo?: string;
  vnp_OrderType?: string;
  vnp_Amount?: number;
  vnp_ReturnUrl?: string;
  vnp_IpAddr?: string | string[];
  vnp_CreateDate?: string;
  vnp_BankCode?: string;
  vnp_SecureHash?: string;
};

// [POST] /deposit/vnpay/create-payment-url
export const createPaymentUrl = async (req: Request, res: Response) => {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const tmnCode = process.env.VNP_TMN_CODE || "";
    const secretKey = process.env.VNP_HASH_SECRET || ""; 
    let vnpUrl = process.env.VNP_URL || ""; 
    const returnUrl = process.env.VNP_RETURN_URL || ""; 

    const orderId = moment(date).format('DDHHmmss');
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;

    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    let vnp_Params: VNPayParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);

    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json({
      code: 200,
      message: 'Created payment url successfully.',
      url: vnpUrl
    })

  } catch (err) {
    console.log('Error occurred in createPaymentUrl controller:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [POST] /deposit/vnpay/create-bill
export const billPost = async (req: Request, res: Response) => {
  try {
    console.log('Bill posting')
    
    const accountId: string | undefined = req.body.accountId;

    if (!accountId) return res.json({
      code: 400,
      message: 'Cannot get account id'
    })

    const pairs = req.body.info.split('&');
    const result: any = {};

    pairs.forEach((pair: any) => {
      const [key, value] = pair.split('=');
      result[key] = decodeURIComponent(value);
    });

    const exchangeRates: number = parseFloat(process.env.VND_TO_USD_EXCHANGE_RATES);
    const amountParsed: number = parseFloat(result.vnp_Amount);
    const amountExchanged: number = amountParsed / (100 * exchangeRates);

    const newBill  = new PaymentBill({
      accountId: req.body.accountId,
      amount: amountExchanged,
      orderInfo: result.vnp_OrderInfo,
      bankCode: result.vnp_BankCode,
      transactionNo: result.vnp_TransactionNo,
      payDate: result.vnp_PayDate,
      status: result.vnp_TransactionStatus === '00' ? 'succeed' : 'failed', 
    })

    await newBill.save();

    if (newBill) {
      res.status(200).json({
        code: 200,
        message: 'Bill created successful'
      })
    } else {
      res.json({
        code: 400,
        message: 'Failed to create bill'
      })
    }

  } catch (err) {
    console.log('Error occurred in createPaymentUrl controller:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [GET] /deposit/vnpay/create-payment-url
export const vnPayReturn = async (req: Request, res: Response) => {
  try {

    let vnpParams = req.query as unknown as VNPayParams;

    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    vnpParams = sortObject(vnpParams);

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASH_SECRET

    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Check if data in db is legit or not and show result

      return res.status(200).json({
        code: 200,
        message: 'Transaction successful',
      })
    } else {
      return res.json({
        code: 400,
        message: 'Transaction failed',
      })
    }

  } catch (err) {
    console.log('Error occurred in createPaymentUrl controller:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};
