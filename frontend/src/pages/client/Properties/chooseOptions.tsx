import { Badge, Card, Col, Form, Row, Segmented, Space, Spin, Switch, Tag } from "antd";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import PostType from "../../../components/client/PostType/postType";

import ExpireTimePicker from "../../../components/admin/ExpireTimePicker/expireTimePicker";
import PushingPostBox from "../../../components/client/PushingPostBox/pushingPostBox";

import './chooseOptions.scss'
import { AiOutlineReload } from "react-icons/ai";


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
                        <div className="d-flex ml-5" style={{width: '100%', marginTop: '-2rem'}}>
                          <ExpireTimePicker expireTimeRequest={expireDateTime}/>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    title="Utilities"
                    className="custom-card mt-5" 
                  >
                    <Row gutter={16}>
                      <Col span={24} className="d-flex align-items-center" style={{ width: "100%"}}>
                        <div className="push-box-intro">
                          <div className="push-box-intro__icon-wrapper">
                            <MdKeyboardDoubleArrowUp className="push-box-intro__icon-wrapper--icon"/>
                          </div>
                          <div className="push-box-intro__box">
                            <span className="push-box-intro__box--title">
                              Automatic pushing post package
                              <Tag color="#f50" className="tag">New</Tag>
                            </span>
                            <div className="push-box-intro__box--desc">
                              Post news will be automatically push every 24 hours.
                              <br />
                              First push: After property post displayed for 24 hours.
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <PushingPostBox 
                          multiple={3} pushTimes={3}
                          defaultPrice={1.99}
                          promoPercentage={10}
                        />
                      </Col>
                      <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <PushingPostBox 
                          multiple={6} pushTimes={6}
                          defaultPrice={3.99}
                          promoPercentage={20}
                        />
                      </Col>
                      <div className="auto-post-box">
                        <div className="d-flex align-items-center">
                          <div className="auto-post-box__icon-wrapper">
                            <AiOutlineReload className="auto-post-box__icon-wrapper--icon"/>
                          </div>
                          <div className="auto-post-box__txt-wrapper">
                            <div className="auto-post-box__txt-wrapper--title">
                              Auto repost
                            </div>
                            <div className="auto-post-box__txt-wrapper--desc">
                              The post will be automatically repost as soon as it expires. 
                              Each time it is repost, the system will only deduct the fee for that repost.
                            </div>
                          </div>
                        </div>
                        <Switch className="mt-5 mr-5"/>
                      </div>
                    </Row>
                  </Card>

                  <Card title='Payment' className="custom-card payment-card mt-5">
                    <Row gutter={16}>
                      <Col span={24}>
                        <div className="section-one">
                          <div className="section-one__left">
                            <span>Post type</span>
                            <span>Unit price / day</span>
                            <span>Expire time</span>
                          </div>
                          <div className="section-one__right">
                            <span>Post type</span>
                            <span>Unit price / day</span>
                            <span>Expire time</span>
                          </div>
                        </div>

                        <div className="line" style={{margin: "2rem 0"}} />

                        <div className="section-two">
                          <div className="section-two__left">
                            <span>Post fee</span>
                            <span>Auto pushing post package</span>
                          </div>
                          <div className="section-two__right">
                            <span>Post fee</span>
                            <span>0</span>
                          </div>
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