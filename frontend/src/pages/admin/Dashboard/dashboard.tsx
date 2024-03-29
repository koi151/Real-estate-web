import { Breadcrumb, Button, Checkbox, Col, Image, InputNumber, Popconfirm, Row, Skeleton, Space, Tag, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import CardItem from '../../../components/admin/CardItem/cardItem';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLineChart } from 'react-icons/ai';
import { FaUsersCog } from "react-icons/fa";

import Statistic from '../../../components/admin/Statistic/statistic';
import NoPermission from '../../../components/admin/NoPermission/noPermission';
import dashboardService from '../../../services/admin/dashboard.service';
import { DashboardStatistics, PropertyType, Statistics } from '../../../../../backend/commonTypes';
import propertiesService from '../../../services/admin/properties.service';
import getPriceUnit from '../../../helpers/getPriceUnit';
import RoomCountTooltip from '../../../components/shared/Counters/RoomCounter/roomCount';
import ViewCount from '../../../components/shared/Counters/ViewCount/viewCount';
import StatusButton from '../../../components/admin/StatusButton/statusButton';
import { listingTypeFormatted } from '../../../helpers/standardizeData';

import './dashboard.scss'
import IncomeChart from '../../../components/admin/StatisticCharts/revenue';

const DashBoard: React.FC = () => {
  const navigate = useNavigate();

  const [accessAllowed, setAccessAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  const [pendingPropertyList, setPendingPropertyList] = useState<PropertyType[]>([]);

  const createInitialStatistics = (): Statistics => ({
    total: 0,
    active: 0,
    inactive: 0
  });
  
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    adminAccounts: createInitialStatistics(),
    clientAccounts: createInitialStatistics(),
    properties: createInitialStatistics(),
    categories: createInitialStatistics()
  });

  // fetch statistic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getStatistics();

        if (response.code === 200) {
          setStatistics(response.statistics);
        } else {
          message.error('Error occurred, cannot fetch data', 3);
        }

      } catch (err: any) {
        if ((err.response && err.response.status === 401) || err.message === 'Unauthorized') {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching properties data', 2);
          console.log('Error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // fetch pending properties data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await propertiesService.getPendingProperties();
  
        if(response?.code === 200) {
          setPendingPropertyList(response.pendingProperties);

        } else {
          setAccessAllowed(false);
          message.error('Error occurred while fetching pending properties', 4);
        }
  
      } catch (error: any) {
        if ((error.response && error.response.status === 401) || error.message === 'Unauthorized') {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching properties data', 2);
          console.log('Error occurred:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const renderTag = (value: string, colorMap: Record<string, string>) => (
    <Tag className="listing-type-tag" color={colorMap[value]}>
      {listingTypeFormatted(value)}
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
      setPendingPropertyList(prevPropertyList => prevPropertyList.filter(property => property._id !== id));

    } else {
      message.error('Error occurred, can not delete');
    }
  };

  return (
    <>
      {accessAllowed ? (
        <>
          <div className='title-wrapper'>
            <h1 className="main-content-title">Welcome To Dashboard</h1>
            <Breadcrumb
              className='mt-1 mb-1'
              items={[
                { title: <Link to="/admin">Admin</Link> },
                { title: <Link to="/admin/dashboard">Dashboard</Link> },
              ]}
            />
          </div>

          <Row gutter={[20, 20]} className='mb-20'>
            <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
              <CardItem>
                <Statistic
                  title={'Admin accounts'} 
                  icon={<FaUsersCog />} 
                  value={`${statistics?.adminAccounts?.active} / ${statistics?.adminAccounts?.total}`} 
                  label={'Active accounts'} color='blue'/>
              </CardItem>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
              <CardItem>
                <Statistic
                  title={'Client accounts'} 
                  icon={<FaUsersCog />} 
                  value={`${statistics?.clientAccounts?.active} / ${statistics?.clientAccounts?.total}`} 
                  label={'Active accounts'} color='purple'/>
              </CardItem>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
              <CardItem>
                <Statistic
                  title={'Properties:'} 
                  icon={<AiOutlineLineChart />} 
                  value={`${statistics?.properties?.active} / ${statistics?.properties?.total}`} 
                  label={'Active properties'} color='green'
                />
              </CardItem>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
              <CardItem>
                <Statistic
                  title={'Property categories:'} 
                  icon={<AiOutlineLineChart />} 
                  value={`${statistics?.categories?.active} / ${statistics?.categories?.total}`} 
                  label={'Active categories'} color='yellow'
                />
              </CardItem>
            </Col>
          </Row>
          <Row gutter={[20, 20]} style={{padding: "2rem"}}>
            <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
              <div className='properties-statistic-wrapper'>
                <div className='properties-statistic-wrapper--title'>
                  Statistics
                </div>
                <IncomeChart />
              </div>
            </Skeleton>
          </Row>

          <Row gutter={[20, 20]} style={{padding: "2rem"}}>
            <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
              <div className='pending-post-box'>
                <h3 className='pending-post-box--title'>Pending post list</h3>
                <span className='pending-post-box--desc'>
                  There are {pendingPropertyList.length} properties waiting to approve
                </span>
              </div>

              {pendingPropertyList?.length > 0 ? (
                pendingPropertyList.map((property, index) => {
                  return (
                    <div className='item-wrapper' key={index} data-id={property._id} style={{marginTop: "0rem"}}>  
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
                                    data-id={property._id}
                                  />
                                </Tooltip>
                              : <Tooltip title='Please add the position of property'>No data</Tooltip>    
                              }
                              
                              <Checkbox
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
                              <Link to={`/admin/properties/edit/${property._id}`}> 
                                <Button className='edit-btn'>Edit</Button> 
                              </Link>
                              <Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this property?"
                                onConfirm={() => confirmDelete(property._id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button type="primary" danger>Delete</Button> 
                              </Popconfirm>
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
                              Expire: {`${property.postServices?.dayPost ? property.postServices?.dayPost + ' day after post approved' : 'No data' }`}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              ) : (
                <b>No post waiting for approve...</b>
              )}
            </Skeleton>
          </Row>
        </>
      ) : (
        <NoPermission permissionType='view' />
      )}
    </>
  );
}

export default DashBoard;
