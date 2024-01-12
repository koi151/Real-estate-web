import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, Checkbox, Col, Pagination, 
         PaginationProps, Row, Space, Tag,  message } from 'antd';

import * as standardizeData from '../../helpers/standardizeData'
import getPriceUnit from '../../helpers/getPriceUnit';

import propertiesService from '../../services/admin/properties.service';
import RoomCountTooltip from '../../components/Counters/RoomCount/roomCount';
import ViewCount from '../../components/Counters/ViewCount/viewCount';
import { Property, PaginationObject, SortingQuery } from '../../../../backend/commonTypes';
import FilterBox from '../../components/FilterBox/filterBox';
import './properties.scss';

const Properties: React.FC = () => {

  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [propertyCount, setPropertyCount] = useState<number>(0);

  // Searching and filtering
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string | null>(null); 
  const [sorting, setSorting] = useState<SortingQuery>(
    { sortKey: '', sortValue: '' }
  )
  const [paginationObj, setPaginationObj] = useState<PaginationObject>({
    currentPage: null,
    limitItems: null,
    skip: null,
    totalPage: null,
  })
  // 

  const onPageChange: PaginationProps['onChange'] = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await propertiesService.getProperties({ 
          ...(keyword && { keyword }), 
          ...(status && { status }), 
          ...(sorting?.sortKey && { sortKey: sorting.sortKey }), 
          ...(sorting?.sortValue && { sortValue: sorting.sortValue }), 
          currentPage: currentPage,
          pageSize: 2
      });

        if(response?.code === 200) {
          setPropertyList(response.properties);
          setPaginationObj(response.paginationObject);
          setPropertyCount(response.propertyCount);
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
  }, [keyword, status, sorting, currentPage]);  

  const handleKeywordChange = (newKeyword: string | null) => {
    setKeyword(newKeyword);
  };

  const handleStatusChange = (newStatus: string | null) => {
    setStatus(newStatus);
  };

  const handleSortingChange = (newSorting: any) => {
    setSorting(newSorting);
  }

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
        onSortingChange={handleSortingChange}
      />

      {error ? (
        <div>{error}</div>
      ) : propertyList.length > 0 ? (
        propertyList.map((property, index) => (
          <div className='item-wrapper' key={index}>  
            <Row className='item-wrapper__custom-row'>
              <div className='item-wrapper__upper-content' key={index}>
                  <Col
                    className='item-wrapper__upper-content--check-box d-flex align-items-center'  
                    span={1}
                  >
                    <Checkbox
                      // onChange={(e) => setComponentDisabled(e.target.checked)}
                    ></Checkbox>
                  </Col>

                <Col xxl={4} xl={4} lg={4} md={4} sm={4}>
                  {property.images?.length ? 
                    <img 
                      src={property.images?.[0] ?? ""} 
                      className='item-wrapper__upper-content--image' 
                      alt='property img' 
                    />
                  : <span className='d-flex justify-content-center align-items-center' style={{height: "100%"}}> No image </span>
                  }
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
                <Col xxl={3} xl={3} lg={3} md={3} sm={3}>
                  <div className='item-wrapper__upper-content--rooms'>
                    {property.propertyDetails?.features ? (
                      <div className='d-flex flex-column justify-content-center'>
                        <RoomCountTooltip roomList={property.propertyDetails?.features} type="bedrooms" />
                        <RoomCountTooltip roomList={property.propertyDetails?.features} type="bathrooms" />
                        <ViewCount propertyView={property.view} />
                      </div>
                    ) : (
                      <>
                        <RoomCountTooltip roomList={null} type="bedrooms" />
                        <RoomCountTooltip roomList={null} type="bathrooms" />
                        <ViewCount propertyView={property.view} />
                      </>
                    )}
                  </div>
                </Col>
                <Col
                  className='item-wrapper__custom-col-two'  
                  xxl={6} xl={6} lg={6} md={6} sm={6}
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
      <Pagination
        // showSizeChanger
        showQuickJumper
        pageSize={paginationObj.limitItems || 4}
        onChange={onPageChange}
        defaultCurrent={paginationObj.currentPage || 1}
        total={propertyCount}
      />
    </>
  );
};

export default Properties;
