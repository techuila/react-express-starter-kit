import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import { Row, Col, Card, Space, Input, Table, Form, Select, InputNumber } from 'antd';
import searchFn from '../../utils/search';
import ResizableTitle from './ResizableTitle';
import './style.css';

const { Option } = Select;

const EditableRow = ({ index, ...props }) => {
  return <tr {...props} />;
};

// Props are declared on onCell from columns state
const EditableCell = ({ title, editable, children, dataIndex, record, render, stateOnly, handleSave, isNumber, select, inputProps, ...restProps }) => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  useEffect(() => {
    if (dataIndex) {
      const isSetValue = !select ? true : select.options().find((e) => e.value === record[dataIndex]) ? true : false;
      if (isSetValue) {
        form.setFieldsValue({
          [dataIndex]: render || record[dataIndex],
        });
      }
    }
  }, [record, select]);

  const save = async () => {
    try {
      const values = await form.validateFields();

      handleSave(values, record, stateOnly);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = (
      <Form form={form} component={false}>
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          {!select ? (
            isNumber ? (
              <InputNumber {...inputProps} min={0} onBlur={save} />
            ) : (
              <Input ref={inputRef} onBlur={save} />
            )
          ) : (
            <Select
              {...select.props}
              showSearch
              optionFilterProp="children"
              onChange={save}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {select.options().length !== 0 &&
                select.options().map((e) => (
                  <Option key={`${e.name}-${e.value}`} value={e.value}>
                    {e.name}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const { Search } = Input;

// Required props:
// props.modalContent[props.modalType]

function CardPage(props) {
  const { t } = useTranslation('common'); //translation
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [HasData, setHasData] = useState(false);
  const [columns, setColumns] = useState(props.columns);

  const search = (keyword) => {
    setSearchKeyword(keyword);
  };

  useEffect(() => {
    setColumns(props.columns);

    return () => {
      setColumns([]);
    };
  }, [props.store.language, props.columns]);

  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...columns];
    if (index === 0) {
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
    }
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };

    setColumns(nextColumns);
  };

  const default_components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const resizableColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      // onResize: handleResize(index),
    }),
  }));

  const expandable = () => {
    if (!!props.expandable) {
      return { expandable: props.expandable((...args) => searchFn(...args)(searchKeyword)) };
    } else {
      return {};
    }
  };

  return (
    <>
      {props.modal}
      <Row style={{ height: `100% !important` }} gutter={[32, 24]}>
        <Col flex="auto">
          <Card className={'ant-custom-table'} style={{ padding: '15px', minHeight: '500px' }}>
            <div className="card-background-header"></div>
            <Row gutter={[32, 24]}>
              <Col style={{ textAlign: 'left', width: '100%', display: 'flex' }}>
                {props.searchProperties && (
                  <div>
                    <Space>
                      <Search placeholder={t('Search')} onSearch={(value) => search(value)} />
                    </Space>
                  </div>
                )}

                {props.headerComponents}
              </Col>
            </Row>
            <Table
              style={{ marginTop: '50px' }}
              className={`table-resizeable ${props.isStripped ? 'table-striped-rows' : ''}`}
              dataSource={!!props.dataSource.toJSON ? props.dataSource.toJSON().filter((e) => searchFn(props.searchProperties, e)(searchKeyword)) : !!props.dataSource ? props.dataSource.filter((e) => searchFn(props.searchProperties, e)(searchKeyword)) : []}
              components={props.components || default_components}
              columns={resizableColumns}
              pagination={{ pageSize: 10 }}
              size="small"
              bordered
              loading={isLoading}
              rowKey={(record) => record.id}
              scroll={{ x: 'max-content' }}
              {...expandable()}
              {...props.tableProps}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default inject('store')(observer(CardPage));
