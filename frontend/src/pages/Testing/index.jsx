import React, { useState } from 'react';
import { Form, Select, Input } from 'antd';

const { Option } = Select;

// Mock data for items
const items = [
  { id: 1, name: 'Item 1', description: 'This is the description for Item 1', price: 9.99 },
  { id: 2, name: 'Item 2', description: 'This is the description for Item 2', price: 14.99 },
  { id: 3, name: 'Item 3', description: 'This is the description for Item 3', price: 19.99 },
];

const Testing = () => {
  const [form] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemChange = (value) => {
    const item = items.find((item) => item.id === value);
    setSelectedItem(item);
    form.setFieldsValue({
      description: item?.description || '',
      price: item?.price || '',
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="item" label="Item" rules={[{ required: true, message: 'Please select an item' }]}>
        <Select placeholder="Select an item" onChange={handleItemChange}>
          {items.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input />
      </Form.Item>

      <Form.Item name="price" label="Price">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default Testing;