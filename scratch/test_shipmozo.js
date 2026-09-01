async function testPushRealMongoData() {
  const url = 'https://shipping-api.com/app/api/v1/push-order';

  const order = {
    "orderId": "MXF-493373",
    "customerDetails": {
      "name": "GAUTAM KUKADIYA",
      "phone": "7623917911",
      "address": "silver maxima apartment, near vip circle silver business hub\nH401",
      "pincode": "394105",
      "landmark": "",
      "deliverySlot": "Anytime Today"
    },
    "items": [
      {
        "productId": "6a7c4b9caf2457ba6db8cfc3_500 gm",
        "name": "Flex/Alsi Seeds",
        "altNameGujarati": "",
        "unit": "500 gm",
        "price": 85,
        "quantity": 1,
        "image": "https://res.cloudinary.com/wvorocin/image/upload/v1786530715/moxfood_products/tdstjlb9d5rquqvzvrfk.jpg"
      },
      {
        "productId": "6a7c4b2aaf2457ba6db8cfc1_500 gm",
        "name": "Watermelon/ Magjtari",
        "altNameGujarati": "",
        "unit": "500 gm",
        "price": 350,
        "quantity": 1,
        "image": "https://res.cloudinary.com/wvorocin/image/upload/v1786530597/moxfood_products/ijil5llfyxvulp1l80xj.jpg"
      }
    ],
    "subtotal": 435,
    "deliveryCharge": 40,
    "couponCode": "MOX500",
    "discountAmount": 435,
    "totalAmount": 40,
    "paymentMethod": "RAZORPAY",
    "paymentStatus": "Paid",
    "status": "Cancelled"
  };

  const rawAddress = (order.customerDetails?.address || '').replace(/[\r\n]+/g, ' ').trim();
  const addressLineOne = rawAddress.length >= 6 ? rawAddress : 'Gautam Trading, Surat, Gujarat';

  const productDetail = (order.items || []).map((item) => ({
    name: item.name || 'Healthy Seed Pack',
    sku_number: String(item.productId || 'SKU-101').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30),
    quantity: Number(item.quantity) || 1,
    discount: '',
    hsn: '',
    unit_price: Number(item.price) || 100,
    product_category: 'Grocery',
  }));

  const payload = {
    order_id: order.orderId,
    order_date: '2026-09-01',
    order_type: 'ESSENTIALS',
    consignee_name: order.customerDetails?.name || 'Customer',
    consignee_phone: Number(order.customerDetails?.phone.replace(/\D/g, '')),
    consignee_alternate_phone: '',
    consignee_email: 'support@moxfood.com',
    consignee_address_line_one: addressLineOne,
    consignee_address_line_two: '',
    consignee_pin_code: Number(order.customerDetails?.pincode),
    consignee_city: 'Surat',
    consignee_state: 'Gujarat',
    product_detail: productDetail,
    payment_type: 'PREPAID',
    cod_amount: '',
    weight: 1.0,
    length: 10,
    width: 10,
    height: 5,
    warehouse_id: '139140',
  };

  console.log('Sending payload:', JSON.stringify(payload, null, 2));

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

testPushRealMongoData();
