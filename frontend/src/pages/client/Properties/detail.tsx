import $ from 'jquery'; 
import 'slick-carousel';

import { Avatar, Breadcrumb, Button, Card, Col, Image, Row, Space, Spin, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { UserOutlined } from "@ant-design/icons";
import { GoShareAndroid } from "react-icons/go";
import { IoWarningOutline, IoPricetagOutline, IoBedOutline, IoDocumentTextOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";
import { MdOutlineBathroom } from "react-icons/md";
import { LuSofa } from "react-icons/lu";
import ZaloIcon from '../../../assets/images/zalo-seeklogo.svg'

import { AdminAccountType, ClientAccountType, PropertyType } from "../../../../../backend/commonTypes";

import propertiesServiceClient from "../../../services/client/properties.service";
import thirdPartyAPIService from '../../../services/shared/third-party.service';

import * as standardizeData from '../../../helpers/standardizeData'
import { IoMdHeartEmpty } from "react-icons/io";
import { calculatePricePerUnitArea } from '../../../helpers/getPriceUnit';
import HTMLContent from '../../../components/client/HTMLContent/HTMLContent';
import MapContainer from '../../../components/client/MapContainer/mapContainer';
import clientAccountsService from '../../../services/client/accounts.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/stores';
import './detail.scss';
import { createSelector } from '@reduxjs/toolkit';

const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ property, setProperty ] = useState<PropertyType | undefined>(undefined);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ imageCount, setImageCount ] = useState<number>(0);
  const [ isFavorite, setIsFavorite ] = useState<boolean | undefined>(undefined);

  const [ googleApiKey, setGoogleApiKey ] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>("");

  const formattedListingType = standardizeData.listingTypeFormatted(property?.listingType || '');

  const [userPosted, setUserPosted] = useState<AdminAccountType | ClientAccountType | undefined>(undefined);
  
  // get current user info
  const selectCurrentUser = createSelector(
    (state: RootState) => state.adminUser,
    (state: RootState) => state.clientUser,
    (adminUser, clientUser) => {
      return adminUser.fullName !== ''
        ? { userId: adminUser._id, favoritePosts: adminUser.favoritePosts }
        : { userId: clientUser._id, favoritePosts: clientUser.favoritePosts };
    }
  );

  const currentUser = useSelector(selectCurrentUser);
  
  // fetch property data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Error occurred while searching property information, redirect to the previous page', 3);
          navigate(-1);
          return;
        }

        if (id && currentUser) {
          const isPostFavorited = currentUser.favoritePosts?.includes(id);
          setIsFavorite(isPostFavorited);
        }

        const response = await propertiesServiceClient.getSingleProperty(id);

        if (response?.code === 200 && response.property) {
          setProperty(response.property);
          setLoading(false);
          setImageCount(response.property.images.length)

          const addressFormatted: string 
            = `Việt Nam, ${response.property.location.city}, ${response.property.location.district}, ${response.property.location.ward}`
          setAddress(addressFormatted);

          let accountResponse;
          const propertyRes = response.property;
          if (propertyRes.createdBy?.accountType) {
            accountResponse = await clientAccountsService.getSingleAccount(propertyRes.createdBy.accountId);

            if (accountResponse.code === 200) {
              setUserPosted(accountResponse.account)
            } else {
              message.error(accountResponse.message, 2);
            }

          } else {
            message.error('Cannot get account information that created post');
            return;
          }

        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          message.error('Error occurred while fetching property data', 2);
          console.log('Error occurred:', error);
        }
      }
    };
    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && property?.images?.length) {
      $('.slick').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }
  }, [loading, property]);

  // Get Google Map API
  useEffect(() => {
    const fetchdata = async () => {
      const response = await thirdPartyAPIService.getGoogleCloudAPI();
      if (response.code === 200) {
        setGoogleApiKey(response.apiKey);
      } else {
        console.log('Error occurred, cannot display map')
      }
    }

    fetchdata();
  }, [googleApiKey])

  const addToFavoriteHandle = async () => {
    if (!id) {
      message.error('Can not get post ID');
      return;
    }
    if (!currentUser.userId) 
      return message.error('Can not get current user information')

    setIsFavorite(!isFavorite);
    const response = await clientAccountsService.updateFavoriteList(currentUser.userId, id);

    if (response.code === 200) {  
      if (response.isAddTask) {
        message.success("Added post to favorite list")
      }
      else {
        message.success("Removed post from favorite list")
      } 

    } else {
      console.log("Error occurred: ", response.message)
    }
  }

  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center' style={{ width: "100%", height: "100vh" }}>
          <Spin tip='Loading...' size="large">
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <>
          <Row gutter={16} className='post-detail'>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={24}>
                  <div className='slick-wrapper' style={{width: "85%"}}>
                    <div className="slick">
                      {property?.images?.map((imageUrl, index) => (
                        <Image
                          key={index}
                          src={imageUrl}
                          className="slick-img"
                        />
                      ))}
                    </div>
                  </div>
                </Col>
                <Col span={24} className='d-flex ml-3'>
                  <Image.PreviewGroup>
                    {property?.images?.map((imageUrl, index) => (
                      <Image 
                        src={imageUrl} 
                        width={`calc(80% / ${imageCount})`} 
                        key={index}
                        className='custom-demo-img'
                      />
                    ))}
                  </Image.PreviewGroup>
                </Col>
                <Col span={24} className='ml-3 mt-4 mb-4'>
                  <Breadcrumb className='mt-1 mb-1' items={[
                    { title: <Link to="/">{formattedListingType}</Link> },
                    { title: property?.location?.city ? <Link to="/">{ property?.location?.city }</Link> : null },
                    { title: property?.location?.district ? <Link to="/">{ property?.location?.district }</Link> : null },
                    { title: property?.location?.ward ? <Link to="/">{ property?.location?.ward }</Link> : null }
                  ]}/>

                  {property?.title && (
                    <h1 className='mt-3'>{property.title}</h1>
                  )}
                  {property?.location?.address && (
                    <div className='mt-3'>
                      {property?.location?.address}
                      {property?.location?.ward && (
                        <span>, {property?.location?.ward}</span>
                      )}
                      {property?.location?.district && (
                        <span>, {property?.location?.district}</span>
                      )}
                      {property?.location?.city && (
                        <span>, {property?.location?.city}</span>
                      )}
                    </div>
                  )}

                  <div className='line mt-4 mb-4' />

                  <Col span={24} style={{paddingLeft: 0, width: "100%"}}>
                    <div style={{width: "100%"}} className='d-flex justify-content-between'>
                      <div className='d-flex'>  
                        <div className='info-wrapper'>
                          <div className='info-wrapper__txt-one'>Price</div>
                          <div className='info-wrapper__txt-two'>{`${property?.price && (property?.price < 1000 ? property?.price + ' million' : (property?.price / 1000) + ' billion')}`}</div>
                          <div className='info-wrapper__txt-three'>
                            {property?.price && property?.area?.propertyLength && property?.area?.propertyWidth && 
                              '~' + calculatePricePerUnitArea(property.price, property.area.propertyLength, property.area.propertyWidth) + '/m²'}
                          </div>
                        </div>
                        <div className='info-wrapper'>
                          <div className='info-wrapper__txt-one'>Area</div>
                          <div className='info-wrapper__txt-two'>
                            {`${property?.area?.propertyLength && property?.area?.propertyWidth 
                              && property?.area?.propertyLength * property?.area?.propertyWidth} m²`}
                          </div>
                          <div className='info-wrapper__txt-three'>
                            {property?.price && property?.area?.propertyLength && property?.area?.propertyWidth && 
                              '~' + calculatePricePerUnitArea(property.price, property.area.propertyLength, property.area.propertyWidth) + '/m²'}
                          </div>
                        </div>
                      </div>
                      <div className='tool-wrapper'>
                        <Tooltip title='Share'>
                          <GoShareAndroid />
                        </Tooltip>
                        <Tooltip title="Report">
                          <IoWarningOutline />
                        </Tooltip>
                        <Tooltip title="Add to favorite">
                        {isFavorite !== undefined ? ( 
                          isFavorite ? (
                            <FaHeart
                              onClick={addToFavoriteHandle}
                              className='favorite-icon-active'
                            />
                          ) : (
                            <IoMdHeartEmpty
                              onClick={addToFavoriteHandle}
                              className='favorite-icon'
                            />
                          )
                        ) : (
                          <span>...</span>
                        )}                          
                        </Tooltip>
                      </div>
                    </div>
                  </Col>

                  <div className='line mt-4 mb-4' />

                  <Col span={24} style={{paddingLeft: 0}}>
                    <div className='description'>
                      <div className='desciption__title'>Description</div>
                      <div className='desciption__content'>
                        <HTMLContent htmlContent={property?.description} />
                      </div>
                    </div>
                  </Col>

                  <Col span={24} style={{paddingLeft: 0}} className='d-flex'>
                    <Row className='char' style={{width: "100%"}}>
                      <Col span={24}>
                        <div className='char__title'>Real estate characteristics</div>
                      </Col>

                      {property?.area?.propertyLength && property?.area?.propertyWidth && (
                        <Col span={12}>
                          <Row className='custom-row'>
                            <Col span={12}>
                              <BsTextareaResize />
                              <b>Area</b>   
                            </Col>   
                            <Col span={12}>
                              {`${property?.area?.propertyLength * property?.area?.propertyWidth} m²`}
                            </Col>
                          </Row>
                        </Col>
                      )}

                      {property?.price && (
                        <Col span={12}>
                          <Row className='custom-row'>
                            <Col span={12} className='d-flex align-items-center'>
                              <IoPricetagOutline />
                              <b>Price</b>   
                            </Col>   
                            <Col span={12} className='d-flex align-items-center'>
                              {`${(property?.price < 1000 
                                ? property?.price + ' million' 
                                : (property?.price / 1000) + ' billion')}`}
                            </Col>
                          </Row>
                        </Col>
                      )}

                      {property?.propertyDetails?.rooms && (
                        <Col span={12}>
                          <Row className='custom-row'>
                            <Col span={12}>
                              <IoBedOutline />
                              <b>Bedrooms</b>   
                            </Col>
                            {property?.propertyDetails?.rooms && (
                              <Col span={12}>
                                {standardizeData.getRoomCount(property?.propertyDetails?.rooms, 'bedrooms') + ' rooms'}
                              </Col>
                            )}   
                          </Row>
                        </Col>
                      )}

                      {property?.propertyDetails?.rooms && (
                        <Col span={12}>
                          <Row className='custom-row'>
                            <Col span={12} className='d-flex align-items-center'>
                              <MdOutlineBathroom />
                              <b>Bathrooms</b>   
                            </Col>   
                            <Col span={12}>
                              {standardizeData.getRoomCount(property?.propertyDetails?.rooms, 'bedrooms') + ' rooms'}
                            </Col>
                          </Row>
                        </Col>
                      )}
                    {property?.propertyDetails?.legalDocuments && (
                      <Col span={12}>
                        <Row className='custom-row'>
                          <Col span={12}>
                            <IoDocumentTextOutline />
                            <b>Licenses</b>   
                          </Col>
                          <Col span={12}>
                            {property.propertyDetails.legalDocuments.map((item, index) => (
                              <div key={index}>{`${item.charAt(0).toLocaleUpperCase()}${item.slice(1)}`}</div>
                            ))}
                          </Col>
                        </Row>
                      </Col>
                    )}
                     {property?.propertyDetails?.furnitures && (
                      <Col span={12}>
                        <Row className='custom-row'>
                          <Col span={12}>
                            <LuSofa />
                            <b>Furnitures</b>   
                          </Col>
                          <Col span={12}>
                            <div>{property.propertyDetails.furnitures}</div>
                          </Col>
                        </Row>
                      </Col>
                    )}
                    </Row>
                  </Col>

                  <Col span={24} style={{paddingLeft: 0}} className='d-flex'>
                    <Row className='char' style={{width: "100%"}}>
                      <Col span={24}>
                        <div className='char__title'>See on map</div>
                        { googleApiKey && (
                          <MapContainer apiKey={googleApiKey} addressString={address}/>
                        )}
                      </Col>
                    </Row>
                  </Col>

                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Card className='detail-wrap'>
                <Space wrap size={16}>
                  <Avatar size='large' icon={<UserOutlined />} src={<img src={userPosted?.avatar} alt="avatar" />} />
                </Space>
                <div className="post-by-txt">
                  Posted by
                </div>
                <div className="detail-wrap__username">
                  {userPosted?.fullName}
                </div>
                <div className="detail-wrap__other-post">
                  See more {userPosted?.postList?.length} other posts
                </div>
                <Button type="primary" className="detail-wrap__phone">
                  0334 324 434
                </Button>
                <Button className="detail-wrap__social">
                  <img src={ZaloIcon} alt='zalo'></img>Chat through Zalo
                </Button>
                <Button className="detail-wrap__email-send">
                  Send email
                </Button>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default PropertyDetail;
