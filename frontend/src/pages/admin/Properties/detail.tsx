import { Badge, Card, Col, Form, Input, InputNumber, Radio, Row, Segmented, Select, Space, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dayjs } from "dayjs";

// Services
import propertiesService from "../../../services/admin/properties.service";

// Data types
import { PropertyType } from "../../../../../backend/commonTypes";
import * as standardizeData from '../../../helpers/standardizeData'

// Components
import GetAddress from "../../../components/admin/getAddress/getAddress";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";
import ExpireTimePicker from "../../../components/admin/ExpireTimePicker/expireTimePicker";
import NoPermission from "../../../components/admin/NoPermission/noPermission";

// Redux
import { directionOptions, documentOptions, furnitureOptions } from "../../../helpers/propertyOptions";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { SlDirections } from "react-icons/sl";


const PropertyDetail: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [postType] = useState<string>('sell');
  const [priceMultiplier] = useState<number>(1);

  const [property, setProperty] = useState<PropertyType | undefined>(undefined);

  // data from child component
  const [, setExpireDateTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Error occurred while searching property information, redirect to previous page', 3);
          navigate(-1);
          return;
        }

        setLoading(true);
        const response = await propertiesService.getSingleProperty(id);

        if(response?.code === 200 && response.property) {
          setProperty(response.property);
          setAccessAllowed(true)
        } else {
          message.error(response.message, 2);
        }

      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching property data', 2);
          console.log('Error occurred:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate])

  const handleExpireTimeChange = (dateTime: Dayjs | null) => {
    setExpireDateTime(dateTime);
  }

  return (
    <>
      { !loading ? (
        <>
          { accessAllowed ? (
            
            <div className="d-flex align-items-center justify-content-center"> 
              <Form 
                layout="vertical" 
                disabled
                className="custom-form"
                style={{width: '75%'}} 
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
                            initialValue={standardizeData.listingTypeFormatted(property?.listingType || "")}
                          >
                            <Segmented 
                              disabled
                              options={['For Sale', 'For Rent']} 
                              block 
                              className="custom-segmented"
                            />
                          </Form.Item>
                      </Col>
                      <Col sm={24}>
                        <Form.Item label='Property type' name='propertyCategory' initialValue={property?.propertyDetails?.propertyCategoryTitle}>
                          <Select
                            disabled
                            value={property?.propertyDetails?.propertyCategory}
                            placeholder='Please select property type'
                            style={{ width: "100%" }}
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
                        name='propertyLength' 
                        initialValue={property?.area?.propertyLength}
                      >
                        <InputNumber 
                          type="number" min={0} disabled
                          className="custom-number-input" 
                          placeholder="Enter length of property"
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item 
                        label='Property width (m)' 
                        name='propertyWidth'
                        initialValue={property?.area?.propertyWidth}
                      >
                        <InputNumber 
                          type="number" min={0} disabled
                          className="custom-number-input" 
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
                          disabled
                          value={property?.price ? property?.price : 'No data'}
                          addonAfter={
                            <Select 
                              value={property?.price && property.price >= 1000 ? "billion" : "million"} 
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
                        initialValue={property?.propertyDetails?.rooms && standardizeData.getRoomCount(property?.propertyDetails?.rooms, 'bedrooms')}
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
                      <UploadMultipleFile uploadedImages={property?.images}/>
                    </Col>
                  </Row>
                </Card>

                <Card title="Post information" className="custom-card" style={{marginTop: '2rem'}}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item 
                        label='Post title'
                        name='title'
                        initialValue={property?.title}
                      >
                        <Input type="text" id="title" required disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label={`Property ${postType}ing description:`}>
                        <Editor
                          disabled
                          id="description" 
                          initialValue={property?.description}               
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
                      <Form.Item label="Post type:" name='postType' initialValue={property?.postType}>
                        <Radio.Group disabled>
                          <Radio value="standard" className="label-light"> Standard </Radio>
                          <Radio value="premium" className="label-light"> Preminum </Radio>
                          <Radio value="exclusive" className="label-light"> Exclusive </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Property status:" name='status' initialValue={property?.status}>
                        <Radio.Group disabled>
                          <Radio value="active">Active</Radio>
                          <Radio value="inactive">Inactive</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <ExpireTimePicker 
                        onExpireDateTimeChange={handleExpireTimeChange} 
                        expireTimeGiven={property?.expireTime}
                      />
                    </Col>

                    <Col sm={24} md={24}  lg={12} xl={12} xxl={12}>
                      <Form.Item label="Post position:" name='position' initialValue={property?.position}>
                        <InputNumber 
                          type="number"
                          id="position" 
                          min={0} disabled
                          className="custom-number-input position-input"
                          placeholder='Auto increase by default'
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

export default PropertyDetail;