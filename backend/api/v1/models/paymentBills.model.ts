import mongoose from 'mongoose';

const PaymentBillSchema = new mongoose.Schema(
  {
    userId: String,
    amount: Number,
    orderInfo: String,
    bankCode: String,
    transactionNo: String,
    payDate: String,
    status: String, 
    deleted: {
      type: Boolean,
      default: false
    },
  }
);

const PaymentBill = mongoose.model("paymentBills", PaymentBillSchema, "payment-bills");

export default PaymentBill;


