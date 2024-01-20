import { Button, Card, Col, Flex, Form, Input, InputNumber, Radio, Row, Segmented, Select, Skeleton, Spin, message } from "antd";
import { SegmentedValue } from "antd/es/segmented";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate, useParams } from "react-router-dom";

import propertiesService from "../../services/admin/properties.service";
import { PropertyType } from "../../../../backend/commonTypes";
import GetAddress from "../../components/getAddress/getAddress";

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

  useEffect(() => {
    console.log(property);
  }, [property])
  
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

  const selectPriceUnit = (
    <Select defaultValue="million" onChange={handlePriceUnitChange}>
      <Select.Option value="million">million</Select.Option>
      <Select.Option value="billion">billion</Select.Option>
    </Select>
  );

  const handleChangeListingType = (value: SegmentedValue) => {
    const formatedValue = value = "For sale" ? 'sell' : "hire"
    setPostType(formatedValue)
  }

  const handleEditorChange = (content: any, editor: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  // const getExpireDay =

  const onFinishForm = async (data: any) => {
    try {
      data["location"] = {
        city: data.city,
        district: data.district,
        address: data.address
      }
      delete data.city;
      delete data.district;
      delete data.address;

      data["area"] = {
        propertyWidth: data.propertyWidth,
        propertyLength: data.propertyLength,
      }
      delete data.width;
      delete data.length;

      data['propertyDetails'] = {
        propertyType: data.propertyType
      }
      delete data.propertyType;

      data['description'] = editorContent;
      data.price = priceMultiplier * data.price;
      
      // etc: For rent => forRent
      const words = data.listingType.split(' ');
      data.listingType = `${words[0].charAt(0).toLowerCase()}${words[0].slice(1)}${words[1].charAt(0).toUpperCase()}${words[1].slice(1)}`;

      const response = await propertiesService.createProperty(data);
      
      if (response.code === 200) {
        message.success("Property created successfully !", 3);
      } else {
        message.error(response.message, 3)
      }

    } catch (error) {
      message.error("Error occured while creating new property.")
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
          <Card 
            title="Edit Property"
            className="custom-card" 
            extra={<Link to="/admin/properties">Back</Link>}
          >
            <Form layout="vertical" onFinish={onFinishForm} >
              <Row gutter={16}>
                <Col span={24} className="mb-5">
                  <Form.Item 
                    label='Listing type:' 
                    name='listingType' 
                    style={{height: "4.5rem"}}
                  >
                    <Segmented 
                      options={['For sale', 'For rent']} 
                      block 
                      className="custom-segmented"
                      onChange={handleChangeListingType}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item 
                    label={<span>Post title <b className="required-txt">- required:</b></span>}
                    name='title'
                  >
                    <Input type="text" id="title" value={property?.title} required />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <GetAddress />
                </Col>

                <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                  <Form.Item label='Property length' name='propertyLength'>
                    <InputNumber 
                      value={property?.area?.propertyLength}
                      type="number" min={0} 
                      onChange={handlePropertyLengthChange}
                      className="custom-number-input" 
                      placeholder="Enter length of property"
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                  <Form.Item label='Property width' name='propertyWidth'>
                    <InputNumber 
                      value={property?.area?.propertyWidth}
                      type="number" min={0} 
                      className="custom-number-input" 
                      onChange={handlePropertyWidthChange}
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
                  <Form.Item label='Property type' name='propertyType'>
                    <Select
                      value={property?.propertyDetails?.propertyType}
                      placeholder='Please select property type'
                      style={{ width: "100%" }}
                      options={propertyCategoryOptions}
                    />
                  </Form.Item> 
                </Col>
                <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item label={`Property ${postType} price`} name='price'>
                    <Input 
                      value={property?.price}
                      addonAfter={selectPriceUnit} 
                      placeholder={`Please select property ${postType} price`} 
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item label={`Property ${postType}ing description:`}>
                    <Editor
                      id="description" 
                      value={property?.description}               
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
                      <Radio value="default"> Default </Radio>
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
                <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
                  <Form.Item label="Post expire after:" name='expireAt'>
                    <Radio.Group>
                      <Radio value="day">1 day</Radio>
                      <Radio value="week">1 week</Radio>
                      <Radio value="month">1 month</Radio>
                      <Radio value="">None</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
                  <Form.Item label="Post position:" name='position' initialValue={property?.position}>
                    <InputNumber
                      value={property?.position}               
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
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      )}
    </div>

  )
}

export default EditProperty;