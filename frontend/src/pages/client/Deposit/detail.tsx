import { Badge, Button, Card, Col, Form, Radio, Row, Select, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import './detail.scss'
import orderService from "../../../services/client/order.service";
import { DepositOrderType } from "../../../../../backend/commonTypes";

const DepositDetail: React.FC = () => {
  const navigate = useNavigate();

  const depositOptions = [
    {
      value: '200000',
      label: '200.000 đ ~ 8$',
    },
    {
      value: '500000',
      label: '500.000 đ ~ 20$',
    },
    {
      value: '1000000',
      label: '1.000.000 đ ~ 40$',
    },
    {
      value: '2000000',
      label: '2.000.000 đ ~ 80$',
    },
    {
      value: '3000000',
      label: '3.000.000 đ ~ 120$',
    },
    {
      value: '5000000',
      label: '5.000.000 đ ~ 200$',
    },
    {
      value: '10000000',
      label: '10.000.000 đ ~ 400$',
    },
  ];

  const onFinishForm = async (data: DepositOrderType) => {
    try {  
      const response = await orderService.createPaymentUrlVnPay(data);
  
      if (response.code === 200) {
        window.location.href = response.url;

      } else {
        message.error(response.message, 3);
      }

    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        message.error('Unauthorized - Please log in to access this feature.', 3);
        navigate('/auth/login');
      } else {
        message.error("Error occurred while processing to payment page.");
        console.log("Error occurred:", err)
      }
    }
  }
  
  return (
    <div className="deposit-detail-wrapper">
      <Form
        style={{width: "75%"}}
        layout="vertical" 
        onFinish={onFinishForm}
        method="POST"
        className="custom-form"   
      >
        <Badge.Ribbon text={<Link to="/deposit">Back</Link>} color="purple" className="custom-ribbon">
          <Card 
            title="Create new order"
            className="custom-card" 
          >
            <Row gutter={16} style={{ width: "100%", padding: "0 2rem" }}>
              <Col span={24}>
                <Form.Item 
                  label='Deposit amount' 
                  name='amount' 
                  style={{height: "4.5rem"}}
                  required
                  rules={[
                    {
                      validator: (_, value) => {
                        if (isNaN(value)) {
                          return Promise.reject(new Error("Please enter a valid number"));
                        }
                
                        if (value * 100 < 10000) {
                          return Promise.reject(new Error("Minimum deposit is 10,000 đ"));
                        }
                
                        return Promise.resolve(); // Valid value
                      },
                    },
                  ]}
                >
                  <Select
                    className="deposit-detail-wrapper--select"
                    placeholder='Minimum deposit: 10.000 đ' 
                    options={depositOptions} 
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="mt-3">
                <Form.Item 
                  label='Choose payment method' 
                  name='bankCode' 
                  initialValue=''
                  required
                >
                  <Radio.Group 
                    defaultValue='' 
                  >
                    <Space direction="vertical" className="ml-2">
                      <Radio value=''>
                        VNPAYQR Payment Gateway
                      </Radio>
                      <Radio value='VNBANK'>
                        Payment via ATM - Domestic bank account
                      </Radio>
                      <Radio value='INTCARD'>
                        Payment via international card
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24} className="mt-3">
                <Form.Item 
                  label='Choose language' 
                  name='language'
                  initialValue='vn' 
                  required
                >
                  <Radio.Group 
                    defaultValue='vn'
                  >
                    <Space direction="vertical" className="ml-2">
                      <Radio value='vn'>Vietnamese</Radio>
                      <Radio value='en'>English</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24} className="d-flex mt-2">
                <Form.Item>
                  <Button className='custom-btn-main' type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>            
          </Card>
        </Badge.Ribbon>
      </Form>
    </div>
  )
}

export default DepositDetail;