import React, { useState, useEffect } from 'react';

//React
import { useHistory } from 'react-router-dom';

//Ant D
import { Menu, Row, Col, Dropdown, Modal, Typography, Form, Input, Button, message } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

//translation
import { useTranslation } from 'react-i18next';

import de_DE from 'antd/es/locale/de_DE';
import enUS from 'antd/es/locale/en_US';
import fr_FR from 'antd/es/locale/fr_FR';
import it_IT from 'antd/es/locale/it_IT';

import 'moment/locale/de';
//Flag
import engFlag from '../../brand/flag/eng-flag.png';
import germanFlag from '../../brand/flag/ger-flag.png';

const { SubMenu } = Menu;
const { Title } = Typography;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function UserInfo(props) {
  const history = useHistory();
  const { user, company } = props;
  const { setLanguage, setLocale, language } = props.store;
  const { t, i18n } = useTranslation('common');

  const logout = () => {
    user.logout();
  };

  const [showUserAccountForm, setShowUserAccountForm] = useState(false);
  const [flag, setFlag] = useState(germanFlag);

  const [form] = Form.useForm();

  useEffect(() => {
    if (language === 'en') {
      setFlag(engFlag);
      // setLocale(enUS);
    }
    if (language === 'de') {
      setFlag(germanFlag);
      //   setLocale(de_DE);
    }
    return () => {};
  }, [language]);

  useEffect(() => {
    form.setFieldsValue({
      email: user.email,
      firstName: user.firstName,

      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      mobileNumber: user.mobileNumber,
      position: user.position,
    });
    return () => {
      form.resetFields();
    };
  }, [user]);

  const onFinish = (values) => {
    console.log('Success:', values); //{email: "valerie", password: "12345678$", remember: true}
    const hide = message.loading(t('Saving changes. . .'), 0);
    user
      .updateProfile(values.email, values.password, values.email.trim() !== user.email.trim())
      .then((success) => {
        if (success) {
          hide();
          setShowUserAccountForm(false);
          message.success(t('Account credentials successfully saved!'));
        }
      })
      .catch((err) => {
        hide();
        if (err.response.status === 409) message.error(t('Email already exists!'));
        if (err.response.status === 500) message.error(t('An internal error has occurred, our developers have already been notified.'));
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const changeLanguage = (locale) => {
    setLanguage(locale);
    i18n.changeLanguage(locale);
  };

  const usermenu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowUserAccountForm(true);
          }}
        >
          {t('Account Setting')}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            history.push('/Dropdownsetting');
          }}
        >
          {t('Dropdown Settings')}
        </a>
      </Menu.Item>
      <SubMenu title={t('Change Language')}>
        <Menu.Item
          onClick={() => {
            changeLanguage('en');
          }}
        >
          English
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            changeLanguage('de');
          }}
        >
          German
        </Menu.Item>
      </SubMenu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          {t('Logout')}
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row className="user-info" align="middle">
        {/* <Col flex="40px">
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
        />
      </Col> */}
        <Col flex="auto">
          <Dropdown overlay={usermenu} placement="topRight" arrow>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              {/*  <Space> */}
              <Row>
                <Col flex="auto">
                  <strong style={{ color: '#e76b82' }}>{user.firstName + ' ' + user.lastName}</strong>
                </Col>
                <Col flex="16px">
                  <DownOutlined style={{ color: '#a9a4a4' }} />
                </Col>
              </Row>
              {/*  </Space> */}
            </a>
          </Dropdown>

          <small style={{ color: '#a9a4a4' }}>{user.type}</small>
          <span style={{ float: 'right' }}>
            <img src={flag} height="11" width="16" alt="logo" />
          </span>
        </Col>
      </Row>

      <Modal
        forceRender={true}
        title={false}
        centered
        visible={showUserAccountForm}
        onOk={() => setShowUserAccountForm(false)}
        onCancel={() => setShowUserAccountForm(false)}
        okText={t('user_info.save_changes')}
        closable={false}
        footer={false}
        className={'ant-custom'}
      >
        <Form form={form} layout="vertical" name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Title level={2} style={{ textAlign: 'center' }}>
            {t('Account Settings')}
          </Title>

          <Form.Item
            label={t('Name')}
            name="first_name"
            style={{
              display: 'inline-block',
              width: 'calc(50% - 8px)',
            }}
          >
            <span style={{ color: '#a9a4a4' }}>{user.firstName + ' ' + user.lastName}</span>
          </Form.Item>
          <Form.Item
            label={t('User Type')}
            name="type"
            style={{
              display: 'inline-block',
              width: 'calc(50% - 8px)',
              margin: '0 8px',
            }}
          >
            <span style={{ color: '#a9a4a4' }}>{user.type}</span>
          </Form.Item>
          <Form.Item
            label={t('Email Address')}
            name="email"
            rules={[
              {
                required: true,
                message: t('Please input a valid email address'),
              },
            ]}
            initialValue={user.email}
          >
            <Input autoComplete="chrome-off" />
          </Form.Item>

          <Form.Item label={t('Password')} name="password">
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="button"
              onClick={(e) => {
                e.preventDefault();
                setShowUserAccountForm(false);
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
              {t('Save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default observer(UserInfo);
