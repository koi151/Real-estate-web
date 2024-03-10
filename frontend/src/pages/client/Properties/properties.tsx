import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Breadcrumb, Button, Col, Input, Pagination, 
         PaginationProps, Row, Select, Skeleton, Tooltip,  message } from 'antd';
import { RiSearchLine } from "react-icons/ri";
import { RootState } from '../../../redux/stores';

import getPriceUnit from '../../../helpers/getPriceUnit';

import propertiesServiceClient from '../../../services/client/properties.service';

import { PropertyType, PaginationObject } from '../../../../../backend/commonTypes';
import RoomCountTooltip from '../../../components/shared/Counters/RoomCounter/roomCount';

import HTMLContent from '../../../components/client/HTMLContent/HTMLContent';
import FilterBoxSlide from '../../../components/shared/FilterComponents/FilterBoxSlide/filterBoxSlide';
import PriceRange from '../../../components/shared/FilterComponents/PriceRange/priceRange';
import AreaRange from '../../../components/shared/FilterComponents/AreaRange/areaRange';

import { setKeyword, setSorting } from '../../../redux/reduxSlices/filtersSlice';
import { setPermissions } from '../../../redux/reduxSlices/adminPermissionsSlice';

import { sortingOptionsClient } from '../../../helpers/filterOptions';

import './properties.scss';

const Properties: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const filters = useSelector((state: RootState) => state.filters);

  const [loading, setLoading] = useState(true);
  const [propertyList, setPropertyList] = useState<PropertyType[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [propertyCount, setPropertyCount] = useState<number>(0);

  const { listingType, keyword, status, category, direction, 
          priceRange, areaRange, sorting, bedrooms, bathrooms } = filters;

  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [paginationObj, setPaginationObj] = useState<PaginationObject>({
    currentPage: null,
    limitItems: 4,
    skip: null,
    totalPage: null,
  })

  const onPageChange: PaginationProps['onChange'] = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // fetch properties data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await propertiesServiceClient.getProperties({ 
          ...(keyword && { keyword }), 
          ...(listingType && { listingType }), 
          ...(category && { category }), 
          ...(direction && { direction }), 
          ...(bedrooms && { bedrooms }),
          ...(bathrooms && { bathrooms }), 
          ...(priceRange && { priceRange }),
          ...(areaRange && { areaRange }),
          ...(sorting?.sortKey && { sortKey: sorting.sortKey }), 
          ...(sorting?.sortValue && { sortValue: sorting.sortValue }), 
          currentPage: currentPage,
          pageSize: 4
        });
  
        if(response?.code === 200) {
          setPropertyList(response.properties);
          setPaginationObj(response.paginationObject);
          setPropertyCount(response.propertyCount);
          setLoading(false);

          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

        } else {
          message.error(response.message, 4);
        }
  
      } catch (error: any) {
        if ((error.response && error.response.status === 401) || error.message === 'Unauthorized') {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          message.error('Error occurred while fetching properties data', 2);
          setError('No property found.');
          console.log('Error occurred:', error);
        }
      }
    };
    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status, sorting, currentPage, listingType, bedrooms, bathrooms,
      direction, priceRange, areaRange, category, navigate]); 

  // update url
  useEffect(() => {
    navigate(buildURL());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, listingType, keyword, sorting, priceRange, areaRange,
      category, bedrooms, direction, bathrooms])

  const buildURL = () => {
    const params: { [key: string]: string } = {};
  
    if (keyword) params['keyword'] = keyword;
    if (listingType) params['listingType'] = listingType;
    if (status) params['status'] = status;
    if (category) params['category'] = category;
    if (bedrooms) params['bedrooms'] = bedrooms;
    if (bathrooms) params['bathrooms'] = bathrooms;
    if(direction) params['direction'] = direction;

    if (sorting.sortKey && sorting.sortValue) {
      params['sortKey'] = sorting.sortKey;
      params['sortValue'] = sorting.sortValue;
    }
    
    const [minPrice, maxPrice] = priceRange ?? [];
    if (minPrice) params['minPrice'] = String(minPrice);
    if (maxPrice) params['maxPrice'] = String(maxPrice); 

    const [minArea, maxArea] = areaRange ?? [];
    if (minArea) params['minArea'] = String(minArea);
    if (maxArea) params['maxArea'] = String(maxArea);    
  
    // Short-circuiting for performance
    const queryString = Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : '';
    
    return `${location.pathname}${queryString}`;
  };

  const handleSortingChange = (value: string) => {
    const [sortKey, sortValue] = value.split('-');
    dispatch(setSorting({ sortKey, sortValue }));
  };

  
  return (
    <>
      {/* {accessAllowed ? ( */}
        <>
          <Input
            addonBefore={<RiSearchLine />}
            className='search-box search-box-custom'
            placeholder="Search by title..."
            onChange={(e) => dispatch(setKeyword(e.target.value))}
            suffix={<Button type="primary">Search</Button>}

          />
            <FilterBoxSlide slickWidth='70%' userType='client'/>
            
            <div className='line' style={{marginTop: "1.75rem"}} /> 

            <div className='d-flex' style={{width: "100%"}}>
              <div style={{width: "70%"}}>
                <div className='title-wrapper mt-2 p-0 pt-3'>
                  <Breadcrumb
                    className='mt-1 mb-1'
                    items={[
                      { title: <Link to="/">Home</Link> },
                      { title: <Link to="/properties">All real estate nationwide</Link> },
                    ]}
                  />
                  <h1 className="main-content-title mt-2">Buy and sell real estate nationwide</h1>
                  <div className='d-flex justify-content-between align-items-center mt-4'>
                    {loading ? (
                      <span>Data is loading, please wait for a moment...</span>
                    ) : (
                      <span>Currently have {propertyCount} properties</span>
                    )}
                    <div className='sorting-items'>
                      <Select
                        placement='bottomLeft'
                        placeholder="Choose sorting method"
                        defaultValue={'Sort by default'}
                        onChange={handleSortingChange}
                        options={sortingOptionsClient}
                        className='sorting-items__select'
                        style={{width: "20rem"}}
                      />
                    </div>
                  </div>
                </div>  

              {error ? (
                <div>{error}</div>
              ) : (
                <>
                <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
                  <div className='d-flex flex-column'>
                    {propertyList?.length > 0 ? (
                      propertyList.map((property, index) => {
                        return (
                          <div 
                            className='post-wrapper' 
                            onClick={() => navigate(`/properties/detail/${property._id}`)}
                            key={index}
                          >
                            {property.postType === 'premium'? (
                              <Badge.Ribbon 
                                text={
                                  <Tooltip title={property.postType ? `${property.postType.charAt(0).toUpperCase() + property.postType.slice(1)} post` : ''}>
                                    {property.postType && (
                                      <div style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>
                                        {property.postType.charAt(0).toUpperCase() + property.postType.slice(1)}
                                      </div>
                                    )}
                                  </Tooltip>
                                } 
                                color={property.postType === 'premium' ? "purple" : "gold"} 
                                className="custom-ribbon-2"
                                style={{ position: 'absolute', top: '.5rem', left: "-.5rem", right: 'auto', transform: 'scaleX(-1)' }}
                              >
                                <div className='post-wrapper__images'>
                                  <div className='image-primary-wrap'>
                                    <img src={property.images?.[0] ?? ""} alt='1st property img'/>
                                  </div>
                                  <div className='images-group'>
                                    <div className='images-group__secondary-wrap'>
                                      <img src={property.images?.[1] ?? ""} alt='2nd property img'/>
                                    </div>
                                    <div className='images-group__smaller-group'>
                                      <div className='images-group__smaller-group--image-wrap'>
                                        <img src={property.images?.[2] ?? ""} alt='3rd property img'/>
                                      </div>
                                      <div className='images-group__smaller-group--image-wrap'>
                                        <img src={property.images?.[3] ?? ""} alt='4th property img'/>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Badge.Ribbon>
                            ) : (
                              <div 
                                className='post-wrapper__images' 
                                onClick={() => navigate(`/properties/detail/${property._id}`)}
                              >
                                <div className='image-primary-wrap'>
                                  <img src={property.images?.[0] ?? ""} alt='1st property img'/>
                                </div>
                                <div className='images-group'>
                                  <div className='images-group__secondary-wrap'>
                                    <img src={property.images?.[1] ?? ""} alt='2nd property img'/>
                                  </div>
                                  <div className='images-group__smaller-group'>
                                    <div className='images-group__smaller-group--image-wrap'>
                                      <img src={property.images?.[2] ?? ""} alt='3rd property img'/>
                                    </div>
                                    <div className='images-group__smaller-group--image-wrap'>
                                      <img src={property.images?.[3] ?? ""} alt='4th property img'/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className='post-wrapper__content'>
                              <div className='post-wrapper__content--title'>
                                {property.title}
                              </div>
                              <div className='d-flex mt-3 mb-3 align-items-center'>
                                {property.price ? (
                                  <>
                                    <span className='post-wrapper__content--price'>
                                      {property.price > 1000 ? property.price / 1000 : property.price }
                                    </span>
                                    <span className='post-wrapper__content--price-unit'>{getPriceUnit(property.price)}</span>
                                  </>
                                ) : (
                                  <span className='post-wrapper__content--price'>Negotiable price</span>
                                  )}
                                {property.area?.propertyLength && property.area?.propertyWidth && (
                                  <span className='post-wrapper__content--area'>
                                    {property.area?.propertyLength * property.area?.propertyWidth}
                                    <span style={{marginLeft: ".3rem"}}>m²</span>
                                  </span>
                                )}
                                {property.area?.propertyLength && property.area?.propertyWidth && property.price && (
                                  <span className='post-wrapper__content--price-per-area-unit'>
                                    {(property.price / (property.area?.propertyLength * property.area?.propertyWidth)).toFixed(2)}
                                    <span style={{marginLeft: ".3rem"}}>{getPriceUnit(property.price).slice(0, 3)}/m²</span>
                                  </span>
                                )}
                                {property.propertyDetails?.rooms && (
                                  <span className='post-wrapper__content--features'>
                                    <RoomCountTooltip tooltip={false} roomList={property.propertyDetails?.rooms} type="bedrooms" />
                                    <RoomCountTooltip tooltip={false} roomList={property.propertyDetails?.rooms} type="bathrooms" />
                                  </span>
                                )}
                                {property.location ? (
                                  <span className='post-wrapper__content--position'>
                                    {property.location.city ? property.location.city : 'No info'}, {property.location.district ? property.location.district : 'no info'}
                                  </span>
                                ) : "No information"}
                              </div>
                              {property.description && (
                                <span className='post-wrapper__content--description'>
                                  <HTMLContent htmlContent={property.description} />
                                </span>
                              )}
                            </div>

                            <div className='line' style={{width: "100%"}}></div>
                              <Row>
                                <Col span={24}>
                                  <div className='lower-content'>
                                    <div className='lower-content--date-created'>
                                      Created at: {property.createdAt ? new Date(property.createdAt).toLocaleString() : 'No data'}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                          </div>
                        );
                      })
                    ) : (
                      <>Loading...</>
                    )}
                  </div>
                  
                </Skeleton>
                <Skeleton loading={loading} active style={{ padding: '3.5rem' }}></Skeleton>
                <Skeleton loading={loading} active style={{ padding: '3.5rem' }}></Skeleton>
                </>
              )}            
            </div>
            <div className='d-flex flex-column align-items-end' style={{ width: "30%" }}>
              <PriceRange width='100%' modelDisable/>
              <AreaRange width='100%' modelDisable/>
            </div>
            </div>

          <Pagination
            // showSizeChanger
            showQuickJumper
            pageSize={paginationObj?.limitItems || 4}
            onChange={onPageChange}
            defaultCurrent={paginationObj?.currentPage || 1}
            total={propertyCount}
            className='mt-5'
          />
        </>
      {/* ) : (
        <NoPermission permissionType='view' />
      )} */}
    </>
  );
};

export default Properties;
