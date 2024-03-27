import { Badge, Card, Col, Form, Input, InputNumber, Row, Segmented, Select, Space, Spin, TreeSelect, message } from "antd";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate, useParams } from "react-router-dom";

import { PropertyType } from "../../../../../../backend/commonTypes";
import * as standardizeData from '../../../../helpers/standardizeData'
import GetAddress from "../../../../components/admin/getAddress/getAddress";
import UploadMultipleFile from "../../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import { directionOptions, documentOptions, furnitureOptions, listingTypeOptions } from "../../../../helpers/propertyOptions";
import NoPermission from "../../../../components/admin/NoPermission/noPermission";
import propertyCategoriesService from "../../../../services/admin/property-categories.service";
import { DefaultOptionType } from "antd/es/select";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { SlDirections } from "react-icons/sl";
import propertiesServiceClient from "../../../../services/client/properties.service";

const MyPropertyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accessAllowed, setAccessAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [postType] = useState<string>('sell');
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);

  const [property, setProperty] = useState<PropertyType | undefined>(undefined);

  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);  

  // data from child component
  const [imageUrlToRemove, setImageUrlToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category tree
        const categoryTreeResponse = await propertyCategoriesService.getCategoryTree();
        if (categoryTreeResponse.code === 200) {
          setCategoryTree(categoryTreeResponse.categoryTree);
          setAccessAllowed(true);
        } else {
          message.error(categoryTreeResponse.error || 'Error occurred while fetching property categories data', 3);
        }
  
        // Fetch single property data if ID is provided
        if (id) {
          const propertyResponse = await propertiesServiceClient.getSingleProperty(id);
          if (propertyResponse.code === 200 && propertyResponse.property) {            
            setProperty(propertyResponse.property);
            setPrice(propertyResponse.property.price);
            propertyResponse.property.price >= 1000 && setPriceMultiplier(1000); 
            propertyResponse.property.area?.propertyLength && setPropertyLength(propertyResponse.property.area.propertyLength);
            propertyResponse.property.area?.propertyWidth && setPropertyWidth(propertyResponse.property.area.propertyWidth);

          } else {
            message.error(propertyResponse.message || 'Error occurred while fetching property data', 2);
          }
        } else {
          message.error('ID not provided, unable to fetch property data', 3);
        }
          
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          message.error('Error occurred while fetching data', 2);
          console.error('Error occurred:', err);
        }
        
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <>
      {!loading ? (
        <>
        {accessAllowed ? (
          <div className="d-flex align-items-center justify-content-center"> 
            <Form 
              layout="vertical" 
              method="POST"
              encType="multipart/form-data"
              style={{width: "80%"}}
              disabled
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
                      initialValue={property?.price && property.price >= 1000 ? property.price / 1000 : property?.price}
                    >
                      <InputNumber
                        value={property?.price}
                        type='number'
                        style={{width: "100%"}}
                        addonAfter={
                          <Select 
                            defaultValue={property?.price && property.price >= 1000 ? "billion" : "million"} 
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

                  <div className="ml-2 mb-4">
                    Expire time: <b>
                    {property?.expireTime ?
                      new Date(property.expireTime).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).replace(',', ' -') :
                      'Not selected'}
                    </b>
                  </div>
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

export default MyPropertyDetail;