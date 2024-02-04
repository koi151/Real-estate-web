import React, { useEffect, useState } from "react";
import { PropertyCategoryType } from "../../../../backend/commonTypes";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Input, InputNumber, Radio, Row, Spin, TreeSelect, message } from "antd";
import propertyCategoriesService from "../../services/admin/property-categories.service";
import UploadMultipleFile from "../../components/admin/UploadMultipleFile/uploadMultipleFile";
import { Editor } from '@tinymce/tinymce-react';
import { DefaultOptionType } from "antd/es/select";

const CreatePropertyCategory: React.FC = () => {

  const [ loading, setLoading ] = useState<boolean>(true);
  const [ editorContent, setEditorContent ] = useState<string>("");

  const [ category, setCategory ] = useState<PropertyCategoryType | undefined>(undefined);
  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);
  const [categoryTitle, setCategoryTitle] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await propertyCategoriesService.getCategoryTree();
        if (response.code === 200) {
          setCategoryTree(response.categoryTree);
        } else {
          message.error(response.error, 3);
        }
        setLoading(false);

      } catch (error) {
        console.error('Error fetching category tree:', error);
        message.error("Error occurred, can not get categories", 3);
      }
    };

    fetchData();
  }, []);

  const handleEditorChange = (content: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const handleTreeSelectChange = (newValue: string) => {
    setCategoryTitle(newValue);
  };

  const onFinishForm = async (data: any) => {
    try {
      const formData = new FormData();

      data.title && formData.append('title', data.title);
      data.position && formData.append('position', data.position);
      data.status && formData.append('status', data.status);
      data.parent_id && formData.append('parent_id', data.parent_id);
  
      // Append description
      editorContent && formData.append('description', editorContent);

      // Append images
      if (data.images?.length > 0) {
        data.images.forEach((imageFile: any) => {
          if (!imageFile.hasOwnProperty('uploaded') || (imageFile.hasOwnProperty('uploaded') && !imageFile.uploaded)) {
            formData.append('images', imageFile.originFileObj);
          }
        });
      }      
      const response = await propertyCategoriesService.createCategory(formData);
      
      if (response.code === 200) {
        message.success('Property category craeted successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (error) {
      message.error("Error occurred while creating category.");
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
          <Badge.Ribbon text={<Link to="/admin/property-categories">Back</Link>} color="purple" className="custom-ribbon">
            <Card 
              title="Create property category" 
              className="custom-card" 
              style={{marginTop: '2rem'}}
              extra={<Link to="/admin/property-categories">Back</Link>}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item 
                    label={<span>Post title <b className="required-txt">- required:</b></span>}
                    name='title'
                  >
                    <Input type="text" id="title" required />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item 
                    label='Select parent category' 
                    name='parent_id' 
                  >
                    <TreeSelect
                      style={{ width: '100%' }}
                      value={categoryTitle}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={categoryTree}
                      placeholder="None by default"
                      treeDefaultExpandAll
                      onChange={handleTreeSelectChange}
                      treeLine
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={`Property category description:`}>
                    <Editor
                      id="description" 
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
                  <Form.Item label="Category status:" name='status' initialValue={'active'}>
                    <Radio.Group>
                      <Radio value="active">Active</Radio>
                      <Radio value="inactive">Inactive</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col sm={24} md={24} lg={14} xl={14} xxl={14}>
                  <Form.Item label="Post position:" name='position'>
                    <InputNumber 
                      type="number"
                      id="position" 
                      min={0} 
                      className="custom-number-input position-input"
                      placeholder='Auto increase by default'
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <UploadMultipleFile uploadedImages={category?.images}/>
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
    )}
  </>
  )
}

export default CreatePropertyCategory;