async function testPushCancelledOrder() {
  const url = 'https://shipping-api.com/app/api/v1/push-order';

  const payload = {
    order_id: 'MXF-493373',
    order_date: '2026-09-01',
    order_type: 'ESSENTIALS',
    consignee_name: 'GAUTAM KUKADIYA',
    consignee_phone: '7623917911',
    consignee_alternate_phone: '',
    consignee_email: 'support@moxfood.com',
    consignee_address_line_one: 'silver maxima apartment, near vip circle silver business hub H401',
    consignee_address_line_two: '',
    consignee_pin_code: 394105,
    consignee_city: 'Surat',
    consignee_state: 'Gujarat',
    product_detail: [
      {
        name: 'Flex/Alsi Seeds',
        sku_number: 'SKU-FLEX',
        quantity: 1,
        discount: '',
        hsn: '',
        unit_price: 85,
        product_category: 'Grocery',
      },
      {
        name: 'Watermelon/ Magjtari',
        sku_number: 'SKU-WM',
        quantity: 1,
        discount: '',
        hsn: '',
        unit_price: 350,
        product_category: 'Grocery',
      },
    ],
    payment_type: 'PREPAID',
    cod_amount: '',
    weight: 1.0, // 1 kg
    length: 10,
    width: 10,
    height: 5,
    warehouse_id: '139140',
  };

  console.log('Sending payload for MXF-493373:', payload);

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

testPushCancelledOrder();
