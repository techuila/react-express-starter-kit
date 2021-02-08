import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import ClientJS from 'clientjs';

import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { Menu, Dropdown, Row, Col, Card, Typography, Form, Input, Button, Checkbox, Modal } from 'antd';

import { UserOutlined } from '@ant-design/icons';

//translation
import { useTranslation } from 'react-i18next';
//Flag
import engFlag from '../../brand/flag/eng-flag.png';
import germanFlag from '../../brand/flag/ger-flag.png';

import { onLoginFinishAPI } from '../../api/Login/Login';

//const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

/* const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}; */

function Login(props) {
  const { t, i18n } = useTranslation('common');
  const { setLanguage, language } = props.store;

  const [IsReady, setIsReady] = useState(false);
  const [IsFormVisible, setIsFormVisible] = useState(false);

  const [Message, setMessage] = useState('');
  const [DeviceFingerPrint, setDeviceFingerPrint] = useState('');
  const [isOTPVisible, setIsOTPVisible] = useState(false);
  const [flag, setFlag] = useState(germanFlag);

  const [form] = Form.useForm();
  //const [otpform] = Form.useForm();

  //for flags
  useEffect(() => {
    if (language === 'en') {
      setFlag(engFlag);
    }
    if (language === 'de') {
      setFlag(germanFlag);
    }

    return () => {};
  }, [language]);

  useEffect(() => {
    const client = new ClientJS();
    const windowClient = new window.ClientJS();

    //const fingerPrint = windowClient.getFingerprint()

    var ua = windowClient.getBrowserData().ua;
    var canvasPrint = windowClient.getCanvasPrint();
    setIsOTPVisible(false);
    var fingerprint = windowClient.getCustomFingerprint(ua, canvasPrint).toString();
    setDeviceFingerPrint(fingerprint);

    setTimeout(() => {
      setIsReady(true);
      setTimeout(() => {
        setIsFormVisible(true);
        setMessage(t('Enter your email address and password to login.'));
      }, 400);
    }, 500);

    return () => {
      setMessage('');
      setIsOTPVisible(false);
    };
  }, []);

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: '/' } };

  const user = props.store.login;
  const [email, setEmail] = useState(user.email);
  const [password, setpassword] = useState('');
  const [remember, setremember] = useState(false);

  const [IsLoginMode, setIsLoginMode] = useState(true);

  const showLoginForm = () => {
    setMessage(t('Enter your email address and password to login.'));
    setIsLoginMode(true);
  };
  const showResetForm = () => {
    setIsLoginMode(false);
    setMessage(t("Enter your email address and we'll send you a temporary password. Change your password immediately after logging-in."));
  };

  const logout = () => {
    user.logout('test', 'pwd').then(() => {
      history.push('/');
    });
  };

  const resetpassword = () => {
    history.push('/resetpassword');
  };

  const onLoginFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onOTPFinish = (values) => {
    //console.log("Success:", values); //{email: "valerie", password: "12345678$", remember: true}
    setMessage(t('Logging in...'));
    user.loginOTP(email, password, remember ? 1 : 0, DeviceFingerPrint, values.pin).then((result) => {
      if (result.success === true) {
        setMessage(t('Thanks! Your new device is now registered.'));
        setEmail('');
        setpassword('');
        setremember(0);
        setTimeout(() => {
          history.push('/');
        }, 1000);
      } else {
        setMessage(t('Invalid PIN.'));
      }
    });
  };

  const onOTPFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onResetFinish = (values) => {
    console.log('Success:', values); //{email: "valerie", password: "12345678$", remember: true}
    setMessage(t('Please wait...'));

    user.resetPassword(values.email).then((success) => {
      if (success) {
        setMessage(t('An email message containing your temporary password has been sent to you. Please chaeck your mailbox.'));
        //history.push("/");
        showLoginForm();
      } else {
        setMessage(t('Could not send to the email address you provided.'));
      }
    });
  };

  const onResetFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const changeLanguage = (locale) => {
    setLanguage(locale);
    i18n.changeLanguage(locale);
  };

  const onLoginFinish = (values) => {
    onLoginFinishAPI(values, t, setMessage, setEmail, setpassword, setremember, setIsOTPVisible, user, DeviceFingerPrint, history);
  };
  const usermenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          changeLanguage('en');
        }}
      >
        <img src={engFlag} style={{ marginRight: '5px' }} height="11" width="16" alt="logo" />
        English
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          changeLanguage('de');
        }}
      >
        <img src={germanFlag} style={{ marginRight: '5px' }} height="11" width="16" alt="logo" /> German
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      {<div className={IsReady ? 'bg ' : 'bg cssblur'}> </div>}
      {IsFormVisible && (
        <Row type="flex" align="middle" style={{ height: '100vh' }}>
          <Col span={12} align={'middle'}>
            <img src={'/images/logo/2b_family_400.png'}></img>
          </Col>
          <Col span={12}>
            {IsLoginMode && (
              <Card style={{ width: 450 }} className="see-thru ant-custom ant-card-dialog">
                <div style={{ position: 'absolute', right: 5, marginTop: `-14%` }}>
                  <Dropdown overlay={usermenu} placement="topRight" arrow>
                    <img src={flag} height="11" width="16" alt="logo" />
                  </Dropdown>
                </div>
                <Row type="flex" align="middle">
                  <Title
                    style={{
                      display: 'block !important',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {t('Login')}
                  </Title>
                </Row>
                <Form
                  form={form}
                  layout="vertical"
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={onLoginFinish}
                  onFinishFailed={onLoginFinishFailed}
                >
                  <Form.Item
                    label={t('Email Address')}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: t('Please input your email address!'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={t('Password')}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: t('Please input your password!'),
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>{t('Remember Me')}</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <a
                      className="login-form-forgot"
                      href="#"
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                      }}
                      onClick={() => showResetForm()}
                    >
                      {t('Forgot password')}
                    </a>
                    <Button
                      htmlType="submit"
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                        margin: '0 8px',
                        backgroundColor: '#942128',
                        color: '#fff',
                      }}
                    >
                      {t('Submit')}
                    </Button>
                  </Form.Item>
                  <div
                    style={{
                      display: 'block !important',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {Message}{' '}
                  </div>
                </Form>
              </Card>
            )}
            {!IsLoginMode && (
              <Card style={{ width: 450 }} className="see-thru ant-custom ant-card-dialog">
                <Row type="flex" align="middle">
                  <Title
                    style={{
                      display: 'block !important',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {t('RESET PASSWORD')}
                  </Title>
                </Row>
                <Form
                  form={form}
                  layout="vertical"
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={onResetFinish}
                  onFinishFailed={onResetFinishFailed}
                >
                  <Form.Item
                    label={t('Email Address')}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: t('Please input your email address!'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <a
                      className="login-form-forgot"
                      href="#"
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                      }}
                      onClick={() => showLoginForm()}
                    >
                      {t('Login')}
                    </a>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                        margin: '0 8px',
                      }}
                    >
                      {t('Submit')}
                    </Button>
                  </Form.Item>
                  <small
                    style={{
                      display: 'block !important',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {Message}
                  </small>
                </Form>
              </Card>
            )}
          </Col>
        </Row>
      )}
      <Modal title={false} centered visible={isOTPVisible} okText={t('Submit')} closable={false} footer={false} className={'ant-custom'}>
        <Form form={form} layout="vertical" name="basic" initialValues={{ remember: true }} onFinish={onOTPFinish} onFinishFailed={onOTPFinishFailed}>
          <Title level={2} style={{ textAlign: 'center' }}>
            {t('Enter One Time Pin')}
          </Title>

          <Form.Item name="pin">
            <Input size="large" placeholder={t('PIN Code')} prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="button"
              onClick={(e) => {
                e.preventDefault();
                setIsOTPVisible(false);
              }}
              style={{ display: 'inline-block', width: 'calc(50% - 16px)' }}
            >
              {t('Cancel')}
            </Button>{' '}
            <Button
              type="primary"
              htmlType="submit"
              style={{
                display: 'inline-block',
                width: 'calc(50% - 8px)',
                margin: '0 0px 0 8px',
              }}
            >
              {t('Submit')}
            </Button>
          </Form.Item>
          <div
            style={{
              display: 'block !important',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {Message}
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default observer(Login);
