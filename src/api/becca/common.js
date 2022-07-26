import { connector } from './axios';

export async function createFeatureRequest(title, message) {
  const { data } = await connector.post('/seller/featureRequests', {
    title,
    message,
  });
  return data;
}

export async function getFeatureRequests(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/featureRequests', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}

export async function checkPickupEligibility(pincode) {
  const { data } = await connector.get('/seller/common/shipping/pickupAvailable', {
    params: {
      pincode
    }
  });
  return data;
}

export async function verifyDomain(domain) {
  const { data } = await connector.post('/seller/shop/domain/verify', {
    domain,
  });
  return data;
}

export async function connectDomain(domain) {
  const { data } = await connector.post('/seller/shop/domain/connect', {
    domain,
  });
  return data;
}

export async function downloadQRCode() {
  const { data } = await connector.get('/seller/common/qrcode/download');
  return data;
}

export async function emailQRCode() {
  const { data } = await connector.get('/seller/common/qrcode/email');
  return data;
}

export async function getCustomerList(page = 0, filters) {
  const { data } = await connector.get('/seller/shop/customers', {
    params: {
      page,
      filters
    }
  });
  return data;
}

export async function getCustomerAddress(id) {
  const { data } = await connector.get(`/seller/shop/customer/${id}/address`);
  return data;
}

export async function getAbandonCartList(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/shop/getAbandonCartList', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}

export async function getAbandonCart(id) {
  const { data } = await connector.get(`/seller/shop/getAbandonCart/${id}`);
  return data;
}

export async function getAbandonCartCount() {
  const { data } = await connector.get('/seller/shop/getAbandonCartCount');
  return data;
}
