export const SHADOWFAX_API_TOKEN =
  process.env.SHADOWFAX_API_TOKEN || 'f3019c5a246e7c888c7f164a896a2d48668d1283';

export const SHADOWFAX_BASE_URL = 'https://api.shadowfax.in';

export async function shadowfaxFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${SHADOWFAX_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    Authorization: `Token ${SHADOWFAX_API_TOKEN}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

/**
 * Dynamic Shadowfax shipping rate and serviceability check
 */
export async function checkShadowfaxRate(pincode: string, weightGrams: number = 500) {
  try {
    const cleanPincode = (pincode || '').trim();
    if (!cleanPincode || cleanPincode.length !== 6) {
      return { serviceable: false, rate: 0, error: 'Invalid 6-digit Pincode' };
    }

    // Try live Shadowfax serviceability / rate API
    const res = await shadowfaxFetch(
      `/api/v2/serviceability/?pincode=${cleanPincode}&weight=${weightGrams}`,
      { method: 'GET' }
    );

    if (res.status === 200 && res.data) {
      const isServiceable = res.data.serviceable !== false && res.data.status !== 'unserviceable';
      const calculatedRate =
        Number(res.data.rate || res.data.delivery_charge || res.data.charge || res.data.amount) ||
        0;

      if (isServiceable && calculatedRate > 0) {
        return {
          serviceable: true,
          rate: calculatedRate,
          data: res.data,
        };
      }
    }

    // Standard courier freight estimation fallback
    const isGujaratPincode = cleanPincode.startsWith('36') || cleanPincode.startsWith('37') || cleanPincode.startsWith('38') || cleanPincode.startsWith('39');
    const billableKg = Math.max(1, Math.ceil(weightGrams / 1000));
    const baseRatePerKg = isGujaratPincode ? 40 : 70;
    const estimatedRate = billableKg * baseRatePerKg;

    return {
      serviceable: true,
      rate: estimatedRate,
      isGujarat: isGujaratPincode,
      estimated: true,
    };
  } catch (error: any) {
    console.error('Shadowfax Rate Check Exception:', error);
    // Fallback calculation
    const billableKg = Math.max(1, Math.ceil(weightGrams / 1000));
    const isGujarat = pincode.startsWith('39') || pincode.startsWith('38') || pincode.startsWith('37') || pincode.startsWith('36');
    return {
      serviceable: true,
      rate: billableKg * (isGujarat ? 40 : 70),
      estimated: true,
    };
  }
}

/**
 * Pushes order details to Shadowfax Forward Order API
 */
export async function pushOrderToShadowfax(order: any) {
  try {
    const cleanPhone = (order.customerDetails?.phone || '').replace(/\D/g, '');
    const cleanPincode = (order.customerDetails?.pincode || '').replace(/\D/g, '');

    const weightGrams = (order.items || []).reduce(
      (acc: number, item: any) => acc + (item.weightGrams || 250) * (item.quantity || 1),
      500
    );

    const payload = {
      client_order_id: order.orderId,
      order_details: {
        order_type: order.paymentMethod === 'COD' ? 'cod' : 'prepaid',
        total_amount: order.totalAmount,
        cod_amount: order.paymentMethod === 'COD' ? order.totalAmount : 0,
        weight: weightGrams,
        length: 10,
        width: 10,
        height: 10,
        product_name:
          (order.items || []).map((i: any) => i.name).join(', ') || 'Healthy Seeds Pack',
      },
      pickup_details: {
        name: 'Moxfood Warehouse',
        phone: '7096396856',
        address: 'Surat, Gujarat',
        pincode: '395006',
        city: 'Surat',
        state: 'Gujarat',
      },
      delivery_details: {
        name: order.customerDetails?.name || 'Customer',
        phone: cleanPhone,
        address: order.customerDetails?.address || '',
        pincode: cleanPincode,
        landmark: order.customerDetails?.landmark || '',
        city: order.customerDetails?.district || 'Surat',
        state: order.customerDetails?.state || 'Gujarat',
      },
    };

    console.log('Pushing order to Shadowfax:', payload.client_order_id);
    const res = await shadowfaxFetch('/api/v2/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const isSuccess =
      res.status === 200 ||
      res.status === 201 ||
      res.data?.status === 'success' ||
      res.data?.success === true;

    const awbNumber =
      res.data?.awb_number ||
      res.data?.waybill_number ||
      res.data?.sfx_order_id ||
      res.data?.data?.awb_number ||
      `SFX-${order.orderId}`;

    const shadowfaxOrderId =
      res.data?.sfx_order_id ||
      res.data?.id ||
      res.data?.data?.sfx_order_id ||
      order.orderId;

    const courierName =
      res.data?.courier_name || res.data?.data?.courier_name || 'Shadowfax Express';

    return {
      success: isSuccess,
      awbNumber,
      shadowfaxOrderId,
      courierName,
      status: res.data?.order_status || 'Pushed',
      data: res.data,
      message: res.data?.message || 'Shadowfax order pushed successfully',
    };
  } catch (error: any) {
    console.error('Shadowfax Push Order Exception:', error);
    return {
      success: false,
      error: error.message || 'Failed to push order to Shadowfax',
    };
  }
}

/**
 * Fetches live AWB tracking info from Shadowfax
 */
export async function trackShadowfaxOrder(orderIdOrAwb: string) {
  try {
    const cleanId = encodeURIComponent((orderIdOrAwb || '').trim());
    const res = await shadowfaxFetch(`/api/v2/orders/${cleanId}/`, {
      method: 'GET',
    });

    if (res.status === 200 && res.data) {
      return {
        success: true,
        data: res.data,
        awbNumber: res.data.awb_number || res.data.waybill_number || orderIdOrAwb,
        status: res.data.order_status || res.data.status || 'In Transit',
        courierName: res.data.courier_name || 'Shadowfax Express',
      };
    }

    return {
      success: false,
      message: res.data?.message || 'Shadowfax tracking information unavailable',
    };
  } catch (error: any) {
    console.error('Shadowfax Track Order Exception:', error);
    return {
      success: false,
      message: error.message || 'Error tracking Shadowfax order',
    };
  }
}
