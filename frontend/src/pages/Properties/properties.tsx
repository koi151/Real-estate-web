import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Row, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

import * as standardizeData from '../../helpers/standardizeData'
import getPriceUnit from '../../helpers/getPriceUnit';

import propertiesService from '../../services/admin/properties.service';
import RoomCountTooltip from '../../components/RoomCount/roomCount';
import { Property } from '../../commonTypes';
import { Link } from 'react-router-dom';
import './properties.scss';
import Search, { SearchProps } from 'antd/es/input/Search';

const Properties: React.FC = () => {
  const navigate = useNavigate();

  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [keyword, setKeyword] = useState<string | null>(null); 

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setKeyword(value);
    navigate(`/admin/properties?keyword=${value}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await propertiesService.getProperties({
          params: keyword ? { keyword: keyword } : {}
        });
        setPropertyList(response.properties);

      } catch (error) {
        setError('An error occurred while fetching properties.');
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [keyword]);  

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

      <div style={{width: "100%"}} className='d-flex justify-content-end'>
        <Search placeholder="input search text" 
        onSearch={onSearch} 
        style={{ width: 200 }} />
      </div>


      {error ? (
        <div>{error}</div>
      ) : propertyList.length > 0 ? (
        propertyList.map((property, index) => (
          <div className='item-wrapper' key={index}>  
            <Row className='item-wrapper__custom-row'>
              <div
                className='item-wrapper__upper-content' 
                key={index}>
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
                  xxl={8} xl={8} lg={8} md={8} sm={8}
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
                    Created: {property.createdAt ? new Date(property.createdAt).toLocaleString() : ''}
                  </div>
                  <div className='item-wrapper__lower-content--date-created'>
                    Expire: {property.expireAt ? new Date(property.expireAt).toLocaleString() : ''}
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
