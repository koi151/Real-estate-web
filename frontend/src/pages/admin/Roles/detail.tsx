import { Badge, Card, Col, Form, Input, Row, Select, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

import AdminRolesService from "../../../services/admin/roles.service";

import { RolesType } from "../../../../../backend/commonTypes";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import { AiFillEye, AiOutlineDelete, AiOutlineEdit, AiOutlinePlusSquare } from "react-icons/ai";
import { convertPermissionToLabels } from "../../../helpers/standardizeData";

const AdminRoleDetail: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [accessAllowed, setAccessAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<RolesType | undefined>(undefined);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Can not find role, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        const response = await AdminRolesService.getSingleRole(id);

        if(response?.code === 200 && response.role) {
          setRole(response.role);
          setAccessAllowed(true);
          setSelectedItems(response.role.permissions.map(convertPermissionToLabels));

        } else {
          message.error(response.message, 2);
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching administrator role data', 2);
          console.log('Error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate])

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
                        >
                          <Input type="text" id="title" required disabled/>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item 
                          label={`Role description:`} 
                          initialValue={role?.description}
                          name='description'  
                        >
                          <TextArea rows={5} placeholder="Enter role descripton here" disabled />
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
                    </Row>
                  </Card>
                </Badge.Ribbon>
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

export default AdminRoleDetail;