import { Breadcrumb, Button, message, Popconfirm, Table, 
         Tooltip, type TableProps, Spin } from 'antd';
import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { RolesType } from '../../../../backend/commonTypes';
import AdminRolesService from '../../services/admin/roles.service';
import NoPermission from '../../components/admin/NoPermission/noPermission';
import { setPermissions } from '../../redux/reduxSlices/permissionsSlice';
import { RootState } from '../../redux/stores';

const AdminRoles: React.FC = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [accessAllowed, setAccessAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<RolesType[]>([]);

  const columns: TableProps<RolesType>['columns'] = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
      align: 'center'
    },
    {
      title: 'Group roles',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: 'Short description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (text, role, index) => (
        <div className='d-flex justify-content-center align-items-center'>
          <Tooltip title='View detail'>
            <Link to={`/admin/roles/detail/${role._id}`}> 
              <Button 
                icon={<SolutionOutlined />} 
                className='mr-1 detail-btn-2' 
              />
            </Link>
          </Tooltip>
          {currentUserPermissions?.administratorRolesEdit && (
            <Tooltip title='Edit role'>
              <Link to={`/admin/roles/edit/${role._id}`}> 
                <Button 
                  icon={<EditOutlined />}
                  className='mr-1 edit-btn-2'
                />
              </Link>
            </Tooltip>
          )}
          {currentUserPermissions?.administratorRolesDelete && (
            <Tooltip title='Delete role'>
              <Popconfirm
                title="Delete role"
                description="Are you sure to delete this role?"
                onConfirm={() => confirmDelete(role._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  icon={<DeleteOutlined />} 
                  className='mr-1 delete-btn-2'
                />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      )
    }
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getRoles();

        if(response?.code === 200) {
          setRoles(response.roles);
          setLoading(false);

          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

        } else {
          setAccessAllowed(false);
          message.error(response.message, 2);
        }

      } catch (err: any) {
        if ((err.response && err.response.status === 401) || err.message === 'Unauthorized') {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching administrator roles', 2);
          console.log('Error occurred:', err);
        }
      }
    };
    fetchData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmDelete = async (id?: string) => {
    if (!id) {
      message.error('Error occurred, can not delete');
      return;
    } 
    const response = await AdminRolesService.deleteRole(id);

    if (response?.code === 200) {
      message.success(response.message, 3);
      setRoles(prevRoleList => prevRoleList.filter(role => role._id !== id));
    } else {
      message.error('Error occurred, can not delete role');
    }
  };

  return (
    <>
      {accessAllowed ? (
        <>
          <div className='title-wrapper'>
            <h1 className="main-content-title">Admin Roles:</h1>
            <Breadcrumb
              className='mt-1 mb-1'
              items={[
                { title: <Link to="/admin">Admin</Link> },
                { title: <Link to="/admin/roles">Roles</Link> },
              ]}
            />
          </div>

          {!loading ? 
            <>
              <div className='d-flex justify-content-end' style={{width: '100%'}}>
                {currentUserPermissions?.administratorRolesCreate && (
                  <Link to={`${location.pathname}/create`} className='custom-link mb-3'>
                    <Button className='add-new-button'>
                      Add new <FaPlus />
                    </Button>
                  </Link>
                )}
              </div>
              <Table columns={columns} dataSource={roles} rowKey="_id"/>  
            </>
          : 
            <div className='d-flex justify-content-center' style={{width: "100%", height: "20rem"}}>
              <Spin tip='Loading...' size="large">
                <div className="content" />
              </Spin>
            </div>
          }
        </>
      ) : (
        <NoPermission permissionType='view' />
      )}
    </>    
  )
}

export default AdminRoles;

