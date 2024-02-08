import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Form, Input, Row, Spin, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import AdminRolesService from "../../services/admin/roles.service";
import { RolesType } from "../../../../backend/commonTypes";
import { AiFillEye, AiOutlineEdit, AiOutlineDelete, AiOutlinePlusSquare } from 'react-icons/ai';

const EditAdminRole: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RolesType | undefined>(undefined);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Cannot find role, redirecting to previous page...', 3);
          navigate(-1);
          return;
        }
        const response = await AdminRolesService.getSingleRole(id);

        if(response?.code === 200 && response.role) {
          setRole(response.role);
          setSelectedItems(response.role.permissions.map(convertPermissionToLabels));
          setLoading(false);
        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (error) {
        message.error('No role found', 2);
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, [id]);

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

  const convertLabelToPermission = (label: string): string => {
    const parts = label.toLowerCase().split(' ');
    const basePermission = parts.slice(0, -1).join('-');
    const action = parts[parts.length - 1].toLowerCase();
    return `${basePermission}_${action}`;
  };

  const convertPermissionToLabels = (label: string): string => {
    const parts = label.toLowerCase().split(/[-_]/);
    const basePermission = parts.slice(0, -1).map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join(' ');
    const action = parts[parts.length - 1];
    return `${basePermission} ${action}`;
  };  
  

  const onFinishForm = async (data: any) => {
    try {
      if (!id) {
        console.error('Cannot get role id');
        message.error('Error occurred', 3);
        return;
      }

      const convertedPermissions = selectedItems.map(convertLabelToPermission);
      data.permissions = convertedPermissions;

      const response = await AdminRolesService.updateRole(data, id);
      
      if (response.code === 200) {
        message.success('Role updated successfully!', 3);
      } else {
        console.error(response.message);
        message.error('Error occurred', 3);
      }
  
    } catch (error) {
      console.log("Error occurred:", error);
      message.error("Error occurred while updating role.");
    }
  }

  return (
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
            onFinish={onFinishForm}
            method="POST"
            encType="multipart/form-data"
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
                      initialValue={role?.title}
                      rules={[{ required: true, message: 'Please input the role title!' }]}
                    >
                      <Input type="text" id="title" required />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item 
                      label={`Role description:`} 
                      initialValue={role?.description}
                      name='description'  
                    >
                      <TextArea rows={5} placeholder="Enter role description here" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={`Role permissions:`} 
                      name='permissions'  
                      initialValue={selectedItems}
                    >
                      <Select 
                        mode="multiple" 
                        allowClear 
                        placeholder="Choose role permissions" 
                        onChange={setSelectedItems} 
                        style={{ width: '100%' }} 
                      >
                        {roleOptions.map(category => (
                          <Select.OptGroup label={category.label} key={category.label}>
                            {category.options.map(option => (
                              <Select.Option value={option.value} key={option.value}>
                                <div className="d-flex align-items-center">
                                  {option.icon}
                                  <div className="ml-1">{option.label}</div>
                                </div>
                              </Select.Option>
                            ))}
                          </Select.OptGroup>
                        ))}
                      </Select>

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
            </Badge.Ribbon>
          </Form>
        </div>
      )}
  </>
  )
}

export default EditAdminRole;
