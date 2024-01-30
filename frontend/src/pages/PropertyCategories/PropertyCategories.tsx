import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Image, InputNumber, Pagination, Popconfirm, Row, Skeleton, Tooltip, message } from 'antd';
import { Link } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import propertyCategoriesService from '../../services/admin/property-categories.service';
import { PropertyCategoryType } from '../../../../backend/commonTypes';
import { SortingQuery } from '../../../../backend/commonTypes';
import StatusButton from '../../components/StatusButton/statusButton';

import sanitizeHtml from 'sanitize-html';
import '../Properties/properties.scss';

const PropertyCategories: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<PropertyCategoryType[]>([]);
  const [error, setError] = useState<string | null>(null); 

  // Searching and filtering
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string | null>(null); 
  const [sorting, setSorting] = useState<SortingQuery>(
    { sortKey: '', sortValue: '' }
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await propertyCategoriesService.getPropertyCategories({ 
          ...(keyword && { keyword }), 
          ...(status && { status }), 
          ...(sorting?.sortKey && { sortKey: sorting.sortKey }), 
          ...(sorting?.sortValue && { sortValue: sorting.sortValue }), 
          currentPage: currentPage,
          pageSize: 2
        });


        if(response?.code === 200) {
          setCategoryList(response.categories);
          // setPaginationObj(response.paginationObject);
          // setPropertyCount(response.propertyCount);
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
  }, []);

  const onChangePosition = (id: string | undefined, position: number | null) => {
    // if (position === null || id === undefined){
    //   message.error("Error occurred, can not change position of property");
    //   console.log('id or value parameter is undefined')
    // }

    // const currentCheckBox = document.querySelector(`.item-wrapper__upper-content--checkbox span input[id="${id}"]`) as HTMLInputElement;
    // if (currentCheckBox?.checked) {
    //   setCheckedList([...checkedList, `${id}-${position}`]);
    // }
    console.log('position change')
  }

  const handleCheckboxChange = (id: string | undefined) => (e: CheckboxChangeEvent) => {
    // if (id === undefined) {
    //   message.error('Error occurred', 3);
    //   console.log('id parameter is undefined');
    //   return;
    // }
    // if (e.target.checked) {
    //   const position = document.querySelector(`.item-wrapper__upper-content--position input[data-id="${id}"]`) as HTMLInputElement;
    //   setCheckedList([...checkedList, `${id}-${position.value}`]);
    // } else {
    //   setCheckedList(checkedList.filter((itemId) => itemId !== id));
    // }
    console.log('handleCheckboxChange')
  };

  // Delete item
  const confirmDelete = async (id?: string) => {
    if (!id) {
      message.error('Error occurred, can not delete');
      console.log('Can not get id')
      return;
    } 
    const response = await propertyCategoriesService.deleteCategory(id);

    if (response?.code === 200) {
      message.success(response.message, 3);
      setCategoryList(prevCategoryList => prevCategoryList.filter(category => category._id !== id));

    } else {
      message.error('Error occurred, can not delete');
    }
  };
  
  //keyword, status, sorting, currentPage

  return (
    <>
      { error ? (
        <div>{error}</div>
      ) : (
        <>
          <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
            {categoryList?.length > 0 ? (
              categoryList.map((category, index) => {
                const cleanHtml = sanitizeHtml(category.description, {
                  allowedTags: false,
                  allowedAttributes: false,
                  allowedStyles: {
                    '*': {
                      'color': [/^rgb\(\d+,\s*\d+,\s*\d+\)$/, /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/],
                    },
                  },                
                });
                
                return (
                  <div className='item-wrapper' key={index} data-id={category._id}>  
                    <Row className='item-wrapper__custom-row'>
                      <div className='item-wrapper__upper-content' key={index}>
                        <Col
                          className='d-flex flex-column justify-content-center'  
                          span={1}
                        >
                          {category.position ?
                            <Tooltip title={
                              <span>
                                Category at <span style={{ color: 'orange' }}>#{category.position}</span> position
                              </span>
                            }>
                              <InputNumber
                                min={0}
                                className='item-wrapper__upper-content--position' 
                                defaultValue={category.position} 
                                onChange={(value) => onChangePosition(category._id, value)}
                                data-id={category._id}
                              />
                            </Tooltip>
                          : <Tooltip title='Please add the position of property'>No data</Tooltip>    
                          }
                          <Checkbox
                            onChange={handleCheckboxChange(category._id)}
                            className='item-wrapper__upper-content--checkbox'
                            id={category._id}
                          ></Checkbox>
                        </Col>

                        <Col xxl={4} xl={4} lg={4} md={4} sm={4}>
                          {category.images?.length ? 
                            <Image
                              src={category.images?.[0] ?? ""} 
                              alt='category img' 
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
                              {category.title}
                            </h3>
                            <div 
                              key={index} 
                              data-id={category._id}
                              dangerouslySetInnerHTML={{ __html: cleanHtml }}
                            /></div>
                        </Col>
                        <Col
                          className='item-wrapper__custom-col-two'  
                          xxl={6} xl={6} lg={6} md={6} sm={6}
                        >
                          <div style={{marginLeft: "2rem"}}>
                            {category.status && category._id ? (
                              <StatusButton typeofChange='changePropertyCategoriesStatus' itemId={category._id} status={category.status} />
                            ) : (
                              <Tooltip title='Please add property status or id'>No data</Tooltip>
                            )}
                          </div>
                        </Col>
                        <Col
                          className='item-wrapper__custom-col-two'  
                          xxl={2} xl={2} lg={2} md={2} sm={2}
                        >
                          <div className='button-wrapper'>
                            <Link to={`/admin/property-categories/detail/${category._id}`}> 
                              <Button className='detail-btn'>Detail</Button> 
                            </Link>
                            <Link to={`/admin/property-categories/edit/${category._id}`}> 
                              <Button className='edit-btn'>Edit</Button> 
                            </Link>
                            <Popconfirm
                              title="Delete the task"
                              description="Are you sure to delete this property category?"
                              onConfirm={() => confirmDelete(category._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary" danger>Delete</Button> 
                          </Popconfirm>
                          </div>
                        </Col>
                      </div>
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
        // pageSize={paginationObj.limitItems || 4}
        // onChange={onPageChange}
        // defaultCurrent={paginationObj.currentPage || 1}
        // total={propertyCount}
      />
    </>
  );
};

export default PropertyCategories;
