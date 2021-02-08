import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import './style.css';

import AdminMenu from '../ProtectedRoute/AdminMenu';
import ClientMenu from '../ProtectedRoute/ClientMenu';

import Logo from '../../brand/logo/SSREI_LOGO_128.png';

import UserInfo from '../ProtectedRoute/UserInfo';

import { Layout, Divider, Row, Col, Button } from 'antd';

const { Content, Footer, Sider } = Layout;

function ProtectedRoute(props) {
  const { store } = props;
  const Component = props.component;
  const user = props.store.login;
  const company = props.store.company;
  const [IsReady, setIsReady] = useState(false);
  const [IsFormVisible, setIsFormVisible] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      setIsReady(true);
      setTimeout(() => {
        setIsFormVisible(true);
        setCollapsed(false);
      }, 400);
    }, 500);
  }, []);

  const [Collapsed, setCollapsed] = useState(true);

  const onCollapse = () => {
    console.log(!Collapsed);
    setCollapsed(!Collapsed);
  };

  const downloadCsv = () => {
    store.getClientsCSV();
  };
  return user.isLoggedIn ? <Redirect to={{ pathname: '/login' }} /> : <Component {...props} />;
}

export default inject('store')(observer(ProtectedRoute));
