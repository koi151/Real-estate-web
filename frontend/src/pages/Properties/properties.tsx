import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Checkbox, Col, Row, Space, Tag,  message } from 'antd';

import * as standardizeData from '../../helpers/standardizeData'
import getPriceUnit from '../../helpers/getPriceUnit';

import propertiesService from '../../services/admin/properties.service';
import RoomCountTooltip from '../../components/RoomCount/roomCount';
import { Property } from '../../commonTypes';
import { Link } from 'react-router-dom';
import './properties.scss';
import FilterBox from '../../components/FilterBox/filterBox';

const Properties: React.FC = () => {

  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [keyword, setKeyword] = useState<string | null>(null); 
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await propertiesService.getProperties({
          params: {
            ...(keyword && { keyword }),
            ...(status && { status }),
          },
        });

        if(response?.code === 200) {
          setPropertyList(response.properties);
        } else {
          message.error(response.message, 2);
        }

      } catch (error) {
        message.error('An error occurred while fetching properties.', 2);
        setError('No property found.');
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [keyword, status]);  

  const handleKeywordChange = (newKeyword: string | null) => {
    setKeyword(newKeyword);
  };

  const handleStatusChange = (newStatus: string | null) => {
    setStatus(newStatus);
  };

  const renderTag = (value: string, colorMap: Record<string, string>) => (
    <Tag className="listing-type-tag" color={colorMap[value]}>
      {standardizeData.listingType(value)}
    </Tag>
  );

  return (
    <>
      <h1 className="main-content-title">Properties:</h1>
      <Breadcrumb style={{ margin: '16px 0' }} items={[
        {breadcrumbName: 'Home'},
        {breadcrumbName: 'Properties'}
      ]} />

      <FilterBox 
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
      />

      {error ? (
        <div>{error}</div>
      ) : propertyList.length > 0 ? (
        propertyList.map((property, index) => (
          <div className='item-wrapper' key={index}>  
            <Row className='item-wrapper__custom-row'>
              <div
                className='item-wrapper__upper-content' 
                key={index}>
                  <Col
                    className='item-wrapper__upper-content--check-box d-flex align-items-center'  
                    span={1}
                  >
                    <Checkbox
                      // onChange={(e) => setComponentDisabled(e.target.checked)}
                    ></Checkbox>
                  </Col>

                <Col xxl={4} xl={4} lg={4} md={4} sm={4}>
                  <img 
                    src={property.images?.[0] ?? ""} 
                    className='item-wrapper__upper-content--image' 
                    alt='property img' 
                  />
                </Col>
                <Col 
                  xxl={7} xl={7} lg={7} md={7} sm={7}
                  className='item-wrapper__custom-col' 
                >
                  <div>
                    <h3 className='item-wrapper__upper-content--title'>
                      {property.title}
                    </h3>
                    <div className='item-wrapper__upper-content--location'>
                      {property.location ? (
                        <span>{property.location.city}, {property.location.district}</span>
                      ) : "No information"}
                    </div>
                  </div>
                  <div>
                    {property.price && 
                      <span className='item-wrapper__upper-content--price'>
                        <span className='price-number'>
                          {parseFloat(property.price) > 1000
                            ? parseFloat(property.price) / 1000
                            : parseFloat(property.price)
                          }
                        </span>
                        <span className='price-unit'>{getPriceUnit(property.price)}
                          <span style={{ margin: '0 .85rem' }}>/</span>
                        </span>
                      </span>
                    }
                    {property.area?.width && property.area?.length && 
                      <span className='item-wrapper__upper-content--area'>
                        <span className='area-number'>
                          {property.area.width * property.area.length}
                        </span>
                        <span className='area-unit'>m²</span>
                      </span>
                    }
                  </div>
                </Col>
                <Col xxl={2} xl={2} lg={2} md={2} sm={2}>
                  <div className='item-wrapper__upper-content--rooms'>
                    {property.propertyDetails?.features ? (
                      <div className='d-flex flex-column justify-content-center'>
                        <RoomCountTooltip roomList={property.propertyDetails?.features} type="bedrooms" />
                        <RoomCountTooltip roomList={property.propertyDetails?.features} type="bathrooms" />
                      </div>
                    ) : (
                      <>
                        <RoomCountTooltip roomList={null} type="bedrooms" />
                        <RoomCountTooltip roomList={null} type="bathrooms" />
                      </>
                    )}
                  </div>
                </Col>
                <Col
                  className='item-wrapper__custom-col-two'  
                  xxl={7} xl={7} lg={7} md={7} sm={7}
                >
                  <div style={{marginLeft: "2rem"}}>
                    <div className='item-wrapper__upper-content--status'>
                      <p className='status-text'>Status: </p>
                        {property.status &&
                          <>
                            <Button 
                              type='primary'
                              className={`${property.status}-btn small-btn`} 
                            >
                              {property.status}
                            </Button>
                          </> 
                        }
                    </div>
                    <div className='item-wrapper__upper-content--listing-type'>
                      <p className='tag-text'>Tags: </p>
                      <Space size={[0, 8]} wrap>
                        {property.listingType === 'forSale' 
                          && renderTag(property.listingType, { forSale: 'green', forRent: 'orange' })}
                        {property.propertyDetails?.propertyType === 'house' 
                        && renderTag(property.propertyDetails.propertyType, { house: 'purple', apartment: 'blue' })}
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col
                  className='item-wrapper__custom-col-two'  
                  xxl={2} xl={2} lg={2} md={2} sm={2}
                >
                  <div className='button-wrapper'>
                    <Link to={`/admin/properties/detail/${property._id}`}> 
                      <Button className='detail-btn'>Detail</Button> 
                    </Link>
                    <Link to={`/admin/properties/edit/${property._id}`}> 
                      <Button className='edit-btn'>Edit</Button> 
                    </Link>
                    <Link to={`/admin/properties/delete/${property._id}`}> 
                      <Button type="primary" danger>Delete</Button> 
                    </Link>
                  </div>
                </Col>
              </div>
            </Row>
            <div className='line'></div>
            <Row>
              <Col span={24}>
                <div className='item-wrapper__lower-content'>
                  <div className='item-wrapper__lower-content--date-created'>
                    Created: {property.createdAt ? new Date(property.createdAt).toLocaleString() : 'No data'}
                  </div>
                  <div className='item-wrapper__lower-content--date-created'>
                    Expire: {property.expireAt ? new Date(property.expireAt).toLocaleString() : 'No data'}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default Properties;
