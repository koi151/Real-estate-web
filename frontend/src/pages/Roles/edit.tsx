import { Button, Card, Col, Form, Input, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminRolesService from "../../services/admin/roles.service";
import { RolesType } from "../../../../backend/commonTypes";
import TextArea from "antd/es/input/TextArea";

const EditRole: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RolesType | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Can not find role, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        const response = await AdminRolesService.getSingleRole(id);

        if(response?.code === 200 && response.role) {
          setRole(response.role);
          setLoading(false);
        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (error) {
        message.error('No role found', 2);
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [id])

  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get role id');
        message.error('Error occurred', 3);
        return;
      }

      const response = await AdminRolesService.updateRole(data, id);
      
      if (response.code === 200) {
        message.success('Role updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (error) {
      console.log("Error occurred:", error);
      message.error("Error occurred while updating role.");
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
          >
            <Card 
              title="Property role information" 
              className="custom-card" 
              style={{marginTop: '2rem'}}
              extra={<Link to="/admin/roles">Back</Link>}
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
                      Update
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </div>
      )}
  </>
  )
}

export default EditRole;