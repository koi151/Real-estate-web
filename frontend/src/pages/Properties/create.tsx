import { Button, Card, Col, Form, Input, InputNumber, 
         Radio, Row, Segmented, Select, message } from "antd";
import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { SegmentedValue } from "antd/es/segmented";
import { Link } from "react-router-dom";

import propertiesService from "../../services/admin/properties.service";
import GetAddress from "../../components/getAddress/getAddress";
import ExpireTimePicker from "../../components/ExpireTimePicker/expireTimePicker";
import './create.scss'
import { Dayjs } from "dayjs";

const CreateProperty: React.FC = () => {
  const [postType, setPostType] = useState<string>('sell');
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");

  // child component
  const [expireDateTime, setExpireDateTime] = useState<Dayjs | null>(null);
  
  const propertyCategoryOptions = [
    { value: 'townHouse', label: 'Town house' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
  ]

  const handleExpireTimeChange = (dateTime: Dayjs | null) => {
    setExpireDateTime(dateTime);
  }
  

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
    const formatedValue = value === "For sale" ? 'sell' : 'hire';
    setPostType(formatedValue);
  }

  const handleEditorChange = (content: any, editor: any) => {
    const contentString = typeof content === 'string' ? content : '';
    setEditorContent(contentString);
  };

  const onFinishForm = async (data: any) => {
    try {
      data["location"] = {
        city: data.city,
        district: data.district,
        ward: data.ward,
        address: data.address
      }
      delete data.city;
      delete data.district;
      delete data.address;
      delete data.ward;

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

      data['expireDate'] = expireDateTime;
      console.log(data)

      // const response = await propertiesService.createProperty(data);
      
      // if (response.code === 200) {
      //   message.success("Property created successfully !", 3);
      // } else {
      //   message.error(response.message, 3)
      // }

    } catch (error) {
      message.error("Error occured while creating new property.")
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card 
        title="Create property"
        className="custom-card" 
        extra={<Link to="/admin/properties">Back</Link>}
      >
        <Form layout="vertical" onFinish={onFinishForm} >
          <Row gutter={16}>
            <Col span={24} className="mb-5">
              <Form.Item 
                label='Choose listing type' 
                name='listingType' 
                initialValue={'For sale'}
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
                <Input type="text" id="title" required />
              </Form.Item>
            </Col>

            <Col span={24}>
              <GetAddress />
            </Col>

            <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item label='Property length' name='propertyLength'>
                <InputNumber 
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
                  placeholder='Please select property type'
                  style={{ width: "100%" }}
                  options={propertyCategoryOptions}
                />
              </Form.Item> 
            </Col>
            <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
              <Form.Item label={`Property ${postType} price`} name='price'>
                <Input 
                  addonAfter={selectPriceUnit} 
                  placeholder={`Please select property ${postType} price`} 
                />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item label={`Property ${postType} description:`}>
                <Editor
                  id="description" 
                  value={editorContent}
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
              <Form.Item label="Post type:" name='postType' initialValue={'default'}>
                <Radio.Group>
                  <Radio value="default" className="label-light"> Default </Radio>
                  <Radio value="preminum"> Preminum </Radio>
                  <Radio value="featured"> Featured </Radio>
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
              <ExpireTimePicker onExpireDateTimeChange={handleExpireTimeChange} />
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
        </Form>
      </Card>
    </div>
  )
}

export default CreateProperty;