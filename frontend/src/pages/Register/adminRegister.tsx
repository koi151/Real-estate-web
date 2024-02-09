import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Col, Row, Input, Button, message } from "antd";
import './adminRegister.scss'
import adminAuthorizationService from "../../services/admin/authorization.service";

interface AdminRegisterProps {
  isRegisterPage: boolean;
}

const AdminRegister: React.FC<AdminRegisterProps> = ({ isRegisterPage }) => {

  const navigate = useNavigate();

  const onFinishForm = async (data: any) => {
    console.log("data:", data)

    try {
      const response = await adminAuthorizationService.submitLogin(data);

        switch (response) {
          case "wrong info":
            message.error('Account is not exists, please try again', 3);
            break;
          case "blocked":
            message.error('Account has been blocked!', 3);
            break;
          case "success":
            message.success('Login successful. Welcome to admin page !');
            navigate('/admin/products');
            break;
          default:
            break;
        }

    } catch (err) {
      console.log('Error occurred:', err);
      message.error(`Error occurred, can not ${isRegisterPage ? "register" : "login"}`)
    }
  }

  return (
    <>
      <div className="darken-layer"></div>
      <Row className="box-wrapper">
        <div className="box-sep">
          <Col span={12} className="box-sep__left">
          </Col>
          <Col span={12} className="box-sep__right">
            <strong className="box-sep__right--title">
              {isRegisterPage ? 'REGISTER' : 'LOGIN'}
            </strong>
            <span className="box-sep__right--welcome-text">
              Welcome to Admin Page
            </span>

            <Form
              layout="vertical" 
              className='login-form'
              method="POST"
              onFinish={onFinishForm}
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    label='Email:'
                    name='email'
                    rules={[{ required: true, message: 'Please input the email!' }]}
                  >
                    <Input 
                      required type="email" 
                      id="email" 
                      placeholder="Please enter your email"
                    />
                  </Form.Item> 
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="password"
                    label='Password:'
                    required
                    rules={[
                      { message: 'Please input your password!' },
                      {
                        min: 6, 
                        message: 'Password must be at least 6 characters long!',
                      },
                      {
                        max: 20,
                        message: 'Password must be at most 20 characters long!',
                      },
                    ]}
                  >
                    <Input.Password placeholder="Please enter your password"/>
                  </Form.Item> 
                </Col>
                <Col span={24}>
                  <Form.Item className="text-center">
                    <Button className='custom-btn-main' type="primary" htmlType="submit">
                      {isRegisterPage ? 'Sign in' : 'Login'}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div className="d-flex justify-content-center align-items-center">
              <span className="line"></span>
              <span style={{color: "#aaa", fontSize: "1.2rem", margin: "3rem 1rem"}}>or</span>
              <span className="line"></span>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div style={{fontSize: "1.4rem"}}>
                {isRegisterPage ? 'Already have an account ? ' : 'New to admin page ? '}
              </div>
              <Link 
                to={isRegisterPage ? `/admin/auth/login` : `/admin/auth/register`} 
                className="redirect-page"
              >
                {isRegisterPage ? 'Login now' : 'Create now'}
              </Link>
            </div>

          </Col>
        </div>
      </Row>
    </>
  )
}

export default AdminRegister;
