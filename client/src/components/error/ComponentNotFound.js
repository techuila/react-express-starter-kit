import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';

/* Import Context Provider and Reducer */
import BackgroundPhoto from './404.svg';

const ComponentNotFound = withRouter(({ location }) => {
  const { t } = useTranslation('common'); //translation

  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'white' }}>
      <Row style={{ marginTop: '8%', display: 'flex', justifyContent: 'center' }}>
        <Col md={{ size: 6, offset: 0 }} sm={{ size: 14, offset: 5 }}>
          <img alt="example" src={BackgroundPhoto} style={{ float: 'right' }} />
        </Col>
        <Col md={{ size: 6, offset: 0 }} sm={{ size: 22, offset: 1 }} style={{ textAlign: 'left', marginTop: '50px' }}>
          <h1>{t('Oops!')}</h1>
          <h4 level={4}>404 - {t('PAGE NOT FOUND')}</h4>
          <p>{t('The page you are looking for might have been remove, had its name changed or is temporarily unavailable.')}</p>
          <Link to="/">
            <Button type="primary">{t('GO TO HOMEPAGE')}</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
});

export default ComponentNotFound;
