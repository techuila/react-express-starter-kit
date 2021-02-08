import React, { Component } from 'react';
import { Modal } from 'antd';

export default (props) => (
  <Modal
    width={props.modal.width || '520px'}
    title={props.modal.title}
    visible={props.modal.isVisible}
    okText={props.modal.okText}
    cancelText={props.modal.cancelText}
    onCancel={props.modal.onCancel}
    onOk={props.modal.onOk}
    confirmLoading={props.modal.confirmLoading}
  >
    {props.modalContent}
  </Modal>
);
