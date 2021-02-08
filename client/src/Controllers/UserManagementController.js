import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Space, Popconfirm, message, Switch } from 'antd';
import { EditFilled, MailOutlined } from '@ant-design/icons';

const USER_TYPES = {
  1: 'Administrator',
  2: 'Standard User',
  3: 'Finance User',
  4: 'HR User',
  5: 'HR & Finance User',
};

const STATUS_FILTER = (t) => [
  {
    text: t('Active'),
    value: true,
  },
  {
    text: t('Inactive'),
    value: false,
  },
];

const columns = (t, store, handleEdit, handleSendEmail) => [
  {
    title: t('Full Name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: t('Email Address'),
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: t('User Type'),
    dataIndex: 'user_type_id',
    key: 'user_type_id',
    render: (cell) => USER_TYPES[cell],
  },
  {
    title: t('Status'),
    dataIndex: 'active',
    key: 'active',
    align: 'center',
    render: (text, record) => (
      <Popconfirm title={t('Are you sure?')} onConfirm={() => store.users.UPDATE(record.id, { active: !text })} okText={t('Yes')} cancelText={t('No')}>
        <Switch checked={text} checkedChildren={t('Active')} unCheckedChildren={t('Inactive')} defaultChecked={text} />
      </Popconfirm>
    ),
    filters: STATUS_FILTER(t),
    onFilter: (value, record) => record.active === value,
  },
  {
    title: t('Action'),
    key: 'action',
    align: 'center',
    render: (text, record) => (
      <>
        <Space size="middle">
          <MailOutlined onClick={() => handleSendEmail(record)} className="davys-grey" />

          <EditFilled style={{ marginLeft: '8px' }} onClick={() => handleEdit(record)} className="davys-grey" />
        </Space>
      </>
    ),
  },
];

export default (store) => {
  const [form] = Form.useForm();
  const { t } = useTranslation('common'); //translation
  const [modalState, setModalState] = useState({ title: t('Add User'), isVisible: false, type: 'add' });
  const [userType, setUserType] = useState(1);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState({});
  const [sendEmailInvitation, setSendEmailInvitation] = useState(false);

  useEffect(() => {
    store.users.FETCH_DATA();
    store.users.FETCH_USER_TYPES();
  }, []);

  useEffect(() => {
    form.setFieldsValue(record);
  }, [record]);

  useEffect(() => {
    if (!modalState.isVisible) {
      form.resetFields();
      setUserType(1);
      setSendEmailInvitation(false);
      setRecord({});
    }
  }, [modalState.isVisible]);

  const modal = {
    title: 'Basic Modal',
    okText: t('Save'),
    cancelText: t('Cancel'),
    confirmLoading: loading,
    onCancel: () => setModalState((prev) => ({ ...prev, isVisible: !prev.isVisible })),
    onOk: async () => {
      setLoading(true);

      try {
        const values = await form.validateFields();
        console.log('🚀 ~ file: EditModal.js ~ line 33 ~ handleOk ~ values', values);
        if (!values.hasOwnProperty('UserBusinessUnit')) values.UserBusinessUnit = [];

        try {
          if (modalState.type === 'add') {
            values.UserBusinessUnit = values.UserBusinessUnit.map((e) => ({
              business_unit_id: e,
            }));
            await store.users.ADD({ ...values, active: true });
            form.resetFields();
            message.success(t('Succesfully Added'));

            setLoading(false);
          } else {
            values.UserBusinessUnit = values.UserBusinessUnit.map((e) => ({
              business_unit_id: e,
              user_id: record.id,
            }));
            await record.UPDATE(record.id, { ...values, isEmailChanged: values.email.trim() !== record.email.trim() });
            message.success(t('Succesfully Updated'));
          }

          setModalState((prev) => ({ ...prev, isVisible: !prev.isVisible }));
        } catch (err) {
          console.log(err);
          if (err.response.status === 409) message.error(t('Email already exists!'));
          if (err.response.status === 500) message.error(t('An internal error has occurred, our developers have already been notified.'));
          else throw err;
        }
      } catch (errorInfo) {
        console.log('Validate Failed:', errorInfo);
      }

      setLoading(false);
    },
    generatePassword: () => {
      var randPassword = Array(10)
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$&!*@+%_~?;')
        .map(function (x) {
          return x[Math.floor(Math.random() * x.length)];
        })
        .join('');
      form.setFieldsValue({ password: randPassword });
    },
    ...modalState,
  };

  const handleAdd = () => {
    setModalState((prev) => ({ title: t('Add User'), isVisible: !prev.isVisible, type: 'add' }));
  };

  const handleEdit = (values) => {
    setUserType(values.user_type_id);
    setModalState((prev) => ({ title: t('Edit User'), isVisible: !prev.isVisible, type: 'edit' }));
  };

  const handleSendEmail = async (values) => {
    try {
      await store.users.SEND_EMAIL(values);

      message.success({ content: t('Account credentials sent!'), key: 'updatable', duration: 2 });
    } catch (err) {
      message.error(t('Internal Server Error'));
    }
  };

  return {
    columns: columns(t, store, handleEdit, handleSendEmail),
    handleAdd,
    form,
    modal,
    userType,
    setUserType,
    sendEmailInvitation,
    setSendEmailInvitation,
  };
};
