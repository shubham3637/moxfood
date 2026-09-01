import { APP_URL } from './constants';
import { parseUnitWeightGrams } from '@/context/CartContext';

export const SHIPMOZO_PUBLIC_KEY = process.env.SHIPMOZO_PUBLIC_KEY || '9oxs54uCSOUtZAnLhig6';
export const SHIPMOZO_PRIVATE_KEY = process.env.SHIPMOZO_PRIVATE_KEY || 'X3Lw5G8u4Z9tpoERDKAh';
export const SHIPMOZO_BASE_URL = 'https://shipping-api.com/app/api/v1';

export async function shipmozoFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${SHIPMOZO_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'public-key': SHIPMOZO_PUBLIC_KEY,
    'private-key': SHIPMOZO_PRIVATE_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  return data;
}

export async function getShipmozoWarehouses() {
  try {
    const data = await shipmozoFetch('/get-warehouses', { method: 'GET' });
    if (data.result === '1' && Array.isArray(data.data) && data.data.length > 0) {
      // Return default warehouse ID or first active warehouse ID
      const defaultWh = data.data.find((wh: any) => wh.default === 'YES') || data.data[0];
      return String(defaultWh.id);
    }
    return '';
  } catch (error) {
    console.error('Error fetching Shipmozo warehouses:', error);
    return '';
  }
}

/**
 * Calculates optimized box dimensions based on package weight (in grams)
 */
export function getShipmozoBoxDimensions(weightInGrams: number) {
  const weightKg = weightInGrams / 1000;

  if (weightKg <= 2) {
    // 1-2 kg: Box 10 x 10 x 5 cm
    return { length: 10, width: 10, height: 5 };
  } else if (weightKg <= 3) {
    // 2-3 kg: Box 20 x 15 x 10 cm
    return { length: 20, width: 15, height: 10 };
  } else if (weightKg <= 5) {
    // 4-5 kg: Box 35 x 25 x 15 cm
    return { length: 35, width: 25, height: 15 };
  } else {
    // > 5 kg: Box 40 x 30 x 20 cm
    return { length: 40, width: 30, height: 20 };
  }
}

export async function pushOrderToShipmozo(order: any) {
  try {
    const warehouseId = await getShipmozoWarehouses();
    const cleanPhone = Number((order.customerDetails?.phone || '').replace(/\D/g, '')) || 7096396856;
    const cleanPincode = Number(order.customerDetails?.pincode) || 395006;
    const orderDate = new Date(order.createdAt || Date.now()).toISOString().split('T')[0];

    const productDetail = (order.items || []).map((item: any) => ({
      name: item.name || 'Healthy Seed Pack',
      sku_number: item.productId || 'SKU-101',
      quantity: item.quantity || 1,
      discount: '',
      hsn: '',
      unit_price: item.price || 100,
      product_category: 'Grocery',
    }));

    // Total weight estimate in grams
    const weightInGrams = (order.items || []).reduce((acc: number, item: any) => {
      const unitGrams = item.unit ? parseUnitWeightGrams(item.unit) : 250;
      return acc + unitGrams * (item.quantity || 1);
    }, 0) || 500;

    const dimensions = getShipmozoBoxDimensions(weightInGrams);

    const payload = {
      order_id: order.orderId,
      order_date: orderDate,
      order_type: 'ESSENTIALS',
      consignee_name: order.customerDetails?.name || 'Customer',
      consignee_phone: cleanPhone,
      consignee_alternate_phone: '',
      consignee_email: 'support@moxfood.com',
      consignee_address_line_one: order.customerDetails?.address || 'Surat, Gujarat',
      consignee_address_line_two: order.customerDetails?.landmark || '',
      consignee_pin_code: cleanPincode,
      consignee_city: 'Surat',
      consignee_state: 'Gujarat',
      product_detail: productDetail,
      payment_type: order.paymentMethod === 'COD' ? 'COD' : 'PREPAID',
      cod_amount: order.paymentMethod === 'COD' ? String(order.totalAmount) : '',
      weight: weightInGrams,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      warehouse_id: warehouseId,
    };

    console.log('Pushing order to Shipmozo:', payload.order_id, 'Dimensions:', dimensions);
    const result = await shipmozoFetch('/push-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Auto-assign courier if push succeeded
    if (result.result === '1') {
      try {
        const autoAssignResult = await shipmozoFetch('/auto-assign-order', {
          method: 'POST',
          body: JSON.stringify({ order_id: order.orderId }),
        });
        return {
          success: true,
          pushData: result.data,
          assignData: autoAssignResult.data || null,
        };
      } catch (err) {
        console.warn('Auto-assign courier error:', err);
      }
    }

    return {
      success: result.result === '1',
      pushData: result.data || null,
      message: result.message || 'Push order response received',
    };
  } catch (error: any) {
    console.error('Shipmozo Push Order Exception:', error);
    return { success: false, error: error.message };
  }
}

export async function trackShipmozoOrder(awbNumber: string) {
  try {
    const data = await shipmozoFetch(`/track-order?awb_number=${encodeURIComponent(awbNumber)}`, {
      method: 'GET',
    });
    return data;
  } catch (error: any) {
    console.error('Shipmozo Track Order Error:', error);
    return { result: '0', message: error.message };
  }
}
