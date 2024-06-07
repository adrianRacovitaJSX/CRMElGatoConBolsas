import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col, AutoComplete } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import ItemRow from '@/modules/ErpPanelModule/ItemRow';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import calculate from '@/utils/calculate';
import { useSelector } from 'react-redux';
import SelectAsync from '@/components/SelectAsync';

const itemsData = [
  { name: 'Item A', description: 'Description of Item A', price: 10.5 },
  { name: 'Item B', description: 'Description of Item B', price: 15.0 },
  { name: 'Item C', description: 'Description of Item C', price: 8.25 },
  // Add more items as needed
];

export default function InvoiceForm({ subTotal = 0, current = null }) {
  const { last_invoice_number } = useSelector(selectFinanceSettings);

  // if (!last_invoice_number) {
  //   return <></>;
  // }

  return <LoadInvoiceForm subTotal={subTotal} current={current} />;
}

function LoadInvoiceForm({ subTotal = 0, current = null }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { last_invoice_number } = useSelector(selectFinanceSettings);
  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [recargo, setRecargo] = useState(0); // Default recargo is set to 0
  const [recargoTotal, setRecargoTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [lastNumber, setLastNumber] = useState(() => last_invoice_number + 1);
  const [form] = Form.useForm(); // Get the form instance directly
  const [itemRows, setItemRows] = useState([
    { itemName: '', description: '', quantity: 1, price: 0, total: 0 }, // Initial empty row
  ]);

  const handleItemChange = (index, field, value) => {
    const newRows = [...itemRows];
    newRows[index][field] = value;

    if (field === 'itemName') {
      const item = itemsData.find((item) => item.name === value);
      if (item) {
        form.current.setFieldsValue({
          items: newRows.map((row, i) => ({
            ...row,
            ...(i === index && {
              description: item.description,
              price: item.price,
              total: row.quantity * item.price,
            }),
          })),
        });
      }
    } else if (field === 'quantity') {
      form.current.setFieldsValue({
        items: newRows.map((row, i) => ({
          ...row,
          ...(i === index && { total: value * row.price }),
        })),
      });
    }

    calculateSubtotal();
  };

  useEffect(() => {
    // Initialize form fields when itemRows change
    form.current?.setFieldsValue({ items: itemRows });
  }, [itemRows]); // Add itemRows to the dependency array

  const addRow = () => {
    setItemRows([...itemRows, { itemName: '', description: '', quantity: 1, price: 0, total: 0 }]);
  };
  const handelTaxChange = (value) => {
    setTaxRate(value / 1);
  };

  const recargoChange = (value) => {
    setRecargo(value / 1);
  };

  useEffect(() => {
    // Calculate tax based on selected taxRate
    const taxValue = calculate.multiply(subTotal, taxRate) / 100;

    // Calculate recargo based on selected recargo rate
    const recargoValue = calculate.multiply(subTotal, recargo) / 100;

    // Calculate total: subTotal + tax + recargo
    const currentTotal = calculate.add(subTotal, taxValue);

    // Update state variables
    setTaxTotal(taxValue);
    setRecargoTotal(recargoValue);

    // Calculate total with recargo and update state
    const total = calculate.add(currentTotal, recargoValue) / 1;
    setTotal(total);
  }, [subTotal, taxRate, recargo]);

  /* const addField = useRef(false);

  useEffect(() => {
    addField.current.click();
  }, []); */

  return (
    <Form
      form={form}
      // ... other form props
    >
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={9}>
          <Form.Item
            name="client"
            label={translate('Client')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AutoCompleteAsync entity={'client'} displayLabels={['name']} searchFields={'name'} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label={translate('number')}
            name="number"
            initialValue={lastNumber}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label={translate('year')}
            name="year"
            initialValue={currentYear}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label={translate('status')}
            name="status"
            rules={[
              {
                required: false,
              },
            ]}
            initialValue={'draft'}
          >
            <Select
              options={[
                { value: 'draft', label: translate('Draft') },
                { value: 'pending', label: translate('Pending') },
                { value: 'sent', label: translate('Sent') },
              ]}
            ></Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={9}>
          <Form.Item label={translate('Note')} name="note">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="date"
            label={translate('Date')}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={7}>
          <Form.Item
            name="expiredDate"
            label="Vencimiento"
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs().add(30, 'days')}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed />
      <Row gutter={[12, 12]} style={{ position: 'relative' }}>
        <Col className="gutter-row mobile-full-width" span={4}>
          <p>Name</p>
        </Col>
        <Col className="gutter-row mobile-full-width" span={5}>
          <p>Descripción</p>
        </Col>
        <Col className="gutter-row mobile-full-width" span={3}>
          <p>Cant.</p>
        </Col>
        <Col className="gutter-row mobile-full-width" span={6}>
          <p>Precio</p>
        </Col>
        <Col className="gutter-row mobile-full-width" span={6}>
          <p>Total</p>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <div>
          {itemRows.map((row, index) => (
            <Row gutter={[12, 12]} key={index}>
              <Col span={4}>
                <Form.Item name={['items', index, 'itemName']}>
                  <AutoComplete
                    options={itemsData.map((item) => ({ value: item.name }))}
                    onChange={(value) => handleItemChange(index, 'itemName', value)}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name={['items', index, 'description']}>
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name={['items', index, 'quantity']}>
                  <InputNumber
                    min={1}
                    onChange={(value) => handleItemChange(index, 'quantity', value)}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={['items', index, 'price']}>
                  <InputNumber readOnly />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={['items', index, 'total']}>
                  <InputNumber readOnly />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={addRow} block icon={<PlusOutlined />}>
            Add Item
          </Button>
        </div>
      </Row>

      <Divider dashed />
      <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
        <Row gutter={[2, -5]}>
          <Col className="gutter-row" span={10}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                {translate('Save')}
              </Button>
            </Form.Item>
          </Col>
          <Col
            className="gutter-row"
            md={{
              span: 3,
              offset: 15,
            }}
            xs={{
              span: 7,
              offset: 11,
            }}
          >
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
              }}
            >
              {translate('Sub Total')} :
            </p>
          </Col>
          <Col className="gutter-row" span={6}>
            <MoneyInputFormItem readOnly value={subTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col
            className="gutter-row"
            md={{
              span: 3,
              offset: 15,
            }}
            xs={{
              span: 7,
              offset: 11,
            }}
            style={{ textAlign: 'center' }}
          >
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectAsync
                value={taxRate}
                onChange={handelTaxChange}
                entity={'taxes'}
                outputValue={'taxValue'}
                displayLabels={['taxName']}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel="Add New Tax"
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col
            className="gutter-row"
            span={3}
            offset={15}
            style={{
              verticalAlign: 'middle',
            }}
          >
            <Form.Item
              name="recargo"
              rules={[
                {
                  required: false,
                  message: 'Introduzca recargo.',
                },
              ]}
              initialValue="¿Recargo?"
            >
              <Select
                value={recargo}
                onChange={recargoChange}
                bordered={false}
                options={[
                  { value: 0, label: 'Sin recargo' },
                  { value: 5.2, label: '5.2%' }, // recargo value is 5.2%
                ]}
                style={{
                  textSizeAdjust: '10px',
                }}
              ></Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <MoneyInputFormItem readOnly value={recargoTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col
            className="gutter-row"
            md={{
              span: 2,
              offset: 16,
            }}
            xs={{
              span: 5,
              offset: 13,
            }}
            style={{
              verticalAlign: 'middle',
            }}
          >
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                verticalAlign: 'middle',
              }}
            >
              {translate('Total')} :
            </p>
          </Col>
          <Col className="gutter-row" span={6}>
            <MoneyInputFormItem readOnly value={total} />
          </Col>
        </Row>
      </div>
    </Form>
  );
}
