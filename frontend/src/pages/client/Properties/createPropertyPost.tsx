import React, { useState } from 'react';
import { Button, message, Spin, Steps, theme } from 'antd';
import NoPermission from '../../../components/admin/NoPermission/noPermission';
import CreateProperty from './create';
import ChooseOptions from './chooseOptions';

const steps = [
  {
    title: 'Fill basic information',
    content: <CreateProperty key="create-property" />,
  },
  {
    title: 'Second',
    content: <ChooseOptions key="choose-options" />,
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

const CreatePropertyPost: React.FC = () => {
  const { token } = theme.useToken();

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [accessAllowed, setAccessAllowed] = useState(true);

  const next = () => {
    setCurrent(current + 1);
  };

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