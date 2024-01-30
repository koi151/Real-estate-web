import { Breadcrumb, Button, message, Popconfirm, Table, Tooltip, type TableProps } from 'antd';
import React, { useEffect, useState } from "react"
import { RolesType } from '../../../../backend/commonTypes';
import AdminRolesService from '../../services/admin/roles.service';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SolutionOutlined } from '@ant-design/icons';

const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<RolesType[]>([]);
  const [error, setError] = useState<string | null>(null); 

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
                className='mr-1 detail-btn' 
              />
            </Link>
          </Tooltip>
          <Tooltip title='Edit role'>
            <Link to={`/admin/roles/edit/${role._id}`}> 
              <Button 
                icon={<EditOutlined />}
                className='mr-1 edit-btn'
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
                className='mr-1 delete-btn'
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
        } else {
          message.error(response.message, 2);
        }

      } catch (error) {
        message.error('No role found', 2);
        setError('No role found.');
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
      <h1 className="main-content-title">Properties:</h1>
      <Breadcrumb style={{ margin: '16px 0' }} items={[
        {breadcrumbName: 'Admin'},
        {breadcrumbName: 'roles'}
      ]} />
      <Table columns={columns} dataSource={roles}/>
    </>
  )
}

export default AdminRoles;

