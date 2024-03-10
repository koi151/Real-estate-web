import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { RootState } from "../../../redux/stores";
import { useDispatch, useSelector } from "react-redux";import { DefaultOptionType } from "antd/es/select";import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Input, InputNumber, 
         Radio, Row, Spin, TreeSelect, message } from "antd";

import AdminRolesService from "../../../services/admin/roles.service";
import propertyCategoriesService from "../../../services/admin/property-categories.service";

import { PropertyCategoryType } from "../../../../../backend/commonTypes";
import * as standardizeData from '../../../helpers/standardizeData'

import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import NoPermission from "../../../components/admin/NoPermission/noPermission";

import { setPermissions } from "../../../redux/reduxSlices/adminPermissionsSlice";

const CreatePropertyCategory: React.FC = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserPermissions = useSelector((state: RootState) => state.currentAdminUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);
  const [ loading, setLoading ] = useState<boolean>(true);

  const [ editorContent, setEditorContent ] = useState<string>("");
  const [ category ] = useState<PropertyCategoryType | undefined>(undefined);
  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetch categories data
        const categoryResponse = await propertyCategoriesService.getCategoryTree();
        if (categoryResponse.code === 200) {
          setCategoryTree(categoryResponse.categoryTree);
        } else {
          message.error(categoryResponse.error, 3);
          setLoading(false);
          return;
        }
  
        // Check and fetch permissions if necessary
        if (!currentUserPermissions?.propertyCategoriesCreate) {
          const permissionsResponse = await AdminRolesService.getPermissions();
          if (permissionsResponse.code === 200) {
            if (permissionsResponse.permissions) {
              dispatch(setPermissions(permissionsResponse.permissions));
            }
  
            if (!permissionsResponse.permissions.propertyCategoriesCreate) {
              setViewAllowed(false);
            }
          } else {
            setViewAllowed(false);
          }
        }
  
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching data', 2);
          console.log('Error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentUserPermissions, dispatch, navigate]);

  const handleEditorChange = (content: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const onFinishForm = async (data: any) => {
    try {
      const transformedData = {
        ...data,
        description: editorContent,
      };

      const formData = standardizeData.objectToFormData(transformedData);

      const response = await propertyCategoriesService.createCategory(formData);
      
      if (response.code === 200) {
        message.success('Property category created successfully!', 3);
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
    {currentUserPermissions?.propertyCategoriesCreate || viewAllowed ? (
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
                      label={<span>Property category name <b className="required-txt">- required:</b></span>}
                      name='title'
                      required                  
                    >
                      <Input type="text" id="title" required />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item 
                      label='Parent category' 
                      name='parent_id' 
                    >
                      <TreeSelect
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={categoryTree}
                        placeholder="None by default"
                        treeDefaultExpandAll
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
    ) : (
      <NoPermission permissionType='access' />
    )}
  </>
  )
}

export default CreatePropertyCategory;