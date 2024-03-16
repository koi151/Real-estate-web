import { Badge, Card, Col, Form, Row, Segmented, Space, Spin } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import PostType from "../../../components/client/PostType/postType";

import './chooseOptions.scss'


const ChooseOptions: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [accessAllowed, setAccessAllowed] = useState(true);

  const options = [
    {
      label: (
        <PostType title="Default post" pricePerDay="0.99$"/>
      ),
      value: 'spring',
    },
    {
      label: (
        <PostType title="Premium" pricePerDay="4.99$"/>
      ),
      value: 'summer',
    },
    {
      label: (
        <PostType title="Exclusive" pricePerDay="10.99$"/>
      ),
      value: 'autumn',
    },
  ]

  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <div className="options-wrapper"> 
              <Form 
                layout="vertical" 
                // onFinish={onFinishForm}
                method="POST"
                encType="multipart/form-data"
                style={{ width: "80%", marginTop: '4rem'}}
                // validateMessages={validateCreatePostClient}
              >
                <Badge.Ribbon 
                  text={<Link to="/admin/properties">Back</Link>} 
                  color="purple" className="custom-ribbon"
                >
                  <Card
                    title="Configure post"
                    className="custom-card" 
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item   
                          label={
                            <Space className="d-flex align-items-center">
                              <span>Choose post type:</span>
                              {/* <IoBedOutline /> */}
                            </Space>
                          } 
                          // name="bedrooms"
                        >
                          <Segmented
                            className="options-wrapper__post-segmented"
                            options={options}
                          />
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

export default ChooseOptions