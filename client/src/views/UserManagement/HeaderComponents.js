import React, { Component } from 'react';
import { Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default (handleAdd) => {
  const { t } = useTranslation('common');

  return (
    <Space>
      <Button className="add-button" style={{ marginLeft: '20px', backgroundColor: '#9e0b0f', color: 'white' }} onClick={handleAdd}>
        + {t('Add')}
      </Button>
    </Space>
  );
};
