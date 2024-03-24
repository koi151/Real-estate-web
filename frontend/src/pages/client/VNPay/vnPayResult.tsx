import { Button, Result, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import clientAccountsService from "../../../services/client/accounts.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";
import moment from "moment";

const VNPayResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const accountId = useSelector((state: RootState) => state.clientUser._id);
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [transactionCode, setTransactionCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  const [transactionSucceed, setTransactionSucceed] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.delete('vnp_SecureHash');
    updatedSearchParams.delete('vnp_TmnCode');
    updatedSearchParams.delete('vnp_TxnRef');

    let params: any = {}
    for (const [key, value] of updatedSearchParams.entries()) {
      if (key !== 'vnp_BankCode') {
        params[key] = value;
      }
    }

    setDepositAmount(parseInt(params.vnp_Amount as string) / 2500000);
    setTransactionCode(params.vnp_TransactionNo);
    setPaymentMethod(params.vnp_CardType);

    const formattedDate = moment(params.vnp_PayDate, "YYYYMMDDHHmmss").format("DD/MM/YYYY HH:mm:ss");
    setFormattedDate(formattedDate);

    
    if (params.vnp_TransactionStatus === '00') {
      setTransactionSucceed(true);
    } else {
      setTransactionSucceed(false);
    }
    
    navigate({ search: updatedSearchParams.toString() });

  }, [searchParams, navigate]);


  useEffect(() => {
    const updateBalance = async () => {
      try {
        if (!accountId || !depositAmount)
          return;

        const deposit: boolean = true;
        const response = await clientAccountsService.updateAccountBalance(accountId, depositAmount, deposit);

        if (response.code === 200) {
          message.success(`You have deposited ${depositAmount}$ to your account!`, 3)
          
        } else {
          message.error("Error occurred, can not update account balance. Please contact admin", 3);
          console.log(message.error);
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          message.error("Error occurred while processing to payment page.");
          console.log('Error occurred while updating account balance:', err);        
        }
      }
    }

  updateBalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAmount, accountId])

  return (
    <>
      {transactionSucceed ? (
        <Result
          style={{height: "70vh"}}
          status="success"
          title="Successfull Transaction!"
          subTitle={
            <>
              <div style={{fontSize: '1.6rem'}}>
                You have successfully deposited <b>{depositAmount} VND</b> to your account,
                thank you for your purchase!
              </div>
              <div className="mt-3">
                <div>Transaction code: {transactionCode}</div>
                <div>Payment method: {paymentMethod}</div>
                <div>Deposit amount: {depositAmount} VND</div>
                <div>Date purchased: {formattedDate}</div>
              </div>
            </>
          }          
          extra={[
            <Link to='/properties'>
              <Button type="primary" key="console">
                Back to home
              </Button>
            </Link>,
            
            <Link to='/deposit'>
              <Button key="buy">Deposit again</Button>,
            </Link>
          ]}
        />
        ) : (
          <>
            <Result
              style={{height: "70vh"}}
              status="error"
              title="Transaction Failed"
              subTitle="Please check and modify the your information before resubmitting."
              extra={[
                <Link to='/properties'>
                  <Button type="primary" key="console">
                    Back to home
                  </Button>
                </Link>,
                <Link to='/deposit'>
                  <Button key="buy">Deposit again</Button>,
                </Link>
              ]}
            />
          </>
        )
      }
    </>  
  )
}

export default VNPayResult;

