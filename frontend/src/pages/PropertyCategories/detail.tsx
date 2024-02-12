import React, { useEffect, useState } from "react";
import { PropertyCategoryType } from "../../../../backend/commonTypes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Input, InputNumber, Radio, Row, Spin, message } from "antd";
import propertyCategoriesService from "../../services/admin/property-categories.service";
import UploadMultipleFile from "../../components/admin/UploadMultipleFile/uploadMultipleFile";
import { Editor } from '@tinymce/tinymce-react';

const PropertyCategoriesDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editorContent, setEditorContent] = useState<string>("");
  const [category, setCategory] = useState<PropertyCategoryType | undefined>(undefined);

  // data from child component
  const [imageUrlToRemove, setImageUrlToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Can not find property category, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        const response = await propertyCategoriesService.getSingleCategory(id);

        if(response?.code === 200 && response.category) {
          setCategory(response.category);
          setLoading(false);
        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching property category data', 2);
          console.log('Error occurred:', err);
        }
      }
    };
    fetchData();
  }, [id, navigate])

  const handleEditorChange = (content: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

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
            className="custom-form" 
            disabled
          >
            <Badge.Ribbon text={<Link to="/admin/property-categories">Back</Link>} color="purple" className="custom-ribbon">
              <Card 
                title="Property category information" 
                className="custom-card" 
                style={{marginTop: '2rem'}}
                extra={<Link to="/admin/property-categories">Back</Link>}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item 
                      label={<span>Post title <b className="required-txt">- required:</b></span>}
                      name='title'
                      initialValue={category?.title}
                    >
                      <Input type="text" id="title" required />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={`Property category description:`}>
                      <Editor
                        disabled
                        id="description" 
                        initialValue={category?.description}             
                        onEditorChange={handleEditorChange}
                        apiKey='zabqr76pjlluyvwebi3mqiv72r4vyshj6g0u07spd34wk1t2' // hide
                        init={{
                          toolbar_mode: 'sliding', 
                          plugins: ' anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount', 
                          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat', 
                          tinycomments_mode: 'embedded', tinycomments_author: 'Author name', mergetags_list: [ { value: 'First.Name', title: 'First Name' }, { value: 'Email', title: 'Email' }, ], 
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={24} lg={10}  xl={10} xxl={10}>
                    <Form.Item label="Category status:" name='status' initialValue={category?.status}>
                      <Radio.Group disabled>
                        <Radio value="active">Active</Radio>
                        <Radio value="inactive">Inactive</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col sm={24} md={24} lg={14} xl={14} xxl={14}>
                    <Form.Item label="Post position:" name='position' initialValue={category?.position}>
                      <InputNumber 
                        type="number"
                        id="position" 
                        min={0} disabled
                        className="custom-number-input position-input"
                        placeholder='Auto increase by default'
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <UploadMultipleFile uploadedImages={category?.images}/>
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

export default PropertyCategoriesDetail