import { Badge, Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { AiFillEye, AiOutlineEdit, AiOutlineDelete, AiOutlinePlusSquare } from 'react-icons/ai';

import AdminRolesService from "../../../services/admin/roles.service";

import { convertLabelToPermission } from "../../../helpers/standardizeData";
import NoPermission from "../../../components/admin/NoPermission/noPermission";


const CreateAdminRole: React.FC = () => {
  const [accessAllowed, setAccessAllowed] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);


  const roleOptions = ['Properties', 'Property categories', 'Administrator roles', 'Administrator accounts'].flatMap(label => ({
    label,
    options: ['view', 'create', 'edit', 'delete'].map(action => ({
      value: `${label} ${action}`,
      label: `${label} ${action}`,
      icon: {
        view: <AiFillEye />,
        create: <AiOutlinePlusSquare />,
        edit: <AiOutlineEdit />,
        delete: <AiOutlineDelete />,
      }[action],
    })),
  }));
    
  const onFinishForm = async (data: any) => {
    try {
      const convertedPermissions = selectedItems.map(convertLabelToPermission);
      data.permissions = convertedPermissions;

      const response = await AdminRolesService.createRole(data);
      
      if (response.code === 200) {
        message.success('Role created successfully!', 3);
      } else {
        message.error(response.message, 3);
      }
  
    } catch (error) {
      console.log("Error occurred:", error);
      message.error("Error occurred while creating role.");
    }
  }

  return (
    <>
    {accessAllowed ? (
      <>
        <div className="d-flex align-items-center justify-content-center"> 
          <Form
            layout="vertical" 
            onFinish={onFinishForm}
            method="POST"
            className="custom-form" 
          >
            <Badge.Ribbon text={<Link to="/admin/roles">Back</Link>} color="purple" className="custom-ribbon">
              <Card 
                title="Property role information" 
                className="custom-card" 
                style={{marginTop: '2rem'}}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item 
                      label={<span>Role title <b className="required-txt">- required:</b></span>}
                      name='title'
                    >
                      <Input type="text" id="title" required />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item 
                      label={`Role description:`} 
                      name='description'  
                    >
                      <TextArea rows={5} placeholder="Enter role descripton here" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={`Role permissions:`} 
                      name='permissions'  
                    >
                      <Select 
                        mode="multiple" 
                        allowClear 
                        placeholder="Choose role permissions" 
                        value={selectedItems} 
                        onChange={setSelectedItems} 
                        style={{ width: '100%' }} 
                        options={roleOptions.map(category => ({
                          label: category.label,
                          options: category.options.map(option => ({
                            value: option.value,
                            label: (
                              <div className="d-flex align-items-center">
                                {option.icon}
                                <div className="ml-1">{option.label}</div>
                              </div>
                            ),
                          })),
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item>
                      <Button className='custom-btn-main' type="primary" htmlType="submit">
                        Create
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Badge.Ribbon>
          </Form>
        </div>
      </>
    ) : (
      <NoPermission permissionType='access' />
    )}
  </>
  )
}

export default CreateAdminRole;
