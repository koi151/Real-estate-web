import { Badge, Card, Col, Form, Row, Segmented, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import PostType from "../../../components/client/PostType/postType";

import './chooseOptions.scss'
import ExpireTimePicker from "../../../components/admin/ExpireTimePicker/expireTimePicker";

interface OptionsType {
  label: React.ReactNode;
  value: string;
  active?: boolean;
}

const ChooseOptions: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [accessAllowed, setAccessAllowed] = useState(true);

  const [activePostType, setActivePostType] = useState<string>('');
  const [expireDateTime, setExpireDateTime] = useState<string>('');

  const postTypeOptions: OptionsType[] = [
    {
      label: (
        <PostType 
          title="Default" 
          color='grey'
          height="18rem"
          pricePerDay="0.99$" 
          active={activePostType === 'default'}
          minView={9}
          displaySelect alignCenter
        />
      ),
      value: 'default',
      active: activePostType === 'default',
    },
    {
      label: (
        <PostType 
          title="Premium" 
          color="purple"
          height="18rem"
          pricePerDay="4.99$" 
          active={activePostType === 'premium'}
          minView={19}
          displaySelect alignCenter
        />
      ),
      value: 'premium',
      active: activePostType === 'premium',
    },
    {
      label: (
        <PostType 
          title="Exclusive" 
          height="18rem"
          color="yellow"
          pricePerDay="10.99$" 
          active={activePostType === 'exclusive'}
          minView={49}
          alignCenter displaySelect
        />
      ),
      value: 'exclusive',
      active: activePostType === 'exclusive',
    },
  ];

  const expireTimeOptions: OptionsType[] = [
    {
      label: (
        <PostType 
          title="10 day" 
          height="5.5rem"
          pricePerDay="0.39$" 
        />
      ),
      value: '10',
    },
    {
      label: (
        <PostType 
          title="15 day" 
          height="5.5rem"
          pricePerDay="0.32$" 
        />
      ),
      value: '15',
    },
    {
      label: (
        <PostType 
          title="30 day" 
          height="5.5rem"
          pricePerDay="0.29$" 
        />
      ),
      value: '30',
    },
  ];

  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <div className="options-wrapper"> 
              <Form 
                layout="vertical" 
                // onFinish={onFinishForm}
                method="POST"
                encType="multipart/form-data"
                style={{ width: "80%", marginTop: '4rem'}}
                // validateMessages={validateCreatePostClient}
              >
                <Badge.Ribbon 
                  text={<Link to="/admin/properties">Back</Link>} 
                  color="purple" className="custom-ribbon"
                >
                  <Card
                    title="Configure post"
                    className="custom-card" 
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label={
                            <Space className="d-flex align-items-center">
                              <span>Choose post type:</span>
                              {/* <IoBedOutline /> */}
                            </Space>
                          }
                          // name="bedrooms"
                        >
                          <Segmented
                            className="options-wrapper__post-segmented"
                            options={postTypeOptions}
                            onChange={(newVal: string) => setActivePostType(newVal)}
                          />
                        </Form.Item>
                      </Col>

                      <div className='line'></div>

                      <Col span={24}>
                        <Form.Item
                          label={
                            <Space className="d-flex flex-column">
                              <span>Choose expire time:</span>
                            </Space>
                          }
                        >
                          <Segmented
                            className="options-wrapper__post-segmented"
                            options={expireTimeOptions}
                            onChange={(value: string) => setExpireDateTime(value)}
                          />
                        </Form.Item>
                        <div className="d-flex" style={{width: '100%'}}>
                          <ExpireTimePicker expireTimeRequest={expireDateTime}/>
                          </div>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              </Form>
            </div>
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
  )
}

export default ChooseOptions