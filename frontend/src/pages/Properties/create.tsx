import { Card, Col, Form, Input, InputNumber, Radio, RadioChangeEvent, Row, Select } from "antd";
import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Option } from "antd/es/mentions";

import './create.scss'

const CreateProperty: React.FC = () => {
  const [postType, setPostType] = useState<string>('sell');
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);

  const handlePostTypeChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setPostType(value === 'forSale' ? 'sell' : 'rent');
  };

  const handlePropertyLengthChange = (value: number | null) => {
    setPropertyLength(value);
  };

  const handlePropertyWidthChange  = (value: number | null) => {
    setPropertyWidth(value);
  };

  const selectPriceUnit = (
    <Select defaultValue="million">
      <Option value="million">million</Option>
      <Option value="billion">billion</Option>
    </Select>
  );

  return (
    <>
       <Card 
        title="Create Property"
        className="custom-card" 
        extra={<a href="/properties">Back</a>}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span>Post title <b className="required-txt">- required:</b></span>}>
                <Input type="text" id="title" required />
              </Form.Item>
            </Col>

            <Col sm={8} md={8} lg={8} xl={8} xxl={8}>
              <Form.Item label='City'>
                <Input type="text"/>
              </Form.Item>
            </Col>
            <Col sm={8} md={8} lg={8} xl={8} xxl={8}>
              <Form.Item label='District:'>
                <Input type="text"/>
              </Form.Item>
            </Col>
            <Col sm={8} md={8} lg={8} xl={8} xxl={8}>
              <Form.Item label='Detail address:'>
                <Input type="text"/>
              </Form.Item>
            </Col>

            <Col sm={5} md={5} lg={5} xl={5} xxl={5}>
              <Form.Item label="Type of post:">
                <Radio.Group defaultValue="forSale" onChange={handlePostTypeChange}>
                  <Radio value="forSale">For sale</Radio>
                  <Radio value="forRent">For rent</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={7} md={7} lg={7} xl={7} xxl={7}>
              <Form.Item label='Property length'>
                <InputNumber 
                  type="number" min={0} 
                  onChange={handlePropertyLengthChange}
                  className="custom-number-input" 
                  placeholder="Enter length of property"
                />
              </Form.Item>
            </Col>
            <Col sm={7} md={7} lg={7} xl={7} xxl={7}>
              <Form.Item label='Property width'>
                <InputNumber 
                  type="number" min={0} 
                  className="custom-number-input" 
                  onChange={handlePropertyWidthChange}
                  placeholder="Enter width of property"
                />
              </Form.Item>
            </Col>
            <Col sm={5} md={5} lg={5} xl={5} xxl={5}>
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


            <Col sm={10} md={10} lg={10} xl={10} xxl={10}>
              <Form.Item label={`${postType.charAt(0).toUpperCase() + postType.slice(1)} price:`}>
                <Input addonAfter={selectPriceUnit} />
              </Form.Item>
            </Col>
            <Col sm={9} md={9} lg={9} xl={9} xxl={9}>
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
            
            <Col span={24}>
              <Form.Item label={`Property ${postType} description:`}>
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
            <Col sm={12} md={9} lg={9} xl={9} xxl={9}>
              <Form.Item label="Post type:">
                <Radio.Group defaultValue="default">
                  <Radio value="default"> Default </Radio>
                  <Radio value="preminum"> Preminum </Radio>
                  <Radio value="featured"> Featured </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
              <Form.Item label="Property status:">
                <Radio.Group defaultValue="active">
                  <Radio value="active">Active</Radio>
                  <Radio value="inactive">Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={12} md={9} lg={9} xl={9} xxl={9}>
              <Form.Item label="Post expire after:">
                <Radio.Group defaultValue="none">
                  <Radio value="day">1 day</Radio>
                  <Radio value="week">1 week</Radio>
                  <Radio value="month">1 month</Radio>
                  <Radio value="none">None</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  )
}

export default CreateProperty;