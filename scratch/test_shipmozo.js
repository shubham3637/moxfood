async function testPush() {
  const url = 'https://shipping-api.com/app/api/v1/push-order';

  // 1. Fetch Warehouses first
  const whRes = await fetch('https://shipping-api.com/app/api/v1/get-warehouses', {
    method: 'GET',
    headers: {
      'public-key': '9oxs54uCSOUtZAnLhig6',
      'private-key': 'X3Lw5G8u4Z9tpoERDKAh',
      'Content-Type': 'application/json',
    },
  });
  const whData = await whRes.json();
  console.log('Warehouses Data:', JSON.stringify(whData, null, 2));

  const warehouseId = whData.data && whData.data.length > 0 ? String(whData.data[0].id) : '1';

  const payload = {
    order_id: 'MXF-TEST-' + Math.floor(Math.random() * 10000),
    order_date: '2026-09-01',
    order_type: 'ESSENTIALS',
    consignee_name: 'Gautam Patel',
    consignee_phone: '9624719200',
    consignee_alternate_phone: '',
    consignee_email: 'support@moxfood.com',
    consignee_address_line_one: 'Varachha Road, Surat',
    consignee_address_line_two: 'Near Station',
    consignee_pin_code: 395006,
    consignee_city: 'Surat',
    consignee_state: 'Gujarat',
    product_detail: [
      {
        name: 'Pumpkin Seeds',
        sku_number: 'SKU-101',
        quantity: 1,
        discount: '',
        hsn: '',
        unit_price: 100,
        product_category: 'Grocery',
      },
    ],
    payment_type: 'PREPAID',
    cod_amount: '',
    weight: 1.0, // Weight in KG
    length: 10,
    width: 10,
    height: 5,
    warehouse_id: warehouseId,
  };

  console.log('Sending payload:', payload);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'public-key': '9oxs54uCSOUtZAnLhig6',
      'private-key': 'X3Lw5G8u4Z9tpoERDKAh',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('Shipmozo API Push Response:', JSON.stringify(data, null, 2));
}

testPush();
