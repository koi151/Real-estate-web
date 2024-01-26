import React, { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Checkbox, Col, InputNumber, Pagination, 
         PaginationProps, Row, Skeleton, Space, Tag,  Tooltip,  message } from 'antd';

import * as standardizeData from '../../helpers/standardizeData'
import getPriceUnit from '../../helpers/getPriceUnit';

import propertiesService from '../../services/admin/properties.service';
import { PropertyType, PaginationObject, SortingQuery } from '../../../../backend/commonTypes';
import ViewCount from '../../components/Counters/ViewCount/viewCount';
import RoomCountTooltip from '../../components/Counters/RoomCount/roomCount';
import FilterBox from '../../components/FilterBox/filterBox';
import StatusButton from '../../components/StatusButton/statusButton';
import '../Properties/properties.scss';

const PropertyCategories: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [propertyList, setPropertyList] = useState<PropertyType[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [propertyCount, setPropertyCount] = useState<number>(0);

  // Searching and filtering
  const [checkedList, setCheckedList] = useState<string[]>([]);
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
          setLoading(false);
        } else {
          message.error(response.message, 2);
        }

      } catch (error) {
        message.error('No property found', 2);
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

  const resetFilters = () => {
    setKeyword(null);
    setStatus(null);
    setSorting({sortKey: '', sortValue: ''});
    navigate('/admin/properties');
  }
  
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
      {standardizeData.listingType(value)}
    </Tag>
  );

  return (
    // <>
    //   <h1 className="main-content-title">Properties:</h1>
    //   <Breadcrumb style={{ margin: '16px 0' }} items={[
    //     {breadcrumbName: 'Home'},
    //     {breadcrumbName: 'Properties'}
    //   ]} />

    //   <FilterBox 
    //     onKeywordChange={handleKeywordChange}
    //     onStatusChange={handleStatusChange}
    //     onSortingChange={handleSortingChange}
    //     checkedList={checkedList}
    //     resetFilters={resetFilters}
    //   />

    //   {error ? (
    //     <div>{error}</div>
    //   ) : (
    //     <Skeleton loading={loading} active style={{padding: '3.5rem'}}>
    //       {propertyList.length > 0 ? (
    //         propertyList.map((property, index) => (
    //           <div className='item-wrapper' key={index} data-id={property._id}>  
    //             <Row className='item-wrapper__custom-row'>
    //               <div className='item-wrapper__upper-content' key={index}>
    //                   <Col
    //                     className='d-flex flex-column justify-content-center'  
    //                     span={1}
    //                   >
    //                     {property.position ?
    //                       <Tooltip title={
    //                         <span>
    //                           Property at <span style={{ color: 'orange' }}>#{property.position}</span> position
    //                         </span>
    //                       }>
    //                         <InputNumber
    //                           min={0}
    //                           className='item-wrapper__upper-content--position' 
    //                           defaultValue={property.position} 
    //                           onChange={(value) => onChangePosition(property._id, value)}
    //                           data-id={property._id}
    //                         />
    //                       </Tooltip>
    //                     : <Tooltip title='Please add the position of property'>No data</Tooltip>    
    //                     }
                        
    //                     <Checkbox
    //                       onChange={handleCheckboxChange(property._id)}
    //                       className='item-wrapper__upper-content--checkbox'
    //                       id={property._id}
    //                     ></Checkbox>
    //                   </Col>

    //                 <Col xxl={4} xl={4} lg={4} md={4} sm={4}>
    //                   {property.images?.length ? 
    //                     <img 
    //                       src={property.images?.[0] ?? ""} 
    //                       className='item-wrapper__upper-content--image' 
    //                       alt='property img' 
    //                     />
    //                   : <span className='d-flex justify-content-center align-items-center' style={{height: "100%"}}> No image </span>
    //                   }
    //                 </Col>
    //                 <Col 
    //                   xxl={7} xl={7} lg={7} md={7} sm={7}
    //                   className='item-wrapper__custom-col' 
    //                 >
    //                   <div>
    //                     <h3 className='item-wrapper__upper-content--title'>
    //                       {property.title}
    //                     </h3>
    //                     <div className='item-wrapper__upper-content--location'>
    //                       {property.location ? (
    //                         <span>{property.location.city}, {property.location.district}</span>
    //                       ) : "No information"}
    //                     </div>
    //                   </div>
    //                   <div>
    //                     {property.price ? 
    //                       <span className='item-wrapper__upper-content--price'>
    //                         <span className='price-number'>
    //                           { property.price > 1000 ? property.price / 1000 : property.price }
    //                         </span>
    //                         <span className='price-unit'>{getPriceUnit(property.price)}
    //                           <span style={{ margin: '0 .85rem' }}>/</span>
    //                         </span>
    //                       </span>
    //                       : <Tooltip title='No data of price'>...</Tooltip>
    //                     }
    //                     {property.area?.propertyWidth && property.area?.propertyLength ? 
    //                       <span className='item-wrapper__upper-content--area'>
    //                         <span className='area-number'>
    //                           {property.area.propertyWidth * property.area.propertyLength}
    //                         </span>
    //                         <span className='area-unit'>m²</span>
    //                       </span>
    //                       : <Tooltip title='No data of area'>...</Tooltip>
    //                     }
    //                   </div>
    //                 </Col>
    //                 <Col xxl={3} xl={3} lg={3} md={3} sm={3}>
    //                   <div className='item-wrapper__upper-content--rooms'>
    //                     {property.propertyDetails?.features ? (
    //                       <div className='d-flex flex-column justify-content-center'>
    //                         <RoomCountTooltip roomList={property.propertyDetails?.features} type="bedrooms" />
    //                         <RoomCountTooltip roomList={property.propertyDetails?.features} type="bathrooms" />
    //                         <ViewCount propertyView={property.view} />
    //                       </div>
    //                     ) : (
    //                       <>
    //                         <RoomCountTooltip roomList={null} type="bedrooms" />
    //                         <RoomCountTooltip roomList={null} type="bathrooms" />
    //                         <ViewCount propertyView={property.view} />
    //                       </>
    //                     )}
    //                   </div>
    //                 </Col>
    //                 <Col
    //                   className='item-wrapper__custom-col-two'  
    //                   xxl={6} xl={6} lg={6} md={6} sm={6}
    //                 >
    //                   <div style={{marginLeft: "2rem"}}>
    //                     {property.status && property._id ? (
    //                       <StatusButton itemId={property._id} status={property.status} />
    //                     ) : (
    //                       <Tooltip title='Please add property status or id'>No data</Tooltip>
    //                     )}
    //                     <div className='item-wrapper__upper-content--listing-type'>
    //                       <p className='tag-text'>Tags: </p>
    //                       <Space size={[0, 8]} wrap>
    //                         {property.listingType === 'forSale' 
    //                           && renderTag(property.listingType, { forSale: 'green', forRent: 'orange' })}
    //                         {property.propertyDetails?.propertyType === 'house' 
    //                         && renderTag(property.propertyDetails.propertyType, { house: 'purple', apartment: 'blue' })}
    //                       </Space>
    //                     </div>
    //                   </div>
    //                 </Col>
    //                 <Col
    //                   className='item-wrapper__custom-col-two'  
    //                   xxl={2} xl={2} lg={2} md={2} sm={2}
    //                 >
    //                   <div className='button-wrapper'>
    //                     <Link to={`/admin/properties/detail/${property._id}`}> 
    //                       <Button className='detail-btn'>Detail</Button> 
    //                     </Link>
    //                     <Link to={`/admin/properties/edit/${property._id}`}> 
    //                       <Button className='edit-btn'>Edit</Button> 
    //                     </Link>
    //                     <Link to={`/admin/properties/delete/${property._id}`}> 
    //                       <Button type="primary" danger>Delete</Button> 
    //                     </Link>
    //                   </div>
    //                 </Col>
    //               </div>
    //             </Row>
    //             <div className='line'></div>
    //             <Row>
    //               <Col span={24}>
    //                 <div className='item-wrapper__lower-content'>
    //                   <div className='item-wrapper__lower-content--date-created'>
    //                     Created: {property.createdAt ? new Date(property.createdAt).toLocaleString() : 'No data'}
    //                   </div>
    //                   <div className='item-wrapper__lower-content--date-created'>
    //                     Expire: {property.expireAt ? new Date(property.expireAt).toLocaleString() : 'No data'}
    //                   </div>
    //                 </div>
    //               </Col>
    //             </Row>
    //           </div>
    //         ))
    //       ) : (
    //         <>Loading...</>
    //       )}
    //     </Skeleton>
    //   )}
    //   <Pagination
    //     // showSizeChanger
    //     showQuickJumper
    //     pageSize={paginationObj.limitItems || 4}
    //     onChange={onPageChange}
    //     defaultCurrent={paginationObj.currentPage || 1}
    //     total={propertyCount}
    //   />
    // </>
    <>
      Testing
    </>
  );
};

export default PropertyCategories;
