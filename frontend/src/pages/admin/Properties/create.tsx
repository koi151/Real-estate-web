import { Badge, Button, Card, Col, Form, Input, InputNumber, 
         Radio, Row, Segmented, Select, TreeSelect, message } from "antd";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { SegmentedValue } from "antd/es/segmented";
import { Link, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DefaultOptionType } from "antd/es/select";
import { useDispatch, useSelector } from "react-redux";

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
import { setPermissions } from "../../../redux/reduxSlices/permissionsSlice";
import './create.scss'

const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);

  const [postType, setPostType] = useState<string>('sell');
  const [price, setPrice] = useState<number | null>(null);
  const [propertyWidth, setPropertyWidth] = useState<number | null>(null);
  const [propertyLength, setPropertyLength] = useState<number | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editorContent, setEditorContent] = useState<string>("");

  const [categoryTree, setCategoryTree] = useState<DefaultOptionType[] | undefined>(undefined);
  const [category, setCategory] = useState<string>();

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

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(event.target.value);
    setPrice(isNaN(inputValue) ? null : inputValue);
  }

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

  const handleTreeSelectChange = (selectedNode: any) => {
    setCategory(selectedNode.label);
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
      const formData = new FormData();
  
      data.title && formData.append('title', data.title);
      data.position && formData.append('position', data.position);
  
      formData.append('postType', data.postType || 'default');
      data.status && formData.append('status', data.status);
  
      // Append location data
      data.city && formData.append('location[city]', data.city);
      data.district && formData.append('location[district]', data.district);
      data.ward && formData.append('location[ward]', data.ward);
      data.address && formData.append('location[address]', data.address);
  
      // Append area data
      data.propertyWidth && formData.append('area[propertyWidth]', data.propertyWidth);
      data.propertyLength && formData.append('area[propertyLength]', data.propertyLength);
  
      // Append propertyDetails
      category && formData.append('propertyDetails[propertyCategory]', category);
  
      // Append description
      editorContent && formData.append('description', editorContent);
  
      // Append calculated price
      const parsedPrice = parseFloat(data.price);
      parsedPrice && formData.append('price', isNaN(parsedPrice) ? '' : String(priceMultiplier * parsedPrice));
  
      // Append listingType
      if (data.listingType) {
        const words = data.listingType.split(' ');
        const formattedListingType = `${words[0].charAt(0).toLowerCase()}${words[0].slice(1)}${words[1].charAt(0).toUpperCase()}${words[1].slice(1)}`;
        formData.append('listingType', formattedListingType);
      }
  
      // Append expireAt
      if (expireDateTime) {
        formData.append('expireTime', expireDateTime.toISOString());
      } else if (data.expireTime === 'day' || data.expireTime === 'week' || data.expireTime === 'month') {
        const duration = data.expireTime === 'day' ? 1 : (data.expireTime === 'week' ? 7 : 30);
        const expirationDate = dayjs().add(duration, 'day');
        formData.append('expireTime', expirationDate.toISOString());
      }
  
      if (data.images && data.images.length > 0) {
        data.images.forEach((imageFile: any) => {
          formData.append('images', imageFile.originFileObj);
        });
      }
  
      const response = await propertiesService.createProperty(formData);
  
      if (response.code === 200) {
        message.success("Property created successfully!", 3);
      } else {
        message.error(response.message, 3);
      }
    } catch (error) {
      message.error("Error occurred while creating a new property.");
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
                    label='Select property category' 
                    name='propertyCategory' 
                  >
                    <TreeSelect 
                      style={{ width: '100%' }} 
                      value={category} 
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} 
                      treeData={categoryTree} 
                      placeholder="Please select" 
                      treeDefaultExpandAll 
                      onChange={handleTreeSelectChange} 
                      treeLine 
                      labelInValue
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
                <Form.Item label={`Property ${postType} price`} name='price'>
                  <Input
                    type='number'
                    addonAfter={selectPriceUnit} 
                    placeholder={`Please select property ${postType} price`}
                    onChange={handlePriceChange}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item label={`Price per meter square`}>
                  <Input
                    disabled 
                    placeholder={`Select property ${postType} price and area to view`} 
                    style={{width: "100%"}}
                    value={`${propertyLength && propertyWidth && price && (priceMultiplier * price / (propertyLength * propertyWidth)).toFixed(2)} million`}
                  />
                </Form.Item>
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