import { Badge, Card, Col, Form, Input, InputNumber, Radio, Row, Segmented, Select, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";

// Services
import propertiesService from "../../services/admin/properties.service";
import AdminRolesService from "../../services/admin/roles.service";

// Data types
import { PropertyType } from "../../../../backend/commonTypes";
import * as standardizeData from '../../helpers/standardizeData'

// Components
import GetAddress from "../../components/admin/getAddress/getAddress";
import UploadMultipleFile from "../../components/admin/UploadMultipleFile/uploadMultipleFile";
import ExpireTimePicker from "../../components/admin/ExpireTimePicker/expireTimePicker";
import NoPermission from "../../components/admin/NoPermission/noPermission";

// Redux
import { RootState } from "../../redux/stores";
import { setPermissions } from "../../redux/reduxSlices/permissionsSlice";


const PropertyDetail: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  const [postType, setPostType] = useState<string>('sell');
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);

  const [property, setProperty] = useState<PropertyType | undefined>(undefined);

  // data from child component
  const [expireDateTime, setExpireDateTime] = useState<Dayjs | null>(null);

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

      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching property data', 2);
          console.log('Error occurred:', error);
        }
      }
    };
    fetchData();
  }, [id, navigate])

  // if permission in redux not existed => fetch permissions
  useEffect(() =>  {
    if (currentUserPermissions?.propertiesView)
      return;

    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getPermissions();
        if (response.code === 200) {
          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

          if (!response.permissions.propertiesView) {
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


  const handleExpireTimeChange = (dateTime: Dayjs | null) => {
    setExpireDateTime(dateTime);
  }

  return (
    <>
      {currentUserPermissions?.propertiesView || viewAllowed ? (
        <>
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
                            name='listingType' 
                            style={{height: "4.5rem"}}
                            initialValue={standardizeData.listingType(property?.listingType || "")}
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
                        <Form.Item label='Property type' name='propertyCategory' initialValue={property?.propertyDetails?.propertyCategory}>
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
                        label='Property length' 
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
                        label='Property width' 
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
                          value={property?.price}
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
                      <UploadMultipleFile uploadedImages={property?.images}/>
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
                        <Input type="text" id="title" required disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label={`Property ${postType}ing description:`}>
                        <Editor
                          disabled
                          id="description" 
                          initialValue={property?.description}               
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
                        <Radio.Group disabled>
                          <Radio value="default" className="label-light"> Default </Radio>
                          <Radio value="preminum"> Preminum </Radio>
                          <Radio value="featured"> Featured </Radio>
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
          )}
        </>
      ) : (
        <NoPermission permissionType='access' />
      )}
    </>
  )
}

export default PropertyDetail;