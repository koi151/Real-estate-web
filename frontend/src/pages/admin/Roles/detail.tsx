import { Badge, Card, Col, Form, Input, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { RootState } from "../../../redux/stores";
import { useDispatch, useSelector } from "react-redux";

import AdminRolesService from "../../../services/admin/roles.service";

import { RolesType } from "../../../../../backend/commonTypes";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import { setPermissions } from "../../../redux/reduxSlices/permissionsSlice";

const AdminRoleDetail: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RolesType | undefined>(undefined);

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
          setLoading(false);
        } else {
          message.error(response.message, 2);
          setLoading(false);
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching administrator role data', 2);
          console.log('Error occurred:', err);
        }
      }
    };
    fetchData();
  }, [id, navigate])

  // if permission in redux not existed => fetch permissions
  useEffect(() =>  {
    if (currentUserPermissions?.administratorRolesView)
      return;

    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getPermissions();
        if (response.code === 200) {
          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

          if (!response.permissions.administratorRolesView) {
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

  return (
    <>
      {currentUserPermissions?.administratorRolesView || viewAllowed ? (
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
                    </Row>
                  </Card>
                </Badge.Ribbon>
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

export default AdminRoleDetail;