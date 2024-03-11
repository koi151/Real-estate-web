import React, { useEffect, useState } from "react";
import { PropertyCategoryType } from "../../../../../backend/commonTypes";
import { Badge, Button, Card, Col, Form, Input, InputNumber, Radio, Row, Spin, TreeSelect, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";

import propertyCategoriesService from "../../../services/admin/property-categories.service";
import AdminRolesService from "../../../services/admin/roles.service";

import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import { setPermissions } from "../../../redux/reduxSlices/adminPermissionsSlice";
import * as standardizeData from '../../../helpers/standardizeData'
import { DefaultOptionType } from "antd/es/select";

const EditPropertyCategories: React.FC = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentAdminUserPermissions.permissions);

  const [accessAllowed, setAccessAllowed] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [editorContent, setEditorContent] = useState<string>("");
  const [category, setCategory] = useState<PropertyCategoryType | undefined>(undefined);
  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);

  const [parentCategory, setParentCategory] = useState<string | undefined>(undefined);

  // data from child component
  const [imageUrlToRemove, setImageUrlToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) {
          message.error('Can not find property, redirect to previous page', 3);
          navigate(-1);
          return;
        }

        // Fetch category tree
        const categoryTreeResponse = await propertyCategoriesService.getCategoryTree();
        if (categoryTreeResponse.code === 200) {
          setCategoryTree(categoryTreeResponse.categoryTree);
        } else {
          message.error(categoryTreeResponse.error || 'Error occurred while fetching property categories data', 3);
        }

        const response = await propertyCategoriesService.getSingleCategory(id);

        if(response?.code === 200 && response.category) {
          setCategory(response.category);
          setLoading(false);

          if (response.category.parent_id && response.category.parent_id !== "") {
            const parentCategoryResponse = await propertyCategoriesService.getParentCategory(response.category.parent_id);
            if (parentCategoryResponse.code === 200) {
              setParentCategory(parentCategoryResponse.parentCategory)
            } else {
              console.log('Error occurred, parent is invalid');
            }
          } else {
            setParentCategory(`None`)
          }

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
      } finally {
        setLoading(false)
      }
    };
    
    fetchData();
  }, [id, navigate])


  const handleEditorChange = (content: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get category id');
        message.error('Error occurred', 3);
        return;
      }
      const transformedData = {
        ...data,
        description: category?.description ? category?.description : editorContent,
        ...(data.parent_id && {parent_id: data.parent_id.value}),
        ...(imageUrlToRemove && { images_remove: imageUrlToRemove})
      };

      const formData = standardizeData.objectToFormData(transformedData);
      
      const response = await propertyCategoriesService.updateCategory(formData, id);
      
      if (response.code === 200) {
        message.success('Property category updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (error) {
      message.error("Error occurred while updating category.");
    }
  }

  // Child component functions  
  const handleImageUrlRemove = (imageUrl: string | undefined) => {
    // Check if imageUrl is not undefined and not already in the array
    if (imageUrlToRemove !== undefined && imageUrl !== undefined) {
      setImageUrlToRemove(prevImages => [...prevImages, imageUrl]);
    }
  }

  return (
    <>
      { !loading ? (
        <>
          { accessAllowed? (
            <>
              {loading ? (
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
                        title="Property category information" 
                        className="custom-card" 
                        style={{marginTop: '2rem'}}
                        extra={<Link to="/admin/property-categories">Back</Link>}
                      >
                        <Row gutter={16}>
                          <Col span={24}>
                            <Form.Item 
                              label="Property category name"
                              name='title'
                              initialValue={category?.title}
                              required
                            >
                              <Input type="text" id="title" required />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item 
                              label={(<span>Parent category: <b className="required-txt">{parentCategory}</b></span>)} 
                              name='parent_id' 
                            >
                              <TreeSelect
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={categoryTree}
                                labelInValue
                                onChange={(node) => setParentCategory(node.label)} 
                                placeholder="Select new parent category if needed only"
                                treeDefaultExpandAll
                                treeLine
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label={`Property category description:`}>
                              <Editor
                                id="description" 
                                initialValue={category?.description}             
                                onEditorChange={handleEditorChange}
                                apiKey='zabqr76pjlluyvwebi3mqiv72r4vyshj6g0u07spd34wk1t2'
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
                              <Radio.Group>
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
                                min={0} 
                                className="custom-number-input position-input"
                                placeholder='Auto increase by default'
                              />
                            </Form.Item>
                          </Col>
        
                          <Col span={24}>
                            <UploadMultipleFile uploadedImages={category?.images} setImageUrlRemove={handleImageUrlRemove}/>
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
                    </Badge.Ribbon>
                  </Form>
                </div>
              )}
            </>
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

export default EditPropertyCategories