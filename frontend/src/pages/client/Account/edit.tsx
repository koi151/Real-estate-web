import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "antd/es/select";
import { Badge, Button, Card, Col, 
        Form, Input, InputNumber, Radio, Row, Spin, message } from "antd";

import NoPermission from "../../../components/admin/NoPermission/noPermission";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import { ClientAccountType } from "../../../../../backend/commonTypes";
import * as standardizeData from '../../../helpers/standardizeData'
import clientAccountsService from "../../../services/client/accounts.service";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";


const EditClientAccounts: React.FC = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [accessAllowed, setAccessAllowed] = useState<boolean>(true);

  const [account, setAccount] = useState<ClientAccountType | undefined>(undefined);

  // fetch current account data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountResponse = await clientAccountsService.getSingleAccountLocal();
        setLoading(true);

        if(accountResponse?.code === 200 && accountResponse.user) {
          setAccessAllowed(true);
          setAccount(accountResponse.user);
        } else {
          setAccessAllowed(false);
          message.error(accountResponse.message || 'Could not find account information', 2);
        }
          
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setAccessAllowed(false);
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          message.error('Error occurred while fetching account data', 2);
          console.log('Error occurred:', err);
        }
      } finally { 
        setLoading(false);
      }
    };
    
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      if (!id) {
        console.error('Cannot get account id');
        message.error('Error occurred', 3);
        return;
      }
      
      const formData = standardizeData.objectToFormData(data);

      const response = await clientAccountsService.updateCurrentAccount(formData);
      
      if (response.code === 200) {
        message.success('Account updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        message.error('Unauthorized - Please log in to access this feature.', 3);
        navigate('/auth/login');
      } else {
        message.error('Error occurred while updating account', 2);
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
                <Badge.Ribbon text={<Link to="/properties">Back</Link>} color="purple" className="custom-ribbon">
                  <Card 
                    title="Edit account:" 
                    className="custom-card" 
                    style={{marginTop: '2rem'}}
                    extra={<Link to="/properties">Back</Link>}
                  >
                    <Row gutter={16}>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label='User name:'
                          name='userName'
                          rules={[{ required: true }]}
                          initialValue={account?.userName}
                        >
                          <Input 
                            type="text" required
                            id="userName" 
                            placeholder="Please enter your user name"
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label='Current balance (USD):' 
                          >
                            <InputNumber
                              defaultValue={account?.wallet?.balance.toFixed(2)} 
                              disabled type="number" 
                              style={{width: "100%", color: "#000"}}
                            />
                        </Form.Item>
                      </Col>
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

export default EditClientAccounts;