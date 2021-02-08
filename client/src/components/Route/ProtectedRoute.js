import React, { useState, useLayoutEffect, useEffect } from 'react';

import './style.css';

import { Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Sidebar from '../Layout/Sidebar';

import UserInfo from '../Layout/UserInfo';

import ComponentNotFound from '../error/ComponentNotFound';

import { Layout, Divider, Row, Col, Button, Affix, message } from 'antd';
//translation
import { useTranslation } from 'react-i18next';

const { Content, Footer, Sider } = Layout;

function ProtectedRoute(props) {
  const { t } = useTranslation('common'); //translation

  const { store, adminOnly } = props;

  const Component = props.component;
  const user = props.store.login;
  const company = props.store.company;
  const [IsReady, setIsReady] = useState(false);
  const [IsFormVisible, setIsFormVisible] = useState(false);
  const [IsDownloadModalVisible, setIsDownloadModalVisible] = useState(false);

  const [downloadingCSV, setDownloadingState] = useState(false);

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
    setCollapsed(!Collapsed);
  };

  const DownloadModalProps = {
    visible: IsDownloadModalVisible,
    setVisible: setIsDownloadModalVisible,
  };

  const showDownloadModal = () => {
    setIsDownloadModalVisible(true);
  };
  const downloadCSV = async () => {
    showDownloadModal();
  };

  const layout = (props) => (
    <>
      <div className={!IsReady ? 'bg' : 'bg cssblur'}> </div>
      <Layout style={{ minHeight: '100vh', background: 'transparent' }} className={!IsFormVisible ? 'main-layout' : 'main-layout visible'}>
        <Sider
          /*collapsible*/
          collapsed={Collapsed}
          onCollapse={onCollapse}
          collapsedWidth={0}
          style={{ background: '#FFFFFFee' }}
        >
          <Affix offsetTop={0}>
            <div className="logo" />

            <Sidebar user={user} />

            <div className="sidebar-bottom-fix">
              <Divider></Divider>

              <UserInfo user={user} company={company} store={store}></UserInfo>
            </div>
          </Affix>
        </Sider>
        <Layout className={!IsReady ? 'site-layout' : 'site-layout whitey'}>
          <Content style={{ margin: '0 16px', background: 'transparent' }}>
            <Row className="site-layout-background" style={{ height: '100%' }}>
              <Col flex={'auto'}>
                <Component {...props} />
              </Col>
            </Row>
          </Content>

          <Footer
            style={{
              textAlign: 'center',
              color: '#ffffff',
              background: '#4d3d32',
              padding: '5px 50px',
            }}
          >
            <small>
              {' '}
              {t('NAME_OF_APP © ')} {new Date().getFullYear()} {t(' by NAME_OF_COMPANY')}
            </small>
          </Footer>
        </Layout>
      </Layout>
    </>
  );

  function authRoute(authenticatedUserTypes, props) {
    if (user.user_type_id !== 0) {
      if (authenticatedUserTypes.includes(user.user_type_id)) {
        return layout(props);
      } else {
        return <ComponentNotFound />;
      }
    }
  }

  return user.isLoggedIn ? authRoute(props.authenticatedUserTypes, props) : <Redirect to={{ pathname: '/login' }} />;
}

export default inject('store')(observer(ProtectedRoute));
