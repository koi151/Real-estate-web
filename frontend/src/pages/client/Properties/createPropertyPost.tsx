import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Spin, Steps, theme } from 'antd';
import { FcMoneyTransfer } from "react-icons/fc";
import { IoBanOutline } from 'react-icons/io5';

import NoPermission from '../../../components/admin/NoPermission/noPermission';
import CreatePropertyForm from '../../../components/client/CreatePropertyForm/createPropertyForm';
import ChooseOptions from './chooseOptions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/stores';
import { setSubmitFirstPage, setSubmitSecondPage } from '../../../redux/reduxSlices/propertyPostSlice';

import './createPropertyPost.scss'
import { useNavigate } from 'react-router-dom';
import clientAccountsService from '../../../services/client/accounts.service';
import propertiesServiceClient from '../../../services/client/properties.service';
import objectToFormData from '../../../helpers/standardizeData';
import CreatePostResult from '../../../components/client/Result/createPostResult';

const CreatePropertyPost: React.FC = () => {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  // testing
  const [loading] = useState<boolean>(false); // tempo test
  const [accessAllowed] = useState<boolean>(true); // tempo test
  const postInfo = useSelector((state: RootState) => state.propertyPost); // testing only

  // modal display
  const [outOfBalanceModalOpen, setOutOfBalanceModalOpen] = useState<boolean>(false);

  const allowStep2 = useSelector((state: RootState) => state.propertyPost.allowStep_2);
  const allowStep3 = useSelector((state: RootState) => state.propertyPost.allowStep_3);
  const currentUser = useSelector((state: RootState) => state.clientUser);

  // create post steps
  const steps = [
    {
      title: 'Fill basic information',
      content: <CreatePropertyForm key="create-property" />,
    },
    {
      title: 'Select posting services and payment',
      content: <ChooseOptions key="choose-options" />,
    },
    {
      title: 'Pending post',
      content: <CreatePostResult />,
    },
  ];

  const next = () => {
    if (current === 0) { // Waiting for permission to proceed to the next page after validation has ended.
      dispatch(setSubmitFirstPage(true));

    } else if (current === 1) {
      dispatch(setSubmitSecondPage(true));

    } else {
      setCurrent(current + 1) 
    }
    return;
  };
  
  // Process to step 2 when allowed
  useEffect(() => { 
    if (allowStep2 || allowStep2 === undefined) setCurrent(current + 1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowStep2])


  // Process to step 3 when allowed
  useEffect(() => { 
    const updateAccount = async () => {
      if (!currentUser._id) 
        return message.error('Cannot get account id, please try to reload page again');

      console.log('check: currentUser._id, postInfo.totalPayment:', currentUser._id, postInfo.totalPayment)
      const accUpdatedReponse = await clientAccountsService.updateAccountBalance(currentUser._id, postInfo.totalPayment, false);
      if (accUpdatedReponse.code === 200) {
        message.success(`Account has successfully paid ${postInfo.totalPayment}$ for the post`)

        const filteredPostInfo = Object.fromEntries(
          Object.entries(postInfo)
            .filter(([key]) => !['submitFirstPage', 'submitSecondPage', 'allowStep_2', 'allowStep_3', 'totalPayment'].includes(key))
        );

        const formData = objectToFormData(filteredPostInfo);

        const newPostResponse = await propertiesServiceClient.createProperty(formData)

        if (newPostResponse.code === 200) {
          message.success('Your post has been added to moderation queue!')
        } else {
          message.error('Error occurred, can not add post to moderation queue')
        }
      
      } else {
        message.error('Error occurred, can not processing payment')
      }
    }

    // console.log("postInfo.price:", postInfo.price)
    // if (!postInfo.price) return; // waiting for data in Redux updated

    if ((allowStep3 || allowStep3 === undefined) && current === 1) {
      
      if (currentUser.wallet && currentUser.wallet.balance < postInfo.totalPayment) {
        setOutOfBalanceModalOpen(true);
        return;
      } else {
        console.log('updating account');
        updateAccount();
      }

      setCurrent(current + 1);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowStep3])


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
                    <span>${currentUser.wallet?.balance && currentUser.wallet?.balance.toFixed(2)}</span>
                  </div>
                  <div className='d-flex justify-content-between mt-1'>
                    <span>Total payment</span>
                    <span>${postInfo.totalPayment && postInfo.totalPayment.toFixed(2)}</span>
                  </div>
                  {currentUser.wallet && (
                    <div className='d-flex justify-content-between mt-1'>
                      <span>You need to deposit</span>
                      <span>${postInfo.totalPayment && currentUser.wallet.balance &&
                        (postInfo.totalPayment - currentUser.wallet.balance).toFixed(2)}
                      </span>
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