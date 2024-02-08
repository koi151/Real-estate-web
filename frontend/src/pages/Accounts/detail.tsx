import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Card, Col, Form, Input, Radio, Row, Spin, message } from "antd";

import UploadMultipleFile from "../../components/admin/UploadMultipleFile/uploadMultipleFile";
import adminAccountsService from "../../services/admin/accounts.service";
import { AdminAccountType } from "../../../../backend/commonTypes";

const AdminAccountsDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState<AdminAccountType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

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
          disabled
          className="custom-form" 
        >
          <Badge.Ribbon text={<Link to="/admin/accounts">Back</Link>} color="purple" className="custom-ribbon">
            <Card 
              title="View administrator account" 
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
                      id="fullName" disabled
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
                      type='email' id="email" disabled
                      placeholder="Please enter your email"
                    />
                  </Form.Item>
                </Col>

                <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="phone"
                    label="Phone number:"
                    initialValue={account?.phone}
                  >
                    <Input 
                      placeholder="Phone empty"
                      style={{ width: '100%' }} 
                      disabled
                    />
                  </Form.Item>
                </Col>
                
                <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item label="Account status:" name='status' initialValue={account?.status}>
                    <Radio.Group disabled>
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
              </Row>
            </Card>
          </Badge.Ribbon>
        </Form>
      </div>
      )}
    </>
  )
}

export default AdminAccountsDetail;