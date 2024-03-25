import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Col, Row, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";

import clientAuthorizationService from "../../../services/client/authorization.service";
import { setClientUser } from "../../../redux/reduxSlices/clientUserSlice";
import './registerLogin.scss'

interface RegisterLoginProps {
  isRegisterPage: boolean;
}

const RegisterLogin: React.FC<RegisterLoginProps> = ({ isRegisterPage = false }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinishForm = async (data: any) => {
    try {

      if (!isRegisterPage) { // login
        const response = await clientAuthorizationService.submitLogin(data);
        switch (response.code) {
          
          case 200:
            if (response.user) {
              dispatch(setClientUser(response.user))
            }

            message.success(`Login successful. Welcome ${response.user.fullName}!`);
            navigate('/properties');
            break;

          case 401:
          case 403:
            message.error(`${response.message}, please try again`, 3);
            break;

          default:
            break;
        }
      } else { // register
        const response = await clientAuthorizationService.submitRegister(data);
        switch (response.code) {
          
          case 200:
            if (response.user) {
              dispatch(setClientUser(response.user))
            }

            message.success(`Register successful. Welcome ${response.user.fullName}!`);
            navigate('/properties');
            break;

          case 401:
          case 403:
            message.error(`${response.message}, please try again`, 3);
            break;

          default:
            break;
        }
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
        <div className='box-sep'>
          <Col span={`${isRegisterPage ? 10 : 12}`} className='box-sep__left'>
          </Col>
          <Col span={`${isRegisterPage ? 24 : 12}`} className='box-sep__right'>
            <strong className="box-sep__right--title">
              {isRegisterPage ? 'REGISTER' : 'LOGIN'}
            </strong>
            <span className="box-sep__right--welcome-text">
              Welcome to SPRUHA
            </span>

            <Form
              layout="vertical" 
              className='login-form'
              method="POST"
              onFinish={onFinishForm}
            >
              <Row>
                {isRegisterPage ? (
                  <>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        label='User name:'
                        name='userName'
                        rules={[{ required: true, message: 'Please input your user name!' }]}
                      >
                        <Input 
                          required 
                          placeholder="Please enter your user name"
                        />
                      </Form.Item> 
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
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
                    <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
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
                    <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        name="confirm"
                        label="Confirm password:"
                        dependencies={['password']}
                        rules={[
                          { message: 'Please confirm your password!'},
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password placeholder="Confirm your password"/>
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <>
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
                  </>
                )}

                <Col span={24}>
                  <Form.Item className="text-center">
                    <Button className={`custom-btn-main`} type="primary" htmlType="submit">
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
                to={isRegisterPage ? `/auth/login` : `/auth/register`} 
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

export default RegisterLogin;
