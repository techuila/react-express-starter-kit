import React, { Component } from 'react';
import { Drawer } from 'antd';

export default (props) => (
  <Drawer
    destroyOnClose
    title={props.header}
    placement={props.drawer.placement || 'right'}
    closable={props.drawer.closable || true}
    onClose={props.drawer.onClose}
    visible={props.drawer.visible}
    getContainer={props.drawer.getContainer || false}
    style={props.drawer.style || { position: 'absolute' }}
    width={`90%`}
  >
    {props.drawerContent}
  </Drawer>
);
