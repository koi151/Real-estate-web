import { Badge, Button, Card, Col, Form, Input, InputNumber, 
         Radio, Row, Segmented, Select, Space, TreeSelect, message } from "antd";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DefaultOptionType } from "antd/es/select";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { SlDirections } from "react-icons/sl";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";

// Services
import propertiesService from "../../../services/admin/properties.service";
import propertyCategoriesService from "../../../services/admin/property-categories.service";

// Components
import GetAddress from "../../../components/admin/getAddress/getAddress";
import ExpireTimePicker from "../../../components/admin/ExpireTimePicker/expireTimePicker";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import NoPermission from "../../../components/admin/NoPermission/noPermission";

// Redux && helpers, scss
import { RootState } from "../../../redux/stores";
import AdminRolesService from "../../../services/admin/roles.service";
import * as standardizeData from '../../../helpers/standardizeData'
import { setPermissions } from "../../../redux/reduxSlices/adminPermissionsSlice";
import { directionOptions, documentOptions, furnitureOptions, listingTypeOptions } from "../../../helpers/propertyOptions";

import './create.scss'

const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentAdminUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);

  const [price, setPrice] = useState<number | null>(null);
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");

  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);

  // data from child component
  const [expireDateTime, setExpireDateTime] = useState<Dayjs | null>(null);

  // fetch categories data 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await propertyCategoriesService.getCategoryTree();
        if (response.code === 200) {
          setCategoryTree(response.categoryTree);
        } else {
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
      }
    };

    fetchData();
  }, [navigate]);

  // if permission in redux not existed => fetch permissions
  useEffect(() =>  {
    if (currentUserPermissions?.propertiesCreate)
      return;

    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getPermissions();
        if (response.code === 200) {
          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

          if (!response.permissions.propertiesCreate) {
            setViewAllowed(false)
          }

        } else {
          setViewAllowed(false);
        }

      } catch (err) {
        console.log("Error occurred while fetching permissions:", err);
        message.error('Error occurred, redirect to previous page', 3)
        navigate(-1);
        setViewAllowed(false);
      }
    }
    fetchData();
  }, []);

  const selectPriceUnit = (
    <Select defaultValue="million" onChange={ (value) => setPriceMultiplier(value === 'million' ? 1 : 1000)}>
      <Select.Option value="million">million</Select.Option>
      <Select.Option value="billion">billion</Select.Option>
    </Select>
  );

  const handleEditorChange = (content: any, editor: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const onFinishForm = async (data: any) => {
    try {  

      const rooms = ['bedrooms', 'bathrooms', 'kitchens']
      .filter(room => data[room])
      .map(room => `${room}-${data[room]}`);

      // update actual price with price unit
      const parsedPrice = parseFloat(data.price);
      const adjustedPrice = !isNaN(parsedPrice) ? String(priceMultiplier * parsedPrice) : '';

      const { bedrooms, bathrooms, kitchens, ...restData } = data;

      let updatedExpireTime = null;
      if (expireDateTime) {
        updatedExpireTime = expireDateTime.toISOString();
        
      } else if (['day', 'week', 'month'].includes(data.expireTime)) {
        const duration = data.expireTime === 'day' ? 1 : (data.expireTime === 'week' ? 7 : 30);
        const expirationDate = dayjs().add(duration, 'day');
        updatedExpireTime = expirationDate.toISOString();
      };

      if (data.expireTime === 'other' || !data.expireTime)
        delete data.expireTime

      const transformedData = {
        ...restData,
        description: editorContent,
        price: adjustedPrice,
        ...(updatedExpireTime && { expireTime: updatedExpireTime }),
        propertyDetails: {
          ...restData.propertyDetails,
          rooms: rooms,
        }
      };
      
      const formData = standardizeData.objectToFormData(transformedData);

      const response = await propertiesService.createProperty(formData);
  
      if (response.code === 200) {
        message.success("Property created successfully!", 3);
      } else {
        message.error(response.message, 3);
      }
    } catch (error) {
      message.error("Error occurred while creating a new property.");
      console.log("Error occurred:", error)
    }
  }
  
  return (
    <>
    {currentUserPermissions?.propertiesCreate || viewAllowed ? (
      <div className="d-flex flex-column align-items-center justify-content-center"> 
        <Form 
          layout="vertical" 
          onFinish={onFinishForm}
          method="POST"
          encType="multipart/form-data"
          className="custom-form" 
        >
          <Badge.Ribbon text={<Link to="/admin/properties">Back</Link>} color="purple" className="custom-ribbon">
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
                <Form.Item label='Property length (m)' name={['area', 'propertyLength']}>
                  <InputNumber 
                    type="number" min={0} 
                    onChange={(value) => setPropertyLength(value)}
                    className="custom-number-input" 
                    placeholder="Enter length of property"
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} lg={8} xl={8} xxl={8}>  
                <Form.Item label='Property width (m)' name={['area', 'propertyWidth']}>
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
                <Form.Item label={`Property price`} name='price'>
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
                  label={<span>Post title <b className="required-txt">- required:</b></span>}
                  name='title'
                  required
                >
                  <Input type="text" id="title" required />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={`Property description:`}>
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
              <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item label="Post type:" name='postType' initialValue={'standard'}>
                  <Radio.Group>
                    <Radio value="standard" className="label-light"> Standard </Radio>
                    <Radio value="premium" className="label-light"> Premium </Radio>
                    <Radio value="exclusive" className="label-light"> Exclusive </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item label="Property status:" name='status' initialValue={'active'}>
                  <Radio.Group>
                    <Radio value="active">Active</Radio>
                    <Radio value="inactive">Inactive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                <ExpireTimePicker 
                  onExpireDateTimeChange={(value) => setExpireDateTime(value)} 
                />
              </Col>

              <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
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
                <Form.Item>
                  <Button className='custom-btn-main' type="primary" htmlType="submit">
                    Submit
                  </Button>
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
  )
}

export default CreateProperty;