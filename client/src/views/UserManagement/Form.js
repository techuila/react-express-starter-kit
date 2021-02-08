import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThunderboltOutlined } from '@ant-design/icons';
import { Form, Input, Checkbox, Radio, Select } from 'antd';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '25px',
  lineHeight: '25px',
};

export default (form, modal, userTypes, sendEmailInvitation, setSendEmailInvitation) => {
  const { t } = useTranslation('common');

  return (
    <Form form={form} layout="vertical" preserve={false}>
      <Form.Item
        label={t('First Name')}
        name="first_name"
        rules={[
          {
            required: true,
            message: t('Please enter first name'),
          },
        ]}
      >
        <Input placeholder={t('First Name')} />
      </Form.Item>

      <Form.Item
        label={t('Last Name')}
        name="last_name"
        rules={[
          {
            required: true,
            message: t('Please enter last name'),
          },
        ]}
      >
        <Input placeholder={t('Last Name')} />
      </Form.Item>

      <Form.Item
        label={t('Email Address')}
        name="email"
        rules={[
          {
            type: 'email',
            required: true,
            message: t('Please enter email address'),
          },
        ]}
      >
        <Input placeholder={t('Email Address')} />
      </Form.Item>

      <Form.Item
        label={t('Password')}
        name="password"
        rules={[
          {
            required: modal.type === 'add' ? true : sendEmailInvitation ? true : false,
            message: t('Please enter password'),
          },
        ]}
      >
        <Input.Password
          placeholder={t('Password')}
          addonAfter={<ThunderboltOutlined title={t('Generate Random Password')} onClick={modal.generatePassword} />}
        />
      </Form.Item>

      <Form.Item label={t('User Type')} name="user_type_id" initialValue={1}>
        <Radio.Group onChange={(e) => userTypes.setValue(e.target.value)}>
          {userTypes.data.toJSON().map((e) => (
            <Radio key={e.id + '-' + e.name} style={radioStyle} value={e.id}>
              {e.name}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      {/* {modal.type === 'add' && ( */}
      <Form.Item name="sendInviteEmail" valuePropName="checked">
        <Checkbox onChange={(e) => setSendEmailInvitation(e.target.checked)}>{t('Send Invitation Email')}</Checkbox>
      </Form.Item>
      {/* )} */}

      <div style={{ textAlign: 'center' }}>{modal.message}</div>
    </Form>
  );
};
