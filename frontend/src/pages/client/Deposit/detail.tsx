import { Badge, Button, Card, Col, Form, Radio, Row, Select, Space } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import './detail.scss'

const DepositDetail: React.FC = () => {

  const depositOptions = [
    {
      value: '0.2',
      label: '200.000 đ',
    },
    {
      value: '0.5',
      label: '500.000 đ',
    },
    {
      value: '1',
      label: '1.000.000 đ',
    },
    {
      value: '2',
      label: '2.000.000 đ',
    },
    {
      value: '3',
      label: '3.000.000 đ',
    },
    {
      value: '5',
      label: '5.000.000 đ',
    },
    {
      value: '10',
      label: '10.000.000 đ',
    },
  ];
  
  return (
    <div className="deposit-detail-wrapper">
      <Form
        style={{width: "75%"}}
        layout="vertical" 
        // onFinish={onFinishForm}
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
                  name='deposit' 
                  style={{height: "4.5rem"}}
                >
                  <Select
                    className="deposit-detail-wrapper--select"
                    placeholder='Minimum deposit: 10.000 đ' 
                    options={depositOptions} 
                    showSearch
                    mode='tags'
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="mt-3">
                <Form.Item 
                  label='Choose payment method' 
                  name='paymentMethod' 
                >
                  <Radio.Group 
                    // onChange={onChange}
                    defaultValue={1} 
                  >
                    <Space direction="vertical" className="ml-2">
                      <Radio value={1}>VNPAYQR Payment Gateway</Radio>
                      <Radio value={2}>Payment via ATM - Domestic bank account</Radio>
                      <Radio value={3}>Payment via international card</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24} className="mt-3">
                <Form.Item 
                  label='Choose language' 
                  name='lang' 
                >
                  <Radio.Group 
                    // onChange={onChange} 
                    defaultValue='vn'
                  >
                    <Space direction="vertical" className="ml-2">
                      <Radio value='en'>English</Radio>
                      <Radio value='vn'>Vietnamese</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24} className="d-flex mt-2">
                <Link 
                  className="deposit-detail-wrapper__link"
                  to={'/deposit/vnpay/qr-code'}
                >
                  <Button className="deposit-detail-wrapper__link--btn">
                    Continue
                  </Button>
                </Link>
              </Col>
            </Row>            
          </Card>
        </Badge.Ribbon>
      </Form>
    </div>
  )
}

export default DepositDetail;