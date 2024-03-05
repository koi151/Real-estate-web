import $ from 'jquery'; 
import 'slick-carousel';

import { Avatar, Breadcrumb, Button, Card, Col, Image, Row, Space, Spin, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { UserOutlined } from "@ant-design/icons";
import { GoShareAndroid } from "react-icons/go";
import { IoWarningOutline, IoPricetagOutline, IoBedOutline, IoDocumentTextOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsTextareaResize } from "react-icons/bs";
import { MdOutlineBathroom } from "react-icons/md";

import { PropertyType } from "../../../../../backend/commonTypes";

import propertiesServiceClient from "../../../services/client/properties.service";
import thirdPartyAPIService from '../../../services/shared/third-party.service';

import * as standardizeData from '../../../helpers/standardizeData'
import { calculatePricePerUnitArea } from '../../../helpers/getPriceUnit';
import HTMLContent from '../../../components/client/HTMLContent/HTMLContent';
import './detail.scss';
import MapContainer from '../../../components/client/MapContainer/mapContainer';

const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ property, setProperty ] = useState<PropertyType | undefined>(undefined);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ imageCount, setImageCount ] = useState<number>(0);

  const [ googleApiKey, setGoogleApiKey ] = useState<string | undefined>(undefined);

  const [address, setAddress] = useState<string>("");

  const formattedListingType = standardizeData.listingTypeFormatted(property?.listingType || '');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Error occurred while searching property information, redirect to the previous page', 3);
          navigate(-1);
          return;
        }

        const response = await propertiesServiceClient.getSingleProperty(id);

        if (response?.code === 200 && response.property) {
          setProperty(response.property);
          setLoading(false);
          setImageCount(response.property.images.length)

          const addressFormatted: string 
            = `Việt Nam, ${response.property.location.city}, ${response.property.location.district}, ${response.property.location.ward}`
          setAddress(addressFormatted);

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
            <Col span={17}>
              <Row gutter={16}>
                <Col span={24}>
                  <div className='slick-wrapper'>
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
                          <IoMdHeartEmpty />
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
            <Col span={7}>
              <Card className='detail-wrap'>
                <Space wrap size={16}>
                  <Avatar size='large' icon={<UserOutlined />} />
                </Space>
                <div className="post-by-txt">
                  Posted by
                </div>
                <div className="detail-wrap__username">
                  Sample Name
                </div>
                <div className="detail-wrap__other-post">
                  See more 3 other posts
                </div>
                <Button type="primary" className="detail-wrap__phone">
                  0334 324 434
                </Button>
                <Button type="primary" className="detail-wrap__social-view">
                  Chat through Zalo
                </Button>
                <Button type="primary" className="detail-wrap__email-send">
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
