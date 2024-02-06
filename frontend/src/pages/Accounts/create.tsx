import React from "react";
import { Link } from "react-router-dom";
import Select from "antd/es/select";
import { Badge, Button, Card, Col, 
        Form, Input, Radio, Row, message } from "antd";

import UploadMultipleFile from "../../components/admin/UploadMultipleFile/uploadMultipleFile";
import adminAccountsService from "../../services/admin/accounts.service";

const CreateAdminAccounts: React.FC = () => {

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

  const onFinishForm = async (data: any) => {
    try {
      console.log('data:', data)
      const formData = new FormData();

      data.title && formData.append('title', data.title);
      data.password && formData.append('password', data.password);
      data.email && formData.append('email', data.email);
      data.status && formData.append('status', data.status);
      data.phone && formData.append('phone', data.phone);

      // Append avatar
      data.images && formData.append('avatar', data.images[0].originFileObj);   

      const response = await adminAccountsService.createAccount(formData);
      
      if (response.code === 200) {
        message.success('Account created successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (err) {
      console.log(err);
      message.error("Error occurred while creating account.");
    }
  }

  return (
    <>
    {/* { loading ? (
        <div className='d-flex justify-content-center' style={{width: "100%", height: "100vh"}}>
          <Spin tip='Loading...' size="large">
            <div className="content" />
          </Spin>
        </div>
    ) : ( */}
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
                    label='Please enter your email' 
                    name='email' 
                    rules={[{ type: 'email' }]}
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
                    label="Password"
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
                    label="Confirm Password"
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
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                  >
                    <Input 
                      placeholder="Please enter your phone"
                      addonBefore={prefixSelector} 
                      style={{ width: '100%' }} 
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
    {/* )} */}
    </>
  )
}

export default CreateAdminAccounts;