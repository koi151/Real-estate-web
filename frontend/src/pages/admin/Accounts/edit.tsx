import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "antd/es/select";
import { Badge, Button, Card, Col, 
        Form, Input, Radio, Row, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";

import adminAccountsService from "../../../services/admin/accounts.service";
import AdminRolesService from "../../../services/admin/roles.service";

import NoPermission from "../../../components/admin/NoPermission/noPermission";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import { AdminAccountType, RoleTitleType } from "../../../../../backend/commonTypes";
import * as standardizeData from '../../../helpers/standardizeData'
import { setPermissions } from "../../../redux/reduxSlices/permissionsSlice";


const EditAdminAccounts: React.FC = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [viewAllowed, setViewAllowed] = useState(true);

  const [account, setAccount] = useState<AdminAccountType | undefined>(undefined);
  const [roleTitles, setRoleTitles] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch account data
        if (!id) {
          message.error('Could not found account, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        
        const accountResponse = await adminAccountsService.getSingleAccount(id);
        if(accountResponse?.code === 200 && accountResponse.account) {
          setAccount(accountResponse.account);
        } else {
          message.error(accountResponse.message || 'Could not find administrator account information', 2);
        }
  
        // Fetch role titles
        const roleTitlesResponse = await AdminRolesService.getRoleTitles();
        if(roleTitlesResponse?.code === 200) {
          const formattedTitles = roleTitlesResponse?.roleTitles.map((role: RoleTitleType) => (
            { "value": role._id, "label": role.title }
          ));
          setRoleTitles(formattedTitles);

        } else {
          message.error(roleTitlesResponse.message || 'No roles found', 2);
        }
  
        setLoading(false);
        
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while feaching administrator role', 2);
          console.log('Error occurred:', err);
        }
      }
    };
    
    fetchData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // if permission in redux not existed => fetch permissions
  useEffect(() =>  {
    if (currentUserPermissions?.administratorAccountsEdit)
      return;

    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getPermissions();
        if (response.code === 200) {
          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

          if (!response.permissions.administratorAccountsEdit) {
            setViewAllowed(false)
          }

        } else {
          setViewAllowed(false);
        }

      } catch (err) {
        console.log("Error occurred while fetching permissions:", err);
        message.error('Error occurred, redirect to previous page', 3)
        navigate(-1);
        setViewAllowed(false);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  // Phone
  const prefixSelector = (
    // name="prefix"
    <Form.Item noStyle>
      <Select defaultValue="84" style={{ width: "7rem" }}>
        <Select.Option value="84">+84</Select.Option>
        <Select.Option value="85">+85</Select.Option>
        <Select.Option value="86">+86</Select.Option>
      </Select>
    </Form.Item>
  );

  // Select 
  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
 
  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get administrator account id');
        message.error('Error occurred', 3);
        return;
      }
      
      const formData = standardizeData.objectToFormData(data);
      console.log("data:", data)

      const response = await adminAccountsService.updateAccount(formData, id);
      
      if (response.code === 200) {
        message.success('Account updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        message.error('Unauthorized - Please log in to access this feature.', 3);
        navigate('/admin/auth/login');
      } else {
        message.error('Error occurred while updating administrator account', 2);
        console.log('Error occurred:', err);
      }
    }
  }

  return (
    <>
      {currentUserPermissions?.administratorAccountsEdit || viewAllowed ? (
        <>
          { loading ? (
              <div className='d-flex justify-content-center' style={{width: "100%", height: "100vh"}}>
                <Spin tip='Loading...' size="large">
                  <div className="content" />
                </Spin>
              </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center"> 
              <Form 
                layout="vertical" 
                onFinish={onFinishForm}
                method="POST"
                encType="multipart/form-data"
                className="custom-form" 
                validateMessages={validateMessages}
              >
                <Badge.Ribbon text={<Link to="/admin/accounts">Back</Link>} color="purple" className="custom-ribbon">
                  <Card 
                    title="Edit administrator account" 
                    className="custom-card" 
                    style={{marginTop: '2rem'}}
                    extra={<Link to="/admin/accounts">Back</Link>}
                  >
                    <Row gutter={16}>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label='Full name:'
                          name='fullName'
                          rules={[{ required: true }]}
                          initialValue={account?.fullName}
                        >
                          <Input 
                            type="text" required
                            id="fullName" 
                            placeholder="Please enter your full name"
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label='Email:' 
                          name='email' 
                          rules={[{ type: 'email', required: true }]}
                          initialValue={account?.email}
                        >
                          <Input 
                            type='email' id="email" 
                            placeholder="Please enter your email"
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          name="password"
                          label={<span>Password <b className="required-txt">- change if needed:</b></span>}
                          rules={[
                            { message: 'Please input your password!' },
                            {
                              min: 6, 
                              message: 'Password must be at least 6 characters long!',
                            },
                            {
                              max: 20,
                              message: 'Password must be at most 20 characters long!',
                            },
                          ]}
                        >
                          <Input.Password placeholder="Change your password if needed"/>
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          name="confirm"
                          label="Confirm password:"
                          dependencies={['password']}
                          rules={[
                            { message: 'Please confirm your password!'},
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password placeholder="Confirm your password"/>
                        </Form.Item>
                      </Col>

                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          name="phone"
                          label="Phone number:"
                          initialValue={account?.phone}
                        >
                          <Input 
                            placeholder="Please enter your phone"
                            addonBefore={prefixSelector} 
                            style={{ width: '100%' }} 
                          />
                        </Form.Item>
                      </Col>

                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          name="role_id"
                          label="Administrator role:"
                          required
                          initialValue={account?.role_id}
                        >
                          <Select
                            showSearch
                            placeholder="Select administrator role of account"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={roleTitles}
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Account status:" name='status' initialValue={account?.status}>
                          <Radio.Group>
                            <Radio value="active">Active</Radio>
                            <Radio value="inactive">Inactive</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <UploadMultipleFile 
                          uploadedImages={account?.avatar ? [account.avatar] : []} 
                          singleImageMode={true} />
                      </Col>
                      
                      <Col span={24}>
                        <Form.Item>
                          <Button className='custom-btn-main' type="primary" htmlType="submit">
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              </Form>
            </div>
          )}
        </>
      ) : (
        <NoPermission permissionType='access' />
      )}
    </>
  )
}

export default EditAdminAccounts;