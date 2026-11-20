export const FB_PIXEL_ID = '1498360108839014';

// Global helper to trigger Meta Pixel events safely
export const fbq = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq(...args);
  }
};

// Track PageView
export const pageview = () => {
  fbq('track', 'PageView');
};

// Generic Track Event
export const trackEvent = (name: string, options: Record<string, any> = {}) => {
  fbq('track', name, options);
};

// Standard Events

// 1. ViewContent (When viewing a specific product or item)
export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  trackEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category || 'Healthy Seeds & Superfoods',
    value: product.price,
    currency: 'INR',
  });
};

// 2. AddToCart (When adding an item to the shopping cart)
export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}) => {
  const qty = item.quantity || 1;
  trackEvent('AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: (item.price || 0) * qty,
    currency: 'INR',
  });
};

// 3. InitiateCheckout (When landing on checkout / starting checkout flow)
export const trackInitiateCheckout = (items: any[], totalValue: number) => {
  trackEvent('InitiateCheckout', {
    content_ids: items.map((i) => i.productId || i._id || i.id),
    contents: items.map((i) => ({
      id: i.productId || i._id || i.id,
      quantity: i.quantity || 1,
      item_price: i.price,
    })),
    num_items: items.length,
    value: totalValue,
    currency: 'INR',
  });
};

// 4. AddPaymentInfo (When user proceeds to pay / enters payment step)
export const trackAddPaymentInfo = (value: number, paymentType: string = 'Razorpay') => {
  trackEvent('AddPaymentInfo', {
    value,
    currency: 'INR',
    payment_type: paymentType,
  });
};

// 5. Purchase (When an order is successfully confirmed)
export const trackPurchase = (order: {
  id: string;
  totalAmount: number;
  items?: any[];
}) => {
  trackEvent('Purchase', {
    content_ids: order.items?.map((i) => i.productId || i.id) || [],
    contents: order.items?.map((i) => ({
      id: i.productId || i.id,
      quantity: i.quantity || 1,
      item_price: i.price,
    })) || [],
    content_type: 'product',
    value: order.totalAmount,
    currency: 'INR',
    order_id: order.id,
  });
};

// 6. Contact (When user clicks WhatsApp or submits a contact inquiry)
export const trackContact = (method: string = 'WhatsApp') => {
  trackEvent('Contact', {
    content_name: method,
  });
};

// 7. Search (When searching on the site)
export const trackSearch = (searchQuery: string) => {
  trackEvent('Search', {
    search_string: searchQuery,
  });
};
