import { Badge, Button, Card, Col, Form, Input, InputNumber, 
        Row, Segmented, Select, Space, Spin, TreeSelect, message } from "antd";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate } from "react-router-dom";
import { DefaultOptionType } from "antd/es/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";
import { createSelector } from "@reduxjs/toolkit";

// Icons
import { SlDirections } from "react-icons/sl";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

// Services
import propertyCategoriesServiceClient from "../../../services/client/property-categories.service";

// Components, helpers, data types,..
import GetAddress from "../../../components/admin/getAddress/getAddress";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import NoPermission from "../../../components/admin/NoPermission/noPermission";

import { directionOptions, documentOptions, furnitureOptions, listingTypeOptions } from "../../../helpers/propertyOptions";
import { setPost } from "../../../redux/reduxSlices/propertyPostSlice";
import { validateCreatePostClient } from "../../../helpers/validateMessages";

import './create.scss'

const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accessAllowed, setAccessAllowed] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [price, setPrice] = useState<number | null>(null);
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
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
          navigate('/admin/auth/login');
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

  const selectPriceUnit = (
    <Select defaultValue="million" onChange={ (value) => setPriceMultiplier(value === 'million' ? 1 : 1000)}>
      <Select.Option value="million">million</Select.Option>
      <Select.Option value="billion">billion</Select.Option>
    </Select>
  );

  const handleEditorChange = (content: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const onFinishForm = async (data: any) => {
    try {  
      console.log("data:", data)
      dispatch(setPost(data));
      navigate('/properties/create/choose-options')

    } catch (error) {
      message.error("Error occurred while creating a new property.");
      console.log("Error occurred:", error)
    }
  }
  
  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            <div className="d-flex flex-column align-items-center justify-content-center"> 
              <Form 
                layout="vertical" 
                onFinish={onFinishForm}
                method="POST"
                encType="multipart/form-data"
                style={{ width: "80%", marginTop: '4rem'}}
                validateMessages={validateCreatePostClient}
              >
                <Badge.Ribbon 
                  text={<Link to="/admin/properties">Back</Link>} 
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
                          initialValue={'forSale'}
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
                        <GetAddress />
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>

                <Card title="Property information" className="custom-card" style={{marginTop: '2rem'}}>
                  <Row gutter={16}>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item 
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
                      <Form.Item label={`Property price`} name='price' rules={[{ required: true }]}>
                        <InputNumber 
                          min={0}
                          type="number"
                          addonAfter={selectPriceUnit} 
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
                          value={`${propertyLength && propertyWidth && price && (priceMultiplier * price / (propertyLength * propertyWidth)).toFixed(2)} million`}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <div className="line-two"></div>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item 
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
                      <UploadMultipleFile />
                    </Col>
                  </Row>
                </Card>

                <Card title="Post information" className="custom-card" style={{marginTop: '2rem'}}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item 
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
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Contact name:</span>
                          </Space>
                        } 
                        name={['contactInfo', 'name']}
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
                        label={
                          <Space className="d-flex align-items-center">
                            <span>Phone number:</span>
                          </Space>
                        } 
                        name={['contactInfo', 'phone']}
                        rules={[{ required: true }]}
                        initialValue={currentUser?.phone}
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
                          label='Email:' 
                          name={['contactInfo', 'email']}
                          rules={[{ type: 'email' }]}
                        >
                          <Input 
                            type='email' id="email" 
                            placeholder="Please enter your email"
                          />
                        </Form.Item>
                      </Col>
                    {/* <Col span={24}>
                      <Form.Item className="d-flex justify-content-end">
                        <Button className='custom-btn-main d-flex align-items-center' type="primary" htmlType="submit">
                          Continue <MdNavigateNext style={{fontSize: "2rem", margin: "0 .5rem"}}/>
                        </Button>
                      </Form.Item>
                    </Col> */}
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

export default CreateProperty;