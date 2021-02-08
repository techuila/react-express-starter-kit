import React, { useState } from 'react';
import { Row, Col, Affix, Typography } from 'antd';

const { Title } = Typography;

function PageContainer(props) {
  const [isAffixed, setIsAffixed] = useState(false);
  return (
    <>
      <Affix
        style={{ position: 'absolute' }}
        offsetTop={0}
        onChange={(affixed) => setIsAffixed(affixed) }
      ></Affix>
      <Affix offsetTop={0}>
        <Row
          className={'page-title'}
          gutter={[32, 24]}
          style={{
            backgroundColor: isAffixed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.0)',
            boxShadow: isAffixed ? '10px 1px 15px rgba(128,128,128,0.5)' : 'none',
          }}
        >
          <Col flex="auto">
            <Title className="f-white">{props.title.toUpperCase()}</Title>
          </Col>
        </Row>
      </Affix>
      {props.children}
    </>
  );
}

export default PageContainer;
