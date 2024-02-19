import React, { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Breadcrumb, Button, Checkbox, Col, Image, InputNumber, Pagination, 
         PaginationProps, Popconfirm, Row, Skeleton, Space, Tag,  Tooltip,  message } from 'antd';

import * as standardizeData from '../../../helpers/standardizeData'
import getPriceUnit from '../../../helpers/getPriceUnit';

import propertiesService from '../../../services/admin/properties.service';

import { PropertyType, PaginationObject } from '../../../../../backend/commonTypes';
import ViewCount from '../../../components/admin/Counters/ViewCount/viewCount';
import RoomCountTooltip from '../../../components/admin/Counters/RoomCounter/roomCount';
import FilterBox from '../../../components/admin/FilterBox/filterBox';
import StatusButton from '../../../components/admin/StatusButton/statusButton';
import NoPermission from '../../../components/admin/NoPermission/noPermission';

import { RootState } from '../../../redux/stores';
import { setPermissions } from '../../../redux/reduxSlices/permissionsSlice';
import './properties.scss';
import HTMLContent from '../../../components/client/HTMLContent/HTMLContent';

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

  const { listingType, keyword, status, category, priceRange, sorting } = filters;

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
          ...(status && { status }), 
          ...(listingType && { listingType }), 
          ...(category && { category }), 
          ...(priceRange && { priceRange }),
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
  }, [status, listingType, keyword, sorting])

  const buildURL = () => {
    const params: { [key: string]: string } = {};
    if (keyword) params['keyword'] = keyword;
    if (listingType) params['listingType'] = listingType;
    if (status) params['status'] = status;
    if (sorting.sortKey && sorting.sortValue) {
      params['sortKey'] = sorting.sortKey;
      params['sortValue'] = sorting.sortValue;
    }

    return `${location.pathname}${Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : ''}`;
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
      {/* {accessAllowed ? ( */}
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
          />
    
          {error ? (
            <div>{error}</div>
          ) : (
            <>
            <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
              {propertyList?.length > 0 ? (
                propertyList.map((property, index) => {
                  return (
                    <div 
                      className='post-wrapper' 
                      onClick={() => navigate(`/properties/detail/${property._id}`)}
                      key={index}
                    >
                      {property.postType === 'premium' || property.postType === 'exclusive' ? (
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
                          {property.propertyDetails?.features && (
                            <span className='post-wrapper__content--features'>
                              <RoomCountTooltip tooltip={false} roomList={property.propertyDetails?.features} type="bedrooms" />
                              <RoomCountTooltip tooltip={false} roomList={property.propertyDetails?.features} type="bathrooms" />
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
      {/* ) : (
        <NoPermission permissionType='view' />
      )} */}
    </>
  );
};

export default Properties;
