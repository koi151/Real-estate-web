import { Badge, Button, Card, Col, Form, Input, InputNumber, Radio, Row, Segmented, Select, Space, Spin, TreeSelect, message } from "antd";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import propertiesService from "../../../services/admin/properties.service";
import { PropertyType } from "../../../../../backend/commonTypes";
import * as standardizeData from '../../../helpers/standardizeData'
import GetAddress from "../../../components/admin/getAddress/getAddress";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import ExpireTimePicker from "../../../components/admin/ExpireTimePicker/expireTimePicker";
import { RootState } from "../../../redux/stores";
import { useDispatch, useSelector } from "react-redux";
import { directionOptions, documentOptions, furnitureOptions, listingTypeOptions } from "../../../helpers/propertyOptions";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import AdminRolesService from "../../../services/admin/roles.service";
import { setPermissions } from "../../../redux/reduxSlices/permissionsSlice";
import propertyCategoriesService from "../../../services/admin/property-categories.service";
import { DefaultOptionType } from "antd/es/select";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { SlDirections } from "react-icons/sl";

const EditProperty: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  const [postType] = useState<string>('sell');
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);

  const [property, setProperty] = useState<PropertyType | undefined>(undefined);

  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);  

  // data from child component
  const [expireDateTime, setExpireDateTime] = useState<Dayjs | null>(null);
  const [imageUrlToRemove, setImageUrlToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category tree
        const categoryTreeResponse = await propertyCategoriesService.getCategoryTree();
        if (categoryTreeResponse.code === 200) {
          setCategoryTree(categoryTreeResponse.categoryTree);
        } else {
          message.error(categoryTreeResponse.error || 'Error occurred while fetching property categories data', 3);
        }
  
        // Fetch single property data if ID is provided
        if (id) {
          const propertyResponse = await propertiesService.getSingleProperty(id);
          if (propertyResponse.code === 200 && propertyResponse.property) {            
            setProperty(propertyResponse.property);
            setPrice(propertyResponse.property.price);
            propertyResponse.property.area?.propertyLength && setPropertyLength(propertyResponse.property.area.propertyLength);
            propertyResponse.property.area?.propertyWidth && setPropertyWidth(propertyResponse.property.area.propertyWidth);

          } else {
            message.error(propertyResponse.message || 'Error occurred while fetching property data', 2);
          }
        } else {
          message.error('ID not provided, unable to fetch property data', 3);
        }
  
        setLoading(false);
        
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching data', 2);
          console.error('Error occurred:', err);
        }
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // if permission in redux not existed => fetch permissions
  useEffect(() =>  {
    if (currentUserPermissions?.propertiesEdit)
      return;

    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getPermissions();
        if (response.code === 200) {
          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

          if (!response.permissions.propertiesEdit) {
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


  const handleEditorChange = (content: any, editor: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  // Child component functions  
  const handleImageUrlRemove = (imageUrl: string | undefined) => {
    // Check if imageUrl is not undefined and not already in the array
    if (imageUrlToRemove !== undefined && imageUrl !== undefined) {
      setImageUrlToRemove(prevImages => [...prevImages, imageUrl]);
    }
  }
  //

  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get property id');
        message.error('Error occurred', 3);
        return;
      }      

      console.log("data:", data)

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

      // Construct transformedData object
      const transformedData = {
        ...restData,
        ...(updatedExpireTime && { expireTime: updatedExpireTime }),
        description: editorContent,
        price: adjustedPrice,
        propertyDetails: {
          ...restData.propertyDetails,
          rooms: rooms,
        },
        ...(imageUrlToRemove && { images_remove: imageUrlToRemove})
      };
      
      const formData = standardizeData.objectToFormData(transformedData);
      
      const response = await propertiesService.updateProperty(formData, id);

      if (response.code === 200) {
        message.success('Property updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (error) {
      message.error("Error occurred while updating property.");
    }
  }

  return (
    <>
      {currentUserPermissions?.propertiesEdit || viewAllowed ? (
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
              <Badge.Ribbon text={<Link to="/admin/properties">Back</Link>} color="purple" className="custom-ribbon">
                <Card 
                  title="Basic information"
                  className="custom-card" 
                >
                  <Row gutter={16}>
                    <Col span={24} className="mb-5">
                        <Form.Item 
                          label='Listing type:' 
                          name='listingType' 
                          style={{height: "4.5rem"}}
                          initialValue={property?.listingType}
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
                          label='Select parent category' 
                          name={['propertyDetails', 'propertyCategory']}  
                          initialValue={property?.propertyDetails?.propertyCategory}
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
                      <GetAddress initialValues={property?.location}/>
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
                      initialValue={property?.area?.propertyLength}
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
                      initialValue={property?.area?.propertyWidth}
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
                    <Form.Item 
                      label='Area'
                    >
                      <InputNumber 
                        disabled 
                        type="number" 
                        min={0} 
                        className="custom-number-input" 
                        placeholder="Enter width and height"
                        defaultValue={(propertyLength && propertyWidth) 
                          ? propertyLength * propertyWidth 
                          : 0}
                      />
                    </Form.Item>
                  </Col>

                  <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      label={`Property ${postType} price`} 
                      name='price'
                      initialValue={property?.price && property.price >= 1000 ? property.price / 1000 : property?.price}
                    >
                      <InputNumber
                        value={property?.price}
                        type='number'
                        style={{width: "100%"}}
                        addonAfter={
                          <Select 
                            value={property?.price && property.price >= 1000 ? "billion" : "million"} 
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
                        placeholder={`Please select property ${postType} price`} 
                      />
                    </Form.Item>
                  </Col>

                  <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item label={`Price per meter square`}>
                      <Input
                        disabled 
                        placeholder={`Select property ${postType} price and area to view`} 
                        style={{width: "100%"}}
                        value={`${property?.area?.propertyLength && property?.area?.propertyWidth && price 
                          && (priceMultiplier * price / (property.area.propertyLength * property.area.propertyWidth)).toFixed(2)} million`}
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
                      initialValue={property?.propertyDetails?.legalDocuments}
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
                      initialValue={property?.propertyDetails?.furnitures}
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
                      name='bedrooms'
                      initialValue={property?.propertyDetails?.rooms && standardizeData.getRoomCount(property?.propertyDetails?.rooms, 'bedrooms')}
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
                      initialValue={property?.propertyDetails?.rooms && standardizeData.getRoomCount(property?.propertyDetails?.rooms, 'kitchens')}
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
                      initialValue={property?.propertyDetails?.rooms && standardizeData.getRoomCount(property?.propertyDetails?.rooms, 'bathrooms')}
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
                      initialValue={property?.propertyDetails?.totalFloors}
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
                      initialValue={property?.propertyDetails?.houseDirection}
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
                      initialValue={property?.propertyDetails?.balconyDirection}
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
                    <UploadMultipleFile uploadedImages={property?.images} setImageUrlRemove={handleImageUrlRemove}/>
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
                      initialValue={property?.title}
                    >
                      <Input type="text" id="title" required />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={`Property ${postType}ing description:`}>
                      <Editor
                        id="description" 
                        initialValue={property?.description}               
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
                  <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Form.Item label="Post type:" name='postType' initialValue={property?.postType}>
                      <Radio.Group>
                        <Radio value="standard" className="label-light"> Standard </Radio>
                        <Radio value="premium" className="label-light"> Premium </Radio>
                        <Radio value="exclusive" className="label-light"> Exclusive </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Form.Item label="Property status:" name='status' initialValue={property?.status}>
                      <Radio.Group>
                        <Radio value="active">Active</Radio>
                        <Radio value="inactive">Inactive</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <ExpireTimePicker 
                      onExpireDateTimeChange={(value) => setExpireDateTime(value)} 
                      expireTimeGiven={property?.expireTime}
                    />
                  </Col>

                  <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
                    <Form.Item label="Post position:" name='position' initialValue={property?.position}>
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
      ) : (
        <NoPermission permissionType='access' />
      )}
    </>
  )
}

export default EditProperty;