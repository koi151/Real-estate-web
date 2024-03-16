import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "antd/es/select";
import { Badge, Button, Card, Col, 
        Form, Input, Radio, Row, Spin, message } from "antd";

import adminAccountsService from "../../../services/admin/accounts.service";
import AdminRolesService from "../../../services/admin/roles.service";

import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import * as standardizeData from '../../../helpers/standardizeData'

import { RoleTitleType } from "../../../../../backend/commonTypes";

const CreateAdminAccounts: React.FC = () => {

  const navigate = useNavigate();

  const [accessAllowed, setAccessAllowed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [roleTitles, setRoleTitles] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getRoleTitles();

        if(response?.code === 200) {
          setAccessAllowed(true);

          const formattedTitles = response?.roleTitles.map((role: RoleTitleType) => (
            { "value": role._id, "label": role.title }
          )) 
          setRoleTitles(formattedTitles);

        } else {
          setAccessAllowed(false);
          message.error(response.message, 2);
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching administrator account data', 2);
          console.log('Error occurred:', err);
        }

        setAccessAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate])

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

  // Select 
  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // Sample phone option
  const prefixSelector = (
    <Form.Item noStyle>
      <Select defaultValue="84" style={{ width: "7rem" }}>
        <Select.Option value="84">+84</Select.Option>
        <Select.Option value="85">+85</Select.Option>
        <Select.Option value="86">+86</Select.Option>
      </Select>
    </Form.Item>
  );

  const onFinishForm = async (data: any) => {
    try {            
      const formData = standardizeData.objectToFormData(data);

      const response = await adminAccountsService.createAccount(formData);
      
      if (response.code === 200) {
        message.success('Account created successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        message.error('Unauthorized - Please log in to access this feature.', 3);
        navigate('/admin/auth/login');
      } else {
        message.error('Error occurred while creating administrator account', 2);
        console.log('Error occurred:', err);
      }
    }
  }

  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <div className="d-flex align-items-center justify-content-center"> 
              <Form 
                layout="vertical" 
                onFinish={onFinishForm}
                method="POST"
                encType="multipart/form-data"
                className="custom-form" 
                validateMessages={validateMessages}
              >
                <Badge.Ribbon text={<Link to="/admin/property-categories">Back</Link>} color="purple" className="custom-ribbon">
                  <Card 
                    title="Create administrator account" 
                    className="custom-card" 
                    style={{marginTop: '2rem'}}
                    extra={<Link to="/admin/accounts">Back</Link>}
                  >
                    <Row gutter={16}>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label={<span>Full name <b className="required-txt">- required:</b></span>}
                          name='fullName'
                          rules={[{ required: true }]}
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
                          label="Password:"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                            {
                              min: 6, 
                              message: 'Password must be at least 6 characters long!',
                            },
                            {
                              max: 20,
                              message: 'Password must be at most 20 characters long!',
                            },
                          ]}
                          hasFeedback
                        >
                          <Input.Password placeholder="Please enter your password"/>
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          name="confirm"
                          label="Confirm Password:"
                          dependencies={['password']}
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: 'Please confirm your password!',
                            },
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
                          rules={[{ message: 'Please input your phone number!' }]}
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
                        <Form.Item label="Account status:" name='status' initialValue={'active'}>
                          <Radio.Group>
                            <Radio value="active">Active</Radio>
                            <Radio value="inactive">Inactive</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <UploadMultipleFile singleImageMode={true} />
                      </Col>
                      
                      <Col span={24}>
                        <Form.Item>
                          <Button className='custom-btn-main' type="primary" htmlType="submit">
                            Create
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              </Form>
            </div>
          ) : (
            <NoPermission permissionType='access' />
          )}
        </>
      ) : (
        <div className='d-flex justify-content-center' style={{width: "100%", height: "100vh"}}>
          <Spin tip='Loading...' size="large">
            <div className="content" />
          </Spin>
        </div>
      )}
    </>
  )
}

export default CreateAdminAccounts;