import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Card, Col, Form, Input, Radio, Row, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";

import AdminRolesService from "../../../services/admin/roles.service";
import adminAccountsService from "../../../services/admin/accounts.service";

import { AdminAccountType } from "../../../../../backend/commonTypes";
import NoPermission from "../../../components/admin/NoPermission/noPermission";
import UploadMultipleFile from "../../../components/admin/UploadMultipleFile/uploadMultipleFile";

import { setPermissions } from "../../../redux/reduxSlices/permissionsSlice";

const AdminAccountsDetail: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserPermissions = useSelector((state: RootState) => state.currentUserPermissions.permissions);

  const [viewAllowed, setViewAllowed] = useState(true);
  const [account, setAccount] = useState<AdminAccountType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          message.error('Could not found account, redirect to previous page', 3);
          navigate(-1);
          return;
        }
        const response = await adminAccountsService.getSingleAccount(id);

        if(response?.code === 200 && response.account) {
          setAccount(response.account);
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
          message.error('Error occurred while fetching administrator account data', 2);
          console.log('Error occurred:', err);
        }
      }
    };
    fetchData();
  }, [id])

  // if permission in redux not existed => fetch permissions
  useEffect(() =>  {
    if (currentUserPermissions?.administratorAccountsView)
      return;

    const fetchData = async () => {
      try {
        const response = await AdminRolesService.getPermissions();
        if (response.code === 200) {
          if (response.permissions) {
            dispatch(setPermissions(response.permissions));
          }

          if (!response.permissions.administratorAccountsView) {
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
      {currentUserPermissions?.administratorAccountsView || viewAllowed ? (
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
                <Badge.Ribbon text={<Link to="/admin/accounts">Back</Link>} color="purple" className="custom-ribbon">
                  <Card 
                    title="View administrator account" 
                    className="custom-card" 
                    style={{marginTop: '2rem'}}
                    extra={<Link to="/admin/accounts">Back</Link>}
                  >
                    <Row gutter={16}>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label='Full name:'
                          name='fullName'
                          rules={[{ required: true }]}
                          initialValue={account?.fullName}
                        >
                          <Input 
                            type="text" required
                            id="fullName" disabled
                            placeholder="Please enter your full name"
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item 
                          label='Email:' 
                          name='email' 
                          rules={[{ type: 'email' }]}
                          initialValue={account?.email}
                        >
                          <Input 
                            type='email' id="email" disabled
                            placeholder="Please enter your email"
                          />
                        </Form.Item>
                      </Col>

                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          name="phone"
                          label="Phone number:"
                          initialValue={account?.phone}
                        >
                          <Input 
                            placeholder="Phone empty"
                            style={{ width: '100%' }} 
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Account status:" name='status' initialValue={account?.status}>
                          <Radio.Group disabled>
                            <Radio value="active">Active</Radio>
                            <Radio value="inactive">Inactive</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <UploadMultipleFile 
                          uploadedImages={account?.avatar ? [account.avatar] : []} 
                          singleImageMode={true} />
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

export default AdminAccountsDetail;