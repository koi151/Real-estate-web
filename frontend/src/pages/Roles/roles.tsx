import { Breadcrumb, Button, message, Popconfirm, Table, Tooltip, type TableProps, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from "react"
import { RolesType } from '../../../../backend/commonTypes';
import AdminRolesService from '../../services/admin/roles.service';
import { Link, useLocation } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';

const AdminRoles: React.FC = () => {
  const location = useLocation();

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
          <Tooltip title='Edit role'>
            <Link to={`/admin/roles/edit/${role._id}`}> 
              <Button 
                icon={<EditOutlined />}
                className='mr-1 edit-btn-2'
              />
            </Link>
            </Tooltip>
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
        } else {
          message.error(response.message, 2);
        }

      } catch (error) {
        message.error('No role found', 2);
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [])

  const confirmDelete = async (id?: string) => {
    if (!id) {
      message.error('Error occurred, can not delete');
      console.log('Can not get id')
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
      <div className='d-flex justify-content-end' style={{width: '100%'}}>
        <Link to={`${location.pathname}/create`} className='custom-link mb-3'>
          <Button className='add-new-button'>
            Add new <FaPlus />
          </Button>
        </Link>
      </div>

      {!loading ? 
        <Table columns={columns} dataSource={roles}/>  
      : 
      <div className='d-flex justify-content-center' style={{width: "100%", height: "20rem"}}>
        <Spin tip='Loading...' size="large">
          <div className="content" />
        </Spin>
      </div>
      }
    </>
  )
}

export default AdminRoles;

