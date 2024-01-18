import { Card, Col, Form, Input, InputNumber, Radio, Row, Segmented, Select } from "antd";
import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';

import './create.scss'

const CreateProperty: React.FC = () => {
  const [postType, setPostType] = useState<string>('sell');
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);

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

  const handleSegmentedChange = (value: string) => {
    const [_, secondWord] = value.split(' ');
    // const words = value.split(' ');
    // const formattedValue = `${words[0].charAt(0).toLowerCase()}${words[0].slice(1)}${words[1].charAt(0).toUpperCase()}${words[1].slice(1)}`;
    setPostType(secondWord.charAt(0).toUpperCase() + secondWord.slice(1));
  };

  const selectPriceUnit = (
    <Select defaultValue="million">
      <Select.Option value="million">million</Select.Option>
      <Select.Option value="billion">billion</Select.Option>
    </Select>
  );

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card 
        title="Create Property"
        className="custom-card" 
        extra={<a href="/properties">Back</a>}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24} style={{height: "4.5rem"}} className="mb-3">
              <Segmented 
                options={['For sell', 'For rent']} 
                block 
                className="custom-segmented"
                onChange={(value) => handleSegmentedChange(value as string)}
              />
            </Col>
            <Col span={24}>
              <Form.Item label={<span>Post title <b className="required-txt">- required:</b></span>}>
                <Input type="text" id="title" required />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item label='City'>
                <Input type="text"/>
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item label='District:'>
                <Input type="text"/>
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item label='Address:'>
                <Input type="text"/>
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item label='Property length'>
                <InputNumber 
                  type="number" min={0} 
                  onChange={handlePropertyLengthChange}
                  className="custom-number-input" 
                  placeholder="Enter length of property"
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item label='Property width'>
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
              <Form.Item label='Property category'>
                <Select
                  placeholder='Please select property category'
                  style={{ width: "100%" }}
                  options={propertyCategoryOptions}
                />
              </Form.Item> 
            </Col>
            <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
              <Form.Item label={`Property ${postType}ing price`}>
                <Input 
                  addonAfter={selectPriceUnit} 
                  placeholder={`Please select property ${postType}ing price`} 
                />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item label={`Property ${postType}ing description:`}>
                <Editor
                  id="description" 
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
              <Form.Item label="Post type:">
                <Radio.Group defaultValue="default">
                  <Radio value="default"> Default </Radio>
                  <Radio value="preminum"> Preminum </Radio>
                  <Radio value="featured"> Featured </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item label="Property status:">
                <Radio.Group defaultValue="active">
                  <Radio value="active">Active</Radio>
                  <Radio value="inactive">Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
              <Form.Item label="Post expire after:">
                <Radio.Group defaultValue="none">
                  <Radio value="day">1 day</Radio>
                  <Radio value="week">1 week</Radio>
                  <Radio value="month">1 month</Radio>
                  <Radio value="none">None</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
              <Form.Item label="Post position:">
                <InputNumber 
                  type="number"
                  id="position" 
                  min={0} 
                  className="custom-number-input position-input"
                  placeholder='Auto increase'
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default CreateProperty;