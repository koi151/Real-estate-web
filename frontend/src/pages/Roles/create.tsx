import { Badge, Button, Card, Col, Form, Input, Row, Spin, message } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminRolesService from "../../services/admin/roles.service";
import { RolesType } from "../../../../backend/commonTypes";
import TextArea from "antd/es/input/TextArea";

const CreateAdminRole: React.FC = () => {

  const [role, setRole] = useState<RolesType | undefined>(undefined);

  const onFinishForm = async (data: any) => {
    try {

      const response = await AdminRolesService.createRole(data);
      
      if (response.code === 200) {
        message.success('Role created successfully!', 3);
      } else {
        message.error(response.message, 3);
      }
  
    } catch (error) {
      console.log("Error occurred:", error);
      message.error("Error occurred while creating role.");
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
            className="custom-form" 
          >
            <Badge.Ribbon text={<Link to="/admin/roles">Back</Link>} color="purple" className="custom-ribbon">
              <Card 
                title="Property role information" 
                className="custom-card" 
                style={{marginTop: '2rem'}}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item 
                      label={<span>Role title <b className="required-txt">- required:</b></span>}
                      name='title'
                      initialValue={role?.title}
                    >
                      <Input type="text" id="title" required />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item 
                      label={`Role description:`} 
                      initialValue={role?.description}
                      name='description'  
                    >
                      <TextArea rows={5} placeholder="Enter role descripton here" />
                    </Form.Item>
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

export default CreateAdminRole;