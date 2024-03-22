import { Badge, Card, Col, Form, Input, InputNumber, 
        Row, Segmented, Select, Space, Spin, TreeSelect, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate } from "react-router-dom";
import { DefaultOptionType } from "antd/es/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";
import { createSelector } from "@reduxjs/toolkit";
import { FormInstance } from "antd/es/form/Form";

// Icons
import { SlDirections } from "react-icons/sl";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";

// Services
import propertyCategoriesServiceClient from "../../../services/client/property-categories.service";

// Components, helpers, data types,..
import GetAddress from "../../admin/getAddress/getAddress";
import UploadMultipleFile from "../../admin/UploadMultipleFile/uploadMultipleFile";
import NoPermission from "../../admin/NoPermission/noPermission";

import { directionOptions, documentOptions, furnitureOptions, listingTypeOptions } from "../../../helpers/propertyOptions";
import { setAllowNextStep, setPost, setSubmitFirstPage } from "../../../redux/reduxSlices/propertyPostSlice";
import { validateCreatePostClient } from "../../../helpers/validateMessages";

import { getRoomCount } from "../../../helpers/standardizeData";
import AlertBeforeReload from "../../shared/AlertBeforeReload/alertBeforeReload";
import './createPropertyForm.scss'


const CreatePropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitFormReq = useSelector((state: RootState) => state.propertyPost.submitFirstPage);

  const formRef = useRef<FormInstance>(null);

  const [accessAllowed, setAccessAllowed] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [price, setPrice] = useState<number | null>(null);
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");

  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);

  // get current user info
  const selectCurrentUser = createSelector(
    (state: RootState) => state.adminUser,
    (state: RootState) => state.clientUser,
    (adminUser, clientUser) => {
      return adminUser.fullName !== ''
        ? { phone: adminUser.phone }
        : { phone: clientUser.phone };
    }
  );

  const currentUser = useSelector(selectCurrentUser);
  const postInfo = useSelector((state: RootState) => state.propertyPost);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReload = AlertBeforeReload('Are you sure you want to reload the page?');

  // fetch categories data 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await propertyCategoriesServiceClient.getCategoryTree();

        if (response.code === 200) {
          setCategoryTree(response.categoryTree);
          setAccessAllowed(true);
        } else {
          setAccessAllowed(false);
          message.error(response.error, 3);
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          message.error('Error occurred while fetching property categories data', 2);
          console.log('Error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // submit form
  useEffect(() => {
    const submitForm = async () => {
      if (!formRef.current) {
        return;
      }
  
      if (submitFormReq) {
        try {
          const formData = await formRef.current.validateFields();
          dispatch(setAllowNextStep(true));

          const rooms = ['bedrooms', 'bathrooms', 'kitchens']
          .filter(room => formData[room])
          .map(room => `${room}-${formData[room]}`);

          // Save post data to Redux store
          dispatch(setPost({ // converted rooms to array
            ...formData,
            description: editorContent,
            propertyDetails: {
              ...formData.propertyDetails,
              rooms: rooms,
            }
          }));

        } catch (err) { // in case of not passed validation
          console.error('Form validation failed:', err);
        } finally {
          dispatch(setSubmitFirstPage(false));
        }
      }
    }

    submitForm();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitFormReq])

  const handleEditorChange = (content: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };
  
  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <div className="d-flex flex-column align-items-center justify-content-center"> 
              <Form 
                ref={formRef}
                layout="vertical" 
                method="POST"
                encType="multipart/form-data"
                style={{ width: "75%", marginTop: '4rem'}}
                validateMessages={validateCreatePostClient}
              >
                <Badge.Ribbon 
                  text={<Link to="/properties">Back</Link>} 
                  color="purple" className="custom-ribbon"
                >
                  <Card 
                    title="Basic information"
                    className="custom-card" 
                  >
                    <Row gutter={16}>
                      <Col span={24} className="mb-5">
                        <Form.Item 
                          label='Choose listing type' 
                          name='listingType' 
                          initialValue={postInfo.postType || 'forSale'}
                          style={{height: "4.5rem"}}
                        >
                          <Segmented 
                            options={listingTypeOptions}                      
                            block 
                            className="custom-segmented"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          initialValue={postInfo.propertyDetails?.propertyCategory}
                          name={['propertyDetails', 'propertyCategory']}  
                          label='Select property category'
                          rules={[{ required: true }]}
                        >
                          <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={categoryTree}
                            placeholder="Please select"
                            treeDefaultExpandAll
                            treeLine
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <GetAddress initialValues={postInfo?.location}/>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>

                <Card title="Property information" className="custom-card" style={{marginTop: '2rem'}}>
                  <Row gutter={16}>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item 
                        initialValue={postInfo.area?.propertyLength}
                        label='Property length (m)' 
                        name={['area', 'propertyLength']}
                        rules={[{ required: true }]}
                      >
                        <InputNumber 
                          type="number" min={0} 
                          onChange={(value) => setPropertyLength(value)}
                          className="custom-number-input" 
                          placeholder="Enter length of property"
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>  
                      <Form.Item 
                        initialValue={postInfo.area?.propertyWidth}
                        label='Property width (m)' 
                        name={['area', 'propertyWidth']}
                        rules={[{ required: true }]}
                      >
                        <InputNumber 
                          type="number" min={0} 
                          className="custom-number-input" 
                          onChange={(value) => setPropertyWidth(value)}
                          placeholder="Enter width of property"
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item label='Area'>
                        <InputNumber 
                          disabled 
                          type="number" min={0} 
                          className="custom-number-input" 
                          placeholder="Enter width and height"
                          value={propertyLength && propertyWidth && propertyLength * propertyWidth}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
                        initialValue={postInfo.price && postInfo.price >= 1000 ? postInfo.price / 1000 : postInfo?.price}
                        label={`Property price`} 
                        name='price' 
                        rules={[{ required: true }]}
                      >
                        <InputNumber 
                          min={0}
                          type="number"
                          addonAfter={
                            <Select 
                              defaultValue={postInfo?.price && postInfo.price >= 1000 ? "billion" : "million"} 
                              onChange={(value) => {
                                if (typeof value === 'number') {
                                  setPrice(value);
                                }
                              }}
                            >
                              <Select.Option value="million">million</Select.Option>
                              <Select.Option value="billion">billion</Select.Option>
                            </Select>
                          }  
                          placeholder={`Please select property price`}
                          onChange={(value) => {
                            if (typeof value === 'number') {
                              setPrice(value);
                            }
                          }}
                          style={{width: "100%"}}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label={`Price per meter square`}>
                        <Input
                          disabled 
                          placeholder={`Select property price and area to view`} 
                          style={{width: "100%"}}
                          value={(
                            postInfo?.area?.propertyLength && postInfo?.area?.propertyWidth
                            && price
                          ) ? `${(priceMultiplier * price / (postInfo.area.propertyLength * postInfo.area.propertyWidth)).toFixed(2)} million` 
                            : (
                              propertyLength && 
                              propertyWidth && 
                              price
                            ) ? 
                              `${(priceMultiplier * price / (propertyLength * propertyWidth)).toFixed(2)} million` 
                            : ''
                          }
                          />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <div className="line-two"></div>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
                        initialValue={postInfo.propertyDetails?.legalDocuments}
                        label={`Legal documents:`} 
                        name={['propertyDetails', 'legalDocuments']}  
                      >
                        <Select
                          mode="tags"
                          style={{ width: '100%' }}
                          placeholder="Choose or add specific legal documents"
                          options={documentOptions}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
                        initialValue={postInfo.propertyDetails?.furnitures}
                        label={`Furnitures:`} 
                        name={['propertyDetails', 'furnitures']}  
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Furniture"
                          options={furnitureOptions}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item   
                        initialValue={postInfo?.propertyDetails?.rooms && getRoomCount(postInfo?.propertyDetails?.rooms, 'bedrooms')}
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Number of bedrooms:</span>
                            <IoBedOutline />
                          </Space>
                        } 
                        name="bedrooms"
                      >
                        <InputNumber 
                          min={0} type="number"
                          placeholder="Enter the number of bedrooms" 
                          style={{width: "100%"}} 
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item   
                        initialValue={postInfo?.propertyDetails?.rooms && getRoomCount(postInfo?.propertyDetails?.rooms, 'kitchens')}
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Number of kitchens:</span>
                            <IoBedOutline />
                          </Space>
                        } 
                        name='kitchens'
                      >
                        <InputNumber 
                          min={0} type="number"
                          placeholder="Enter the number of kitchens" 
                          style={{width: "100%"}} 
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
                        initialValue={postInfo?.propertyDetails?.rooms && getRoomCount(postInfo?.propertyDetails?.rooms, 'bathrooms')}
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Number of bathrooms:</span>
                            <LuBath />
                          </Space>
                        }
                        name='bathrooms'
                      >
                        <InputNumber 
                          min={0} type="number"
                          placeholder="Enter the number of bathrooms" 
                          style={{width: "100%"}}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
                        initialValue={postInfo.propertyDetails?.totalFloors}
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Number of floors:</span>
                            <FaRegBuilding />
                          </Space>
                        }                  
                        name={['propertyDetails', 'totalFloors']}
                      >
                        <InputNumber 
                          min={0} type="number"
                          placeholder="Enter the number of floors" 
                          style={{width: "100%"}} 
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        initialValue={postInfo.propertyDetails?.houseDirection}
                        label={
                          <Space className="d-flex align-items-center">
                            <span>House direction:</span>
                            <SlDirections />
                          </Space>
                        }      
                        name={['propertyDetails', 'houseDirection']}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="House direction"
                          options={directionOptions}
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
                        initialValue={postInfo.propertyDetails?.balconyDirection}
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Balcony direction:</span>
                            <SlDirections />
                          </Space>
                        }                  
                        name={['propertyDetails', 'balconyDirection']}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Balcony direction"
                          options={directionOptions}
                        ></Select> 
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <div className="line-two"></div>
                    </Col>
                    <Col span={24}>
                      {/* uploadedImages={postInfo?.images} */}
                      <UploadMultipleFile 
                        uploadedImages={
                          postInfo?.images?.map((image: any, index: number) => image['thumbUrl'])
                        } 
                      />
                    </Col>
                  </Row>
                </Card>

                <Card title="Post information" className="custom-card" style={{marginTop: '2rem'}}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item 
                        initialValue={postInfo.title}
                        label='Post title'
                        name='title'
                        rules={[{ required: true }]}
                      >
                        <Input type="text" id="title" required />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label={`Property description:`} rules={[{ required: true }]}>
                        <Editor
                          id="description" 
                          value={editorContent}
                          initialValue={postInfo?.description}               
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
                  </Row>
                </Card>

                <Card title="Contact information" className="custom-card" style={{marginTop: '2rem'}}>
                  <Row gutter={16}>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        initialValue={postInfo?.createdBy?.fullName}                  
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Contact name:</span>
                          </Space>
                        } 
                        name={['createdBy', 'fullName']}
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder="Enter name" 
                          style={{width: "100%"}} 
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item   
                        initialValue={postInfo?.createdBy?.phone || currentUser?.phone}                  
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Phone number:</span>
                          </Space>
                        } 
                        name={['createdBy', 'phone']}
                        rules={[{ required: true }]}
                      >
                        <InputNumber 
                          min={0} type="number"
                          placeholder="Enter your phone number" 
                          style={{width: "100%"}} 
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          initialValue={postInfo.createdBy?.email}
                          label='Email:' 
                          name={['createdBy', 'email']}
                          rules={[{ type: 'email' }]}
                        >
                          <Input 
                            type='email' id="email" 
                            placeholder="Please enter your email"
                          />
                        </Form.Item>
                      </Col>
                  </Row>
                </Card>
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

export default CreatePropertyForm;