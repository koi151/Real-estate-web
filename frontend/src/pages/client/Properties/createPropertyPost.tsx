import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Spin, Steps, theme } from 'antd';
import { FcMoneyTransfer } from "react-icons/fc";
import { IoBanOutline } from 'react-icons/io5';

import NoPermission from '../../../components/admin/NoPermission/noPermission';
import CreatePropertyForm from '../../../components/client/CreatePropertyForm/createPropertyForm';
import ChooseOptions from './chooseOptions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/stores';
import { setSubmitSecondPage } from '../../../redux/reduxSlices/propertyPostSlice';

import './createPropertyPost.scss'
import { useNavigate } from 'react-router-dom';

const CreatePropertyPost: React.FC = () => {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  const [loading] = useState<boolean>(false); // tempo test
  const [accessAllowed] = useState<boolean>(true); // tempo test
  const postInfo = useSelector((state: RootState) => state.propertyPost); // testing only

  // modal display
  const [outOfBalanceModalOpen, setOutOfBalanceModalOpen] = useState<boolean>(false);

  const allowNextStep = useSelector((state: RootState) => state.propertyPost.allowNextStep);
  const currentUser = useSelector((state: RootState) => state.clientUser);

  useEffect(() => { // testing
    console.log("postInfo:", postInfo)
  }, [postInfo])

  const steps = [
    {
      title: 'Fill basic information',
      content: <CreatePropertyForm key="create-property" />,
    },
    {
      title: 'Select posting services',
      content: <ChooseOptions key="choose-options" />,
    },
    {
      title: 'Payment and pending post',
      content: 'Last-content',
    },
  ];

  const next = () => {
    if (current === 0) { // Waiting for permission to proceed to the next page after validation has ended.
      // dispatch(setSubmitFirstPage(true));
      setCurrent(current + 1) 


    } else if (current === 1) {
      dispatch(setSubmitSecondPage(true));
      console.log("currentUser.wallet, postInfo.totalPayment:", currentUser.wallet, postInfo.totalPayment)
      if (currentUser.wallet && currentUser.wallet.balance < postInfo.totalPayment) {
        setOutOfBalanceModalOpen(true);
      } else message.error('Error occurred, can not process to payment')

      return;

    } else {
      setCurrent(current + 1) 
    }
    return;
  };
  
  // Process to next page when allowed
  useEffect(() => { 
    if (allowNextStep || allowNextStep === undefined) setCurrent(current + 1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowNextStep])


  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    color: token.colorTextTertiary,
  };

  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <>
              <Steps current={current} items={items} />
              <div style={contentStyle}>
                {steps[current].content}
              </div>
              <div style={{ marginTop: "2.5rem", marginRight: '10rem' }} className='d-flex justify-content-end'>
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="primary" onClick={() => message.success('Processing complete!')}>
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button style={{ margin: '0 1rem' }} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
              </div>
            </>
          ) : (
            <NoPermission permissionType='access' />
          )}

            <Modal 
              className='custom-modal-payment'
              open={outOfBalanceModalOpen} 
              okText="Deposit now"
              onOk={() => navigate('/deposit')} 
              onCancel={() => setOutOfBalanceModalOpen(false)}
            >
              <div className="out-of-balance-wrapper">
                <FcMoneyTransfer className="out-of-balance-wrapper--icon"/>
                <IoBanOutline className='out-of-balance-wrapper--banned-icon'/>
                <b className="out-of-balance-wrapper--title">
                  Account has insufficient funds!             
                </b>
                <div className="out-of-balance-wrapper--desc">
                  Your post has been saved. To publish a post, please add money to your account                  
                </div>
                <div className='d-flex flex-column' style={{width: "85%"}}>
                  <div className='d-flex justify-content-between'>
                    <span>Account balance</span>
                    <span>${currentUser.wallet?.balance}</span>
                  </div>
                  <div className='d-flex justify-content-between mt-1'>
                    <span>Total payment</span>
                    <span>${postInfo.totalPayment}</span>
                  </div>
                  {currentUser.wallet && (
                    <div className='d-flex justify-content-between mt-1'>
                      <span>You need to deposit</span>
                      <span>${postInfo.totalPayment - currentUser.wallet.balance}</span>
                    </div>
                  )}

                </div>
              </div>
            </Modal>
        </>
      ) : (
        <div className='d-flex justify-content-center' style={{width: "100%", height: "100vh"}}>
          <Spin tip='Loading...' size="large">
            <div className="content" />
          </Spin>
        </div>
      )}
    </>
  );
};

export default CreatePropertyPost;