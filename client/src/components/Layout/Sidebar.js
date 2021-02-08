import React, { useState, useEffect } from 'react';
import './style.css';
import AuthenticatedUsers from '../../enums/PrivateRouteUsers';
import { Menu } from 'antd';
import { ApartmentOutlined, DashboardOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { SubMenu } = Menu;

function AdminMenu(props) {
  const { t } = useTranslation('common');

  const menuRoutes = {
    User: '/UserManagement',
  };
  let history = useHistory();
  const [SelectedMenuKey, setSelectedMenuKey] = useState('');

  const rootSubmenuKeys = ['Administrator'];
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    switch (history.location.pathname) {
      case '/':
      case '/UserManagement':
        setSelectedMenuKey('User');
        setOpenKeys(['Administrator']);
        break;
    }
  }, []);

  const handleMenuClick = (e) => {
    setSelectedMenuKey(e.key);
    history.push(menuRoutes[e.key]);
    //current: e.key,
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const menus = [
    {
      key: 'Administrator',
      user_types: AuthenticatedUsers['Administrator'],
      component: (
        <SubMenu key="Administrator" icon={<UserOutlined />} title={t('Administrator')}>
          <Menu.Item key="LocalUnits">{t('Local Units')}</Menu.Item>
          <Menu.Item key="Income">{t('Income / Expenses')}</Menu.Item>
          <Menu.Item key="AccountCategories">{t('Account Categories')}</Menu.Item>
          <Menu.Item key="Payment">{t('Payment Account')}</Menu.Item>
          <Menu.Item key="Sales">{t('Sales Account')}</Menu.Item>
          <Menu.Item key="User">{t('User Administration')}</Menu.Item>
        </SubMenu>
      ),
    },
  ];

  return (
    <Menu openKeys={openKeys} onOpenChange={onOpenChange} selectedKeys={[SelectedMenuKey]} mode="inline" onClick={handleMenuClick}>
      {menus.filter((e) => e.user_types.includes(props.user.user_type_id)).map((e) => e.component)}
    </Menu>
  );
}

export default AdminMenu;
