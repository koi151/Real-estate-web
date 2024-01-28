import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Segmented, Select, Spin, message } from "antd";
import { SegmentedValue } from "antd/es/segmented";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import propertiesService from "../../services/admin/properties.service";
import { PropertyType } from "../../../../backend/commonTypes";
import * as standardizeData from '../../helpers/standardizeData'
import GetAddress from "../../components/getAddress/getAddress";
import UploadMultipleFile from "../../components/UploadMultipleFile/uploadMultipleFile";
import ExpireTimePicker from "../../components/ExpireTimePicker/expireTimePicker";

const EditProperty: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [postType, setPostType] = useState<string>('sell');
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");

  const [property, setProperty] = useState<PropertyType | undefined>(undefined);

  // data from child component
  const [expireDateTime, setExpireDateTime] = useState<Dayjs | null>(null);
  const [imageUrlToRemove, setImageUrlToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Error occurred while searching property information, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        const response = await propertiesService.getSingleProperty(id);

        if(response?.code === 200 && response.property) {
          setProperty(response.property);
          setLoading(false);
        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (error) {
        message.error('No property found', 2);
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [id])
  
  const propertyCategoryOptions = [
    { value: 'townHouse', label: 'Town house' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
  ]

  const handlePropertyLengthChange = (value: number | null) => {
    setPropertyLength(value);
  };

  const handlePropertyWidthChange  = (value: number | null) => {
    setPropertyWidth(value);
  };

  const handlePriceUnitChange = (value: string) => {
    setPriceMultiplier(value === 'million' ? 1 : 1000);
  };

  const handleChangeListingType = (value: SegmentedValue) => {
    const formatedValue = value = "For sale" ? 'sell' : "hire"
    setPostType(formatedValue)
  }

  const handleEditorChange = (content: any, editor: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const handleExpireTimeChange = (dateTime: Dayjs | null) => {
    setExpireDateTime(dateTime);
  }

  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get property id');
        message.error('Error occurred', 3);
        return;
      }
      
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('position', data.position);
      
      formData.append('postType', data.postType);   
      formData.append('status', data.status);
  
      // Append location 
      formData.append('location[city]', data.city);
      formData.append('location[district]', data.district);
      formData.append('location[ward]', data.ward);
      formData.append('location[address]', data.address);
  
      // Append area 
      formData.append('area[propertyWidth]', data.propertyWidth);
      formData.append('area[propertyLength]', data.propertyLength);
  
      // Append propertyDetails 
      formData.append('propertyDetails[propertyType]', data.propertyType);
  
      // Append description
      formData.append('description', editorContent);
  
      // Append calculated price
      formData.append('price', String(priceMultiplier * data.price));
  
      // Append listingType
      const words = data.listingType.split(' ');
      const formattedListingType = `${words[0].charAt(0).toLowerCase()}${words[0].slice(1)}${words[1].charAt(0).toUpperCase()}${words[1].slice(1)}`;
      formData.append('listingType', formattedListingType);
  
      // Append expireAt
      if (expireDateTime) {
        formData.append('expireAt', expireDateTime.toISOString());
        
      } else if (data.expireAt === 'day' || data.expireAt === 'week' || data.expireAt === 'month') {
        const duration = data.expireAt === 'day' ? 1 : (data.expireAt === 'week' ? 7 : 30);
        const expirationDate = dayjs().add(duration, 'day');
        formData.append('expireAt', expirationDate.toISOString());
      }

      // Append images
      if (data.images?.length > 0) {
        data.images.forEach((imageFile: any) => {
          if (!imageFile.hasOwnProperty('uploaded') || (imageFile.hasOwnProperty('uploaded') && !imageFile.uploaded)) {
            formData.append('images', imageFile.originFileObj);
          }
        });
      }

      // Append image urls that need to remove from db
      imageUrlToRemove.forEach((imageUrl) => {
        formData.append(`images_remove`, imageUrl);
      });
      
      const response = await propertiesService.updateProperty(formData, id);
      
      if (response.code === 200) {
        message.success('Property updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (error) {
      message.error("Error occurred while creating a new property.");
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
    <div>
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
            <Card 
              title="Basic information"
              className="custom-card" 
              extra={<Link to="/admin/properties">Back</Link>}
            >
              <Row gutter={16}>
                <Col span={24} className="mb-5">
                    <Form.Item 
                      label='Listing type:' 
                      name='listingType' 
                      style={{height: "4.5rem"}}
                      initialValue={standardizeData.listingType(property?.listingType || "")}
                    >
                      <Segmented 
                        options={['For Sale', 'For Rent']} 
                        block 
                        className="custom-segmented"
                        onChange={handleChangeListingType}
                      />
                    </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item label='Property type' name='propertyType' initialValue={property?.propertyDetails?.propertyType}>
                    <Select
                      value={property?.propertyDetails?.propertyType}
                      placeholder='Please select property type'
                      style={{ width: "100%" }}
                      options={propertyCategoryOptions}
                    />
                  </Form.Item> 
                </Col>

                <Col span={24}>
                  <GetAddress initialValues={property?.location}/>
                </Col>
              </Row>
            </Card>

            <Card title="Property information" className="custom-card" style={{marginTop: '2rem'}}>
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                  <Form.Item 
                    label='Property length' 
                    name='propertyLength' 
                    initialValue={property?.area?.propertyLength}
                  >
                    <InputNumber 
                      type="number" min={0} 
                      onChange={handlePropertyLengthChange}
                      className="custom-number-input" 
                      placeholder="Enter length of property"
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                  <Form.Item 
                    label='Property width' 
                    name='propertyWidth'
                    initialValue={property?.area?.propertyWidth}
                  >
                    <InputNumber 
                      type="number" min={0} 
                      className="custom-number-input" 
                      onChange={handlePropertyWidthChange}
                      placeholder="Enter width of property"
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                  <Form.Item 
                    label='Area'
                    initialValue={property?.area?.propertyLength && property?.area?.propertyWidth 
                      ? property?.area?.propertyLength * property?.area?.propertyWidth 
                      : undefined}
                  >
                    <InputNumber 
                      disabled 
                      type="number" 
                      min={0} 
                      className="custom-number-input" 
                      placeholder="Enter width and height"
                      defaultValue={property?.area?.propertyLength && property?.area?.propertyWidth 
                        ? property?.area?.propertyLength * property?.area?.propertyWidth 
                        : undefined}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={`Property ${postType} price`} 
                    name='price'
                    initialValue={property?.price && property.price >= 1000 ? property.price / 1000 : property?.price}
                  >
                    <Input 
                      value={property?.price}
                      addonAfter={
                        <Select 
                          value={property?.price && property.price >= 1000 ? "billion" : "million"} 
                          onChange={handlePriceUnitChange}
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
                      value={`${property?.area?.propertyLength && property?.area?.propertyWidth && property?.price 
                        && (priceMultiplier * property.price / (property.area.propertyLength * property.area.propertyWidth)).toFixed(2)} million`}
                    />
                  </Form.Item>
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
                      <Radio value="default" className="label-light"> Default </Radio>
                      <Radio value="preminum"> Preminum </Radio>
                      <Radio value="featured"> Featured </Radio>
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
                    onExpireDateTimeChange={handleExpireTimeChange} 
                    expireTimeGiven={property?.expireAt}
                  />
                </Col>

                <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
                  <Form.Item label="Post position:" name='position' initialValue={property?.position}>
                    <InputNumber 
                      // value={property?.position}               
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
    </div>
  )
}

export default EditProperty;