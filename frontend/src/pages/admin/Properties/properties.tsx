import React, { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, Button, Checkbox, Col, Image, InputNumber, Pagination, 
         PaginationProps, Popconfirm, Row, Skeleton, Space, Tag,  Tooltip,  message } from 'antd';

import * as standardizeData from '../../../helpers/standardizeData'
import getPriceUnit from '../../../helpers/getPriceUnit';

import propertiesService from '../../../services/admin/properties.service';

import { PropertyType, PaginationObject } from '../../../../../backend/commonTypes';
import ViewCount from '../../../components/shared/Counters/ViewCount/viewCount';
import RoomCountTooltip from '../../../components/shared/Counters/RoomCounter/roomCount';
import FilterBox from '../../../components/admin/FilterBox/filterBox';
import StatusButton from '../../../components/admin/StatusButton/statusButton';
import NoPermission from '../../../components/admin/NoPermission/noPermission';

import { RootState } from '../../../redux/stores';
import { setPermissions } from '../../../redux/reduxSlices/permissionsSlice';
import './properties.scss';


const Properties: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const filters = useSelector((state: RootState) => state.filters);
  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [accessAllowed, setAccessAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [propertyList, setPropertyList] = useState<PropertyType[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [propertyCount, setPropertyCount] = useState<number>(0);

  const { listingType, keyword, status, category, priceRange, sorting,
          direction, bedrooms, bathrooms, areaRange } = filters;

  const [checkedList, setCheckedList] = useState<string[]>([]);
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
        const response = await propertiesService.getProperties({ 
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
          setAccessAllowed(false);
          message.error(response.message, 4);
        }
  
      } catch (error: any) {
        if ((error.response && error.response.status === 401) || error.message === 'Unauthorized') {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching properties data', 2);
          setError('No property found.');
          console.log('Error occurred:', error);
        }
      }
    };
    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status, sorting, currentPage, listingType, priceRange, category]); 

  // update url
  useEffect(() => {
    navigate(buildURL());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, listingType, keyword, sorting, priceRange])

  const buildURL = () => {
    const params: { [key: string]: string } = {};
  
    if (keyword) params['keyword'] = keyword;
    if (listingType) params['listingType'] = listingType;
    if (status) params['status'] = status;
    if (sorting.sortKey && sorting.sortValue) {
      params['sortKey'] = sorting.sortKey;
      params['sortValue'] = sorting.sortValue;
    }
    
    const [minPrice, maxPrice] = priceRange ?? [];
    if (minPrice !== undefined && maxPrice !== undefined) {
      params['minPrice'] = String(minPrice);
      params['maxPrice'] = String(maxPrice);
    }
  
    // Short-circuiting for performance
    const queryString = Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : '';
    
    return `${location.pathname}${queryString}`;
  };
  
  
  const handleCheckboxChange = (id: string | undefined) => (e: CheckboxChangeEvent) => {
    if (id === undefined) {
      message.error('Error occurred', 3);
      console.log('id parameter is undefined');
      return;
    }
    if (e.target.checked) {
      const position = document.querySelector(`.item-wrapper__upper-content--position input[data-id="${id}"]`) as HTMLInputElement;
      setCheckedList([...checkedList, `${id}-${position.value}`]);
    } else {
      setCheckedList(checkedList.filter((itemId) => itemId !== id));
    }
  };

  const onChangePosition = (id: string | undefined, position: number | null) => {
    if (position === null || id === undefined){
      message.error("Error occurred, can not change position of property");
      console.log('id or value parameter is undefined')
    }

    const currentCheckBox = document.querySelector(`.item-wrapper__upper-content--checkbox span input[id="${id}"]`) as HTMLInputElement;
    if (currentCheckBox?.checked) {
      setCheckedList([...checkedList, `${id}-${position}`]);
    }
  }

  const renderTag = (value: string, colorMap: Record<string, string>) => (
    <Tag className="listing-type-tag" color={colorMap[value]}>
      {standardizeData.listingTypeFormatted(value)}
    </Tag>
  );

  // Delete item
  const confirmDelete = async (id?: string) => {
    if (!id) {
      message.error('Error occurred, can not delete');
      console.log('Can not get id')
      return;
    } 
    const response = await propertiesService.deleteProperty(id);

    if (response?.code === 200) {
      message.success(response.message, 3);
      setPropertyList(prevPropertyList => prevPropertyList.filter(property => property._id !== id));

    } else {
      message.error('Error occurred, can not delete');
    }
  };
  
  return (
    <>
      {accessAllowed ? (
        <>
          <div className='title-wrapper'>
            <h1 className="main-content-title">Property:</h1>
            <Breadcrumb
              className='mt-1 mb-1'
              items={[
                { title: <Link to="/admin">Admin</Link> },
                { title: <Link to="/admin/properties">Properties</Link> },
              ]}
            />
          </div>
    
          <FilterBox 
            createAllowed={currentUserPermissions?.propertiesCreate} 
            priceRangeFilter
            categoryFilter
            statusFilter
            multipleChange
          />
    
          {error ? (
            <div>{error}</div>
          ) : (
            <>
            <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
              {propertyList?.length > 0 ? (
                propertyList.map((property, index) => {
                  return (
                    <div className='item-wrapper' key={index} data-id={property._id}>  
                      <Row className='item-wrapper__custom-row'>
                        <div className='item-wrapper__upper-content' key={index}>
                            <Col
                              className='d-flex flex-column justify-content-center'  
                              span={1}
                            >
                              {property.position ?
                                <Tooltip title={
                                  <span>
                                    Property at <span style={{ color: 'orange' }}>#{property.position}</span> position
                                  </span>
                                }>
                                  <InputNumber
                                    min={0}
                                    className='item-wrapper__upper-content--position' 
                                    defaultValue={property.position} 
                                    onChange={(value) => onChangePosition(property._id, value)}
                                    data-id={property._id}
                                  />
                                </Tooltip>
                              : <Tooltip title='Please add the position of property'>No data</Tooltip>    
                              }
                              
                              <Checkbox
                                onChange={handleCheckboxChange(property._id)}
                                className='item-wrapper__upper-content--checkbox'
                                id={property._id}
                              ></Checkbox>
                            </Col>
      
                          <Col xxl={4} xl={4} lg={4} md={4} sm={4}>
                            {property.images?.length ? 
                              <Image
                                src={property.images?.[0] ?? ""} 
                                alt='property img' 
                                width={200}
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
                                  <span>{property.location.city ? property.location.city : 'No info'}, {property.location.district ? property.location.district : 'no info'}</span>
                                ) : "No information"}
                              </div>
                            </div>
                            <div>
                              {property.price ? 
                                <span className='item-wrapper__upper-content--price'>
                                  <span className='price-number'>
                                    { property.price > 1000 ? property.price / 1000 : property.price }
                                  </span>
                                  <span className='price-unit'>{getPriceUnit(property.price)}
                                    <span style={{ margin: '0 .85rem' }}>/</span>
                                  </span>
                                </span>
                                : <Tooltip title='No data of price'>...</Tooltip>
                              }
                              {property.area?.propertyWidth && property.area?.propertyLength ? 
                                <span className='item-wrapper__upper-content--area'>
                                  <span className='area-number'>
                                    {property.area.propertyWidth * property.area.propertyLength}
                                  </span>
                                  <span className='area-unit'>m²</span>
                                </span>
                                : <Tooltip title='No data of area'>...</Tooltip>
                              }
                            </div>
                          </Col>
                          <Col xxl={3} xl={3} lg={3} md={3} sm={3}>
                            <div className='item-wrapper__upper-content--rooms'>
                              {property.propertyDetails?.rooms ? (
                                <div className='d-flex flex-column justify-content-center'>
                                  <RoomCountTooltip roomList={property.propertyDetails?.rooms} type="bedrooms" />
                                  <RoomCountTooltip roomList={property.propertyDetails?.rooms} type="bathrooms" />
                                  <ViewCount propertyView={property.view} />
                                </div>
                              ) : (
                                <>
                                  <RoomCountTooltip roomList={undefined} type="bedrooms" />
                                  <RoomCountTooltip roomList={undefined} type="bathrooms" />
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
                              {property.status && property._id ? (
                                <StatusButton typeofChange='changePropertyStatus' itemId={property._id} status={property.status || undefined} />
                              ) : (
                                <Tooltip title='Please add property status or id'>No data</Tooltip>
                              )}
                              <div className='item-wrapper__upper-content--listing-type'>
                                <p className='tag-text'>Tags: </p>
                                <Space size={[0, 8]} wrap>
                                  {(property.listingType === 'forSale' || property.listingType === 'forRent') 
                                    && renderTag(property.listingType, { forSale: 'green', forRent: 'orange' })}
                                  {property.propertyDetails?.propertyCategory === 'house' 
                                  && renderTag(property.propertyDetails.propertyCategory, { house: 'purple', apartment: 'blue' })}
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
                              {currentUserPermissions?.propertiesEdit && (
                                <Link to={`/admin/properties/edit/${property._id}`}> 
                                  <Button className='edit-btn'>Edit</Button> 
                                </Link>
                              )}
                              {currentUserPermissions?.propertiesDelete && (
                                <Popconfirm
                                  title="Delete the task"
                                  description="Are you sure to delete this property?"
                                  onConfirm={() => confirmDelete(property._id)}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button type="primary" danger>Delete</Button> 
                                </Popconfirm>
                              )}
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
                              Expire: {property.expireTime ? new Date(property.expireTime).toLocaleString() : 'No data'}
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
            </Skeleton>
            <Skeleton loading={loading} active style={{ padding: '3.5rem' }}></Skeleton>
            <Skeleton loading={loading} active style={{ padding: '3.5rem' }}></Skeleton>
            </>
          )}
          <Pagination
            // showSizeChanger
            showQuickJumper
            pageSize={paginationObj?.limitItems || 4}
            onChange={onPageChange}
            defaultCurrent={paginationObj?.currentPage || 1}
            total={propertyCount}
          />
        </>
      ) : (
        <NoPermission permissionType='view' />
      )}
    </>
  );
};

export default Properties;
