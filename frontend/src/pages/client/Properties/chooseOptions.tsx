import { Badge, Card, Col, Form, Input, Modal, Row, Segmented, Space, Spin, Switch, Tag } from "antd";
import { MdKeyboardDoubleArrowUp, MdOutlineDiscount } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import PostType from "../../../components/client/PostType/postType";

import ExpireTimePicker from "../../../components/admin/ExpireTimePicker/expireTimePicker";
import PushingPostBox from "../../../components/client/PushingPostBox/pushingPostBox";

import './chooseOptions.scss'
import { AiOutlineReload } from "react-icons/ai";
import { FaAngleRight } from "react-icons/fa";
import { capitalizeString } from "../../../helpers/standardizeData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";
import { setAllowStep3, setPost } from "../../../redux/reduxSlices/propertyPostSlice";
import { PostServices } from "../../../../../backend/commonTypes";

interface PushingPostBoxOption {
  multiple?: number;
  pushTimes?: number;
  defaultPrice?: number;
  discountPercentage?: number;
}

interface OptionsType {
  label: React.ReactNode;
  value: string;
  active?: boolean;
}

const ChooseOptions: React.FC = () => {
  const dispatch = useDispatch();

  // loading & access
  const [loading] = useState<boolean>(false); // testing
  const [accessAllowed] = useState(true); // testing

  // Modal
  const [promotionModalOpen, setPromotionModalOpen] = useState<boolean>(false);

  // Post info 
  const [postFeePerDay, setPostFeePerDay] = useState<number | null>(null);
  const [activePostType, setActivePostType] = useState<string>('');
  const [dayExpireLeft, setDayExpireLeft] = useState<number>(0);
  const [selectedPushingPostBox, setSelectedPushingPostBox] = useState<number | null>(null); 
  const [pushingPostInfo, setPushingPostInfo] = useState<PostServices>({
    defaultPostFeePerDay: null,
    pushTimesLeft: null,
    discountPercentage: null,
  });

  // Redux
  const postInfo = useSelector((state: RootState) => state.propertyPost) 


  useEffect(() => {
    if (postInfo.submitSecondPage) { // check if submit requested or not

      dispatch(setPost({ 
        ...postInfo,
        postType: activePostType,
        postServices: {
          ...pushingPostInfo,
          dayPost: dayExpireLeft
        },
        totalPayment: getTotalPayment()
      }));
      dispatch(setAllowStep3(true));
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postInfo.submitSecondPage])

  const postTypeOptions: OptionsType[] = [
    {
      label: (
        <PostType 
          title="Default" 
          color='grey'
          height="18rem"
          pricePerDay={0.99}
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
          pricePerDay={4.99}
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
          pricePerDay={10.99}
          active={activePostType === 'exclusive'}
          minView={49}
          alignCenter displaySelect
        />
      ),
      value: 'exclusive',
      active: activePostType === 'exclusive',
    },
  ];

  const postTypePricePerDay = (priceArray: number[]) => {
    return activePostType === 'default' ? priceArray[0] 
          : activePostType === 'premium' ? priceArray[1]
          : activePostType === 'exclusive' ? priceArray[2]
          : 0
  } 

  const getPricePerDayPosted = (numberOfDays: number) => {

    switch (numberOfDays) {
      case 10:
        return postTypePricePerDay([0.99, 4.99, 10.99])
      case 15:
        return postTypePricePerDay([0.89, 4.59, 9.99])
      case 30:
        return postTypePricePerDay([0.79, 4.29, 8.99])
      default:
        return null;
    }
  };

  const getPushingPostPrice = (postType: string): number[] =>{
    switch (postType) {
      case 'default':
        return [2.99, 5.99]
      case 'premium':
        return [4.99, 7.99]
      case 'exclusive':
        return [12.99, 23.99]
      default:
        return [];
    }
  }

  const expireTimeOptions: OptionsType[] = [
    {
      label: (
        <PostType 
          title="7 day" 
          height="5.5rem"
          pricePerDay={getPricePerDayPosted(10)} 
        />
      ),
      value: '7',
    },
    {
      label: (
        <PostType 
          title="15 day" 
          height="5.5rem"
          pricePerDay={getPricePerDayPosted(15)} 
        />
      ),
      value: '15',
    },
    {
      label: (
        <PostType 
          title="30 day" 
          height="5.5rem"
          pricePerDay={getPricePerDayPosted(30)} 
        />
      ),
      value: '30',
    },
  ];

  const pushingPostBoxOptions: PushingPostBoxOption[] = [
    {
      multiple: 3, 
      pushTimes: 3,
      defaultPrice: getPushingPostPrice(activePostType)[0],
      discountPercentage: 10
    },
    {
      multiple: 6, 
      pushTimes: 6,
      defaultPrice: getPushingPostPrice(activePostType)[1],
      discountPercentage: 20
    },
  ]

  const handleClickExpireTime = (value: string | number) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    setDayExpireLeft(numericValue);
    setPostFeePerDay(getPricePerDayPosted(numericValue))
  }

  const getPushingPostPackagePrice = (): number | null => {
    if (selectedPushingPostBox === null || selectedPushingPostBox === undefined) return null;
    const { defaultPrice, discountPercentage } = pushingPostBoxOptions[selectedPushingPostBox] || {};
    if (!defaultPrice || !discountPercentage) return null;

    return (defaultPrice * (100 - discountPercentage)) / 100;
  };

  const getTotalPayment = (): number => {
    const pushingPostBoxPrice = selectedPushingPostBox
      ? (getPushingPostPackagePrice()?.toFixed(2) || '0')
      : '0';
  
    const pushingPostBoxPriceNumber = parseFloat(pushingPostBoxPrice);
  
    const postFee: number = postFeePerDay && dayExpireLeft ? postFeePerDay * dayExpireLeft : 0;
  
    const totalPayment = pushingPostBoxPriceNumber + postFee;
    return totalPayment;
  };


  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <div className="options-wrapper"> 
              <Form 
                layout="vertical" 
                method="POST"
                encType="multipart/form-data"
                style={{ width: "75%", marginTop: '4rem'}}
              >
                <Badge.Ribbon 
                  text={<Link to="/properties">Back</Link>} 
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
                            </Space>
                          }
                        >
                          <Segmented
                            defaultValue=""
                            className="options-wrapper__post-segmented"
                            options={postTypeOptions}
                            onChange={(value: string) => setActivePostType(value)}
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
                            defaultValue=""
                            options={expireTimeOptions}
                            onChange={(value: string) => handleClickExpireTime(value)}
                          />
                        </Form.Item>
                        <div className="d-flex ml-5" style={{width: '100%', marginTop: '-2rem'}}>
                          <ExpireTimePicker expireDayRequest={dayExpireLeft}/>
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
                      {pushingPostBoxOptions.map((item, index) => (
                        <Col sm={24} md={12} lg={12} xl={12} xxl={12} key={index}>
                          <PushingPostBox
                            multiple={item.multiple} 
                            pushTimes={item.pushTimes || 0}
                            defaultPrice={item.defaultPrice || 0}
                            discountPercentage={item.discountPercentage}
                            selected={index === selectedPushingPostBox}
                            onClick={() => {
                              setSelectedPushingPostBox(index);
                              setPushingPostInfo({
                                pushTimesLeft: item.pushTimes || 0,
                                defaultPostFeePerDay: item.defaultPrice || 0,
                                discountPercentage: item.discountPercentage || 0,
                              });
                            }}
                          />
                        </Col>
                      ))}
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
                        <div className="block-one">
                          <div className="block-one__left">
                            <span>Post type</span>
                            <span>Unit price / day</span>
                            <span>Post expire after</span>
                          </div>
                          <div className="block-one__right">
                            <b>{activePostType ? capitalizeString(activePostType) : "Not selected"}</b>
                            <b>{postFeePerDay ? "$" + postFeePerDay : "Not selected"}</b>
                            <b>{dayExpireLeft ? dayExpireLeft + " days" : "Not selected"}</b>
                          </div>
                        </div>
                        <div className="line" style={{margin: "2rem 0"}} />
                        <div className="block-two">
                          <div className="block-two__left">
                            <span>Post fee</span>
                            <span>Auto pushing post package</span>
                          </div>
                          <div className="block-two__right">
                            {postFeePerDay && dayExpireLeft && (
                              <b>${(postFeePerDay * dayExpireLeft).toFixed(2)}</b>
                            )}
                            {selectedPushingPostBox !== null && (
                              <b>
                                ${getPushingPostPackagePrice() !== null
                                  ? getPushingPostPackagePrice()?.toFixed(2)
                                  : "Not selected"}
                              </b>
                            )}

                          </div>
                        </div>
                        <div className="line" style={{margin: "2rem 0"}} />
                        <div className="block-three" onClick={() => setPromotionModalOpen(true)}>
                          <div className="block-three__left">
                            <div className="d-flex align-items-center">
                              <div className="auto-post-box__icon-wrapper">
                                <MdOutlineDiscount className="auto-post-box__icon-wrapper--icon"/>
                              </div>                            
                              <span>Promo (0)</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-center align-items-center">
                            <FaAngleRight style={{ fontSize: "2.4rem", color: "#bbb"}}/>
                          </div>
                        </div>
                        <div className="line" style={{margin: "2rem 0"}} />
                        <div className="block-four align-items-center">
                          <div className="block-four__left">
                            Total payment
                          </div>
                          {getTotalPayment() && (
                            <b className="block-four__right" style={{fontSize: "2.4rem", fontWeight: "700"}}>
                              ${getTotalPayment()}
                            </b>
                          )}
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

      <Modal 
        title="Promotion" 
        open={promotionModalOpen}
        onOk={() => setPromotionModalOpen(true)} 
        onCancel={() => setPromotionModalOpen(false)}
      >
        <div className="line" style={{marginTop: "1rem", marginBottom: "1.5rem", background: "#eee"}}></div>
        <Input size="large" style={{width: "100%"}} placeholder="Enter promo code..."></Input>
      </Modal>
    </>
  )
}

export default ChooseOptions