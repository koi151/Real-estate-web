import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Checkbox, Col, Image, InputNumber, Pagination, PaginationProps, Popconfirm, Row, Skeleton, Tooltip, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import { PaginationObject, AdminAccountType } from '../../../../backend/commonTypes';
import { SortingQuery } from '../../../../backend/commonTypes';
import StatusButton from '../../components/admin/StatusButton/statusButton';

import '../Properties/properties.scss';
import FilterBox from '../../components/admin/FilterBox/filterBox';
import adminAccountsService from '../../services/admin/accounts.service';
import { FaPlus } from 'react-icons/fa';

const AdminAccounts: React.FC = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [accountList, setAccountList] = useState<AdminAccountType[]>([]);
  const [error, setError] = useState<string | null>(null); 
  // const [accountCount, setaccountCount] = useState<number>(0);

  // Searching and filtering
  const [checkedList, setCheckedList] = useState<string[]>([]);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [status, setStatus] = useState<string | null>(null);
  // const [keyword, setKeyword] = useState<string | null>(null); 

  // const [sorting, setSorting] = useState<SortingQuery>(
  //   { sortKey: '', sortValue: '' }
  // )

  // const [paginationObj, setPaginationObj] = useState<PaginationObject>({
  //   currentPage: null,
  //   limitItems: null,
  //   skip: null,
  //   totalPage: null,
  // })

  // const onPageChange: PaginationProps['onChange'] = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await adminAccountsService.getAccounts();

        if(response?.code === 200) {
          setAccountList(response.accounts);
          // setPaginationObj(response.paginationObject);
          // setaccountCount(response.accountCount);
          setLoading(false);
        } else {
          message.error(response.message, 2);
        }

      } catch (error) {
        message.error('No account found', 2);
        setError('No account found.');
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, []);
  // keyword, status, sorting, currentPage

  // const onChangePosition = (id: string | undefined, position: number | null) => {
  //   if (position === null || id === undefined){
  //     message.error("Error occurred, can not change position of account");
  //     console.log('id or value parameter is undefined')
  //   }

  //   const currentCheckBox = document.querySelector(`.item-wrapper__upper-content--checkbox span input[id="${id}"]`) as HTMLInputElement;
  //   if (currentCheckBox?.checked) {
  //     setCheckedList([...checkedList, `${id}-${position}`]);
  //   }
  // }

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

  // const handleKeywordChange = (newKeyword: string | null) => {
  //   setKeyword(newKeyword);
  // };

  // const handleStatusChange = (newStatus: string | null) => {
  //   setStatus(newStatus);
  // };

  // const handleSortingChange = (newSorting: any) => {
  //   setSorting(newSorting);
  // }

  // const resetFilters = () => {
  //   setKeyword(null);
  //   setStatus(null);
  //   setSorting({sortKey: '', sortValue: ''});
  //   navigate('/admin/property-categories');
  // }

  // Delete item
  const confirmDelete = async (id?: string) => {
    if (!id) {
      message.error('Error occurred, can not delete');
      console.log('Can not get id')
      return;
    } 
    const response = await adminAccountsService.deleteAccount(id);

    if (response?.code === 200) {
      message.success(response.message, 3);
      setAccountList(prevaccountList => prevaccountList.filter(account => account._id !== id));

    } else {
      message.error('Error occurred, can not delete');
    }
  };
  

  return (
    <>
      <div className='title-wrapper'>
        <h1 className="main-content-title">Administrator accounts:</h1>
        <Breadcrumb
          className='mt-1 mb-1'
          items={[
            { title: <Link to="/admin">Admin</Link> },
            { title: <Link to="/admin/accounts">Accounts</Link> },
          ]}
        />
      </div>

      {/* <FilterBox
        onListingTypeChange={() => {}}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onSortingChange={handleSortingChange}
        checkedList={checkedList}
        resetFilters={resetFilters}
      /> */}

      { error ? (
        <div>{error}</div>
      ) : (
        <>
          <Skeleton loading={loading} active style={{ padding: '3.5rem' }}>
            <div className='d-flex justify-content-end' style={{width: '100%'}}>
              <Link to={`${location.pathname}/create`} className='custom-link'>
                <Button className='add-new-button'>
                  Add new <FaPlus />
                </Button>
              </Link>
            </div>

            {accountList?.length > 0 ? (
              accountList.map((account, index) => {
                
                return (
                  <div className='item-wrapper' key={index} data-id={account._id}>  
                    <Row className='item-wrapper__custom-row'>
                      <div className='item-wrapper__upper-content' key={index}>
                        <Col
                          className='d-flex flex-column justify-content-center'  
                          span={1}
                        >
                          <Checkbox
                            onChange={handleCheckboxChange(account._id)}
                            className='item-wrapper__upper-content--checkbox'
                            id={account._id}
                          ></Checkbox>
                        </Col>

                        <Col xxl={4} xl={4} lg={4} md={4} sm={4}>
                          {account.avatar ? 
                            <Image
                              src={account.avatar ?? ""} 
                              alt='avatar thumbnail' 
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
                              { account.fullName }
                            </h3>
                            <div className='mt-2'>
                              Role: <b style={{color: '#777'}}>{ account.roleTitle }</b>
                            </div>
                            <div className='mt-2'>
                              Email: { account.email }
                            </div>
                            <div className='mt-1'>
                              Phone: { account.phone }
                            </div>
                          </div>
                        </Col>
                        <Col
                          className='item-wrapper__custom-col-two'  
                          xxl={6} xl={6} lg={6} md={6} sm={6}
                        >
                          <div style={{marginLeft: "2rem"}}>
                            {account.status && account._id ? (
                              <StatusButton 
                                typeofChange='changeAccountStatus' 
                                itemId={account._id} 
                                status={account.status} 
                              />
                            ) : (
                              <Tooltip title='Please add account status or id'>No data</Tooltip>
                            )}
                          </div>
                        </Col>
                        <Col xxl={3} xl={3} lg={3} md={3} sm={3}></Col>
                        <Col
                          className='item-wrapper__custom-col-two'  
                          xxl={2} xl={2} lg={2} md={2} sm={2}
                        >
                          <div className='button-wrapper'>
                            <Link to={`/admin/accounts/detail/${account._id}`}> 
                              <Button className='detail-btn'>Detail</Button> 
                            </Link>
                            <Link to={`/admin/accounts/edit/${account._id}`}> 
                              <Button className='edit-btn'>Edit</Button> 
                            </Link>
                            <Popconfirm
                              title="Delete the task"
                              description="Are you sure to delete this property account?"
                              onConfirm={() => confirmDelete(account._id)}
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
                            Created at: {account.createdAt ? new Date(account.createdAt).toLocaleString() : 'No data'}
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
      {/* <Pagination
        showSizeChanger
        showQuickJumper
        pageSize={paginationObj.limitItems || 4}
        onChange={onPageChange}
        defaultCurrent={paginationObj.currentPage || 1}
        total={accountCount}
      /> */}
    </>
  );
};

export default AdminAccounts;
