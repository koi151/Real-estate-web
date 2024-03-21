import React, { useEffect, useState } from 'react';
import { Button, message, Spin, Steps, theme } from 'antd';
import NoPermission from '../../../components/admin/NoPermission/noPermission';
import CreateProperty from './create';
import ChooseOptions from './chooseOptions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/stores';
import { setSubmitFirstPage, setSubmitSecondPage } from '../../../redux/reduxSlices/propertyPostSlice';

const CreatePropertyPost: React.FC = () => {
  const { token } = theme.useToken();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [loading] = useState<boolean>(false); // tempo test
  const [accessAllowed] = useState<boolean>(true); // tempo test

  // const postInfo = useSelector((state: RootState) => state.propertyPost);
  const allowNextStep = useSelector((state: RootState) => state.propertyPost.allowNextStep);

  // useEffect(() => { // testing
  //   console.log("postInfo:", postInfo)
  // }, [postInfo])

  const steps = [
    {
      title: 'Fill basic information',
      content: <CreateProperty key="create-property" />,
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
      dispatch(setSubmitFirstPage(true));
    } else if (current === 1) {
      console.log('second submit')
      dispatch(setSubmitSecondPage(true));
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