import React from 'react'
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'; // Import MinusCircleOutlined
import { DatePicker } from 'antd';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import calculate from '@/utils/calculate';
import { useSelector } from 'react-redux';
import SelectAsync from '@/components/SelectAsync';

export default function InvoiceItemRow({ field, remove, form, itemsData }) {
    const handleItemChange = (value) => {
      const selectedItem = itemsData.find((item) => item.itemName === value);
      form.setFieldsValue({
        items: {
          [field.name]: {
            description: selectedItem.description,
            price: selectedItem.price,
            quantity: form.getFieldValue(['items', field.name, 'quantity']) || 1,
          },
        },
      });
    };
  
    const handleQuantityChange = (value) => {
      const price = form.getFieldValue(['items', field.name, 'price']) || 0;
      form.setFieldsValue({
        items: {
          [field.name]: {
            total: value * price,
          },
        },
      });
    };
  
    return (
      <Row gutter={[12, 12]}>
        <Col className="gutter-row" span={4}>
          <Form.Item
            {...field}
            name={[field.name, 'itemName']}
            fieldKey={[field.fieldKey, 'itemName']}
            rules={[{ required: true, message: 'Seleccione un artículo' }]}
          >
            <Select
              showSearch
              placeholder="Select an item"
              onChange={handleItemChange}
              options={itemsData.map((item) => ({
                value: item.itemName,
                label: item.itemName,
              }))}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            {...field}
            name={[field.name, 'description']}
            fieldKey={[field.fieldKey, 'description']}
            rules={[{ required: true, message: 'Ingrese la descripción' }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            {...field}
            name={[field.name, 'quantity']}
            fieldKey={[field.fieldKey, 'quantity']}
            rules={[{ required: true, message: 'Ingrese la cantidad' }]}
          >
            <InputNumber min={1} onChange={handleQuantityChange} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item
            {...field}
            name={[field.name, 'price']}
            fieldKey={[field.fieldKey, 'price']}
            rules={[{ required: true, message: 'Ingrese el precio' }]}
          >
            <InputNumber min={0} readOnly />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item
            {...field}
            name={[field.name, 'total']}
            fieldKey={[field.fieldKey, 'total']}
            rules={[{ required: true, message: 'Ingrese el total' }]}
          >
            <InputNumber min={0} readOnly />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(field.name)} />
        </Col>
      </Row>
    );
  }
  