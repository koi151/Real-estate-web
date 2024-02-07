import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "antd/es/select";
import { Badge, Button, Card, Col, 
        Form, Input, Radio, Row, Spin, message } from "antd";

import UploadMultipleFile from "../../components/admin/UploadMultipleFile/uploadMultipleFile";
import adminAccountsService from "../../services/admin/accounts.service";
import { AdminAccountType } from "../../../../backend/commonTypes";

const EditAdminAccounts: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState<AdminAccountType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // data from child component
  const [imageUrlToRemove, setImageUrlToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Could not found account, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        const response = await adminAccountsService.getSingleAccount(id);

        if(response?.code === 200 && response.account) {
          setAccount(response.account);
          setLoading(false);
        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (error) {
        message.error('Could not found administrator account information', 3);
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [id])

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

  const handleImageUrlRemove = (imageUrl: string | undefined) => {
    // Check if imageUrl is not undefined and not already in the array
    if (imageUrlToRemove !== undefined && imageUrl !== undefined) {
      setImageUrlToRemove(prevImages => [...prevImages, imageUrl]);
    }
  }

  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get administrator account id');
        message.error('Error occurred', 3);
        return;
      }
      
      const formData = new FormData();

      data.fullName && formData.append('fullName', data.fullName);
      data.password && formData.append('password', data.password);
      data.email && formData.append('email', data.email);
      data.status && formData.append('status', data.status);
      data.phone && formData.append('phone', data.phone); 

      // Append avatar
      if (data.images?.length > 0) {
        data.images.forEach((imageFile: any) => {
          if (!imageFile.hasOwnProperty('uploaded') || (imageFile.hasOwnProperty('uploaded') && !imageFile.uploaded)) {
            formData.append('avatar', imageFile.originFileObj);
          }
        });
      }

      // Append image urls that need to remove from db
      if (imageUrlToRemove.length > 0) {
        imageUrlToRemove.forEach((imageUrl) => {
          formData.append(`images_remove`, imageUrl);
        });
      }

      const response = await adminAccountsService.updateAccount(formData, id);
      
      if (response.code === 200) {
        message.success('Account updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (err) {
      console.log(err);
      message.error("Error occurred while updating account.");
    }
  }

  return (
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
              title="Create administrator account" 
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
                    rules={[{ type: 'email' }]}
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
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
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
                    setImageUrlRemove={handleImageUrlRemove}
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
  )
}

export default EditAdminAccounts;