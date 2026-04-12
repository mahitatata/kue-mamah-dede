const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const { token, body, headers, ...rest } = options;
  const finalHeaders = new Headers(headers || {});
  const config = {
    ...rest,
    headers: finalHeaders,
  };

  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (body instanceof FormData) {
    config.body = body;
  } else if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
    finalHeaders.set('Accept', 'application/json');
    config.body = JSON.stringify(body);
  } else {
    finalHeaders.set('Accept', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message = data?.message || 'Terjadi kesalahan pada server.';
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const api = {
  getProducts: () => request('/products'),
  getProduct: (slug) => request(`/products/${slug}`),
  login: (payload) => request('/login', { method: 'POST', body: payload }),
  register: (payload) => request('/register', { method: 'POST', body: payload }),
  getMe: (token) => request('/me', { token }),
  logout: (token) => request('/logout', { method: 'POST', token }),
  getCart: (token) => request('/cart', { token }),
  addCartItem: (token, payload) => request('/cart/items', { method: 'POST', token, body: payload }),
  updateCartItem: (token, cartItemId, payload) =>
    request(`/cart/items/${cartItemId}`, { method: 'PATCH', token, body: payload }),
  removeCartItem: (token, cartItemId) => request(`/cart/items/${cartItemId}`, { method: 'DELETE', token }),
  checkout: (token, payload) => request('/orders/checkout', { method: 'POST', token, body: payload }),
  getOrders: (token, status = 'all') => request(`/orders?status=${status}`, { token }),
  getOrder: (token, orderId) => request(`/orders/${orderId}`, { token }),
  refreshPaymentStatus: (token, orderId) =>
    request(`/orders/${orderId}/refresh-payment-status`, { method: 'POST', token }),
  syncPaymentClientResult: (token, orderId, payload) =>
    request(`/orders/${orderId}/sync-client-result`, { method: 'POST', token, body: payload }),
  getAdminProducts: (token) => request('/admin/products', { token }),
  createAdminProduct: (token, payload) => request('/admin/products', { method: 'POST', token, body: payload }),
  updateAdminProduct: (token, slug, payload) =>
    request(`/admin/products/${slug}`, { method: 'POST', token, body: payload }),
  deleteAdminProduct: (token, slug) => request(`/admin/products/${slug}`, { method: 'DELETE', token }),
  getAdminOrders: (token) => request('/admin/orders', { token }),
  updateAdminOrderStatus: (token, orderId, orderStatus) =>
    request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      token,
      body: { order_status: orderStatus },
    }),
};
