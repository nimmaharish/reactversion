import { connector } from './axios';

async function getInCartOrders(page = 0, filters = {}, sorts = {}) {
  const {
    data
  } = await connector.get('seller/orders/order/abandoned', {
    params: {
      page,
      filters,
      sorts,
    }
  });
  return data;
}

async function getOrders(page = 0, filters = {}, sorts = {}) {
  const {
    data
  } = await connector.get('seller/orders', {
    params: {
      page,
      filters,
      sorts,
    }
  });
  return data;
}

async function getChatRooms(page) {
  const {
    data
  } = await connector.get(`seller/orders/chat/rooms?page=${page}`);
  return data;
}

async function getOrder(id) {
  const {
    data
  } = await connector.get(`seller/orders/${id}`);
  return data;
}

async function addCharge(id, payload) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/addCustomizationCharges`, payload);
  return data;
}

async function confirm(id, payload) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/confirm`, payload);
  return data;
}

async function deliver(id, grpId) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/${grpId}/delivered`);
  return data;
}

async function outForDelivery(id, grpId) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/${grpId}/outfordelivery`);
  return data;
}

async function picked(id, grpId) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/${grpId}/picked`);
  return data;
}

async function cancelOrder(id) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/cancel`);
  return data;
}

async function shipOrder(id, grpid, payload) {
  const {
    data
  } = await connector.post(`seller/orders/shipping/v2/${id}/ship/${grpid}`, payload);
  return data;
}

async function getIndiaPricing(id, payload) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/ship/pricing`, payload);
  return data;
}

async function getLabel(id, grpId) {
  return connector.get(`seller/orders/${id}/${grpId}/label`, {
    responseType: 'blob'
  });
}

async function sendEmailLabel(id, grpId) {
  return connector.post(`seller/orders/${id}/${grpId}/label/email`);
}

async function trackOrder(id) {
  const { data } = await connector.get(`seller/orders/${id}/track`);
  return data;
}

async function trackOrderWithGroup(id, grpId) {
  const { data } = await connector.get(`seller/orders/${id}/${grpId}/track`);
  return data;
}

async function getSettlements(type = '', page, filters, sorts) {
  if (type === 'all') {
    const {
      data
    } = await connector.get('seller/settlements', {
      params: {
        page,
        filters,
        sorts: JSON.stringify(sorts)
      }
    });
    return data;
  }
  const {
    data
  } = await connector.get(`seller/settlements/${type}`, {
    params: {
      page,
      filters,
      sorts: JSON.stringify(sorts)
    }
  });
  return data;
}

async function getShippingMeta(id, payload) {
  const { data } = await connector.post(`seller/orders/shipping/v2/${id}/meta`, payload);
  return data;
}

async function getShippingMetaWithGroup(id, grpId, payload) {
  const { data } = await connector.post(`seller/orders/shipping/v2/${id}/meta/${grpId}`, payload);
  return data;
}

async function getShippingRates(id, grpid, payload) {
  const { data } = await connector.post(`seller/orders/shipping/v2/${id}/pricing/${grpid}`, payload);
  return data;
}

async function getPartnerShippingRates(id, grpid, pid, payload) {
  const { data } = await connector.post(`seller/orders/shipping/v2/${id}/pricing/${grpid}/${pid}`, payload);
  return data;
}

async function getShippingRatesWithGroup(id, grpid, payload) {
  const { data } = await connector.post(`seller/orders/${id}/${grpid}/ship/pricing`, payload);
  return data;
}

async function createPickup(id, grpId, payload) {
  const {
    data
  } = await connector.post(`seller/orders/shipping/v2/${id}/pickUp/${grpId}`, payload);
  return data;
}

async function getShopRatings(page = 0, sorts = {}) {
  const {
    data
  } = await connector.get('seller/ratings/', {
    params: {
      page,
      sorts,
    }
  });
  return data;
}

async function updateRating(id, payload) {
  const {
    data
  } = await connector.post(`seller/ratings/${id}`, payload);
  return data;
}

async function createOrder(id, payload) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/ship/createOrder`, payload);
  return data;
}

async function createOrderWithGroup(id, grpId, payload) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/${grpId}/ship/createOrder`, payload);
  return data;
}

async function markAsPaid(id) {
  const {
    data
  } = await connector.post(`seller/orders/${id}/markAsPaid`);
  return data;
}

async function paymentSummary(filters = {}) {
  const {
    data
  } = await connector.get('seller/common/shop/paymentStats', {
    params: {
      filters,
    }
  });
  return data;
}

async function paymentStatusSummary(filters = {}) {
  const {
    data
  } = await connector.get('seller/common/shop/paymentStatusStats', {
    params: {
      filters,
    }
  });
  return data;
}

async function updateStatus(id, statusType, status, items, note, data, media = []) {
  const {
    data: response
  } = await connector.post(`seller/orders/${id}/updateStatus`, {
    status,
    statusType,
    note,
    data,
    items,
    media
  });
  return response;
}

async function getPaymentLink(orderId) {
  const {
    data
  } = await connector.get(`seller/orders/${orderId}/paymentLink`);
  return data;
}

async function generatePaymentLink({ orderId, modes }) {
  const {
    data
  } = await connector.post(`seller/orders/${orderId}/generatePaymentLink`, modes);
  return data;
}

const Factory = {
  markAsPaid,
  getOrders,
  getOrder,
  addCharge,
  confirm,
  shipOrder,
  getLabel,
  getChatRooms,
  trackOrder,
  deliver,
  picked,
  outForDelivery,
  cancelOrder,
  sendEmailLabel,
  getSettlements,
  getShippingMeta,
  getShippingRates,
  createPickup,
  createOrder,
  getInCartOrders,
  getShippingRatesWithGroup,
  getPartnerShippingRates,
  createOrderWithGroup,
  getShippingMetaWithGroup,
  trackOrderWithGroup,
  getIndiaPricing,
  paymentSummary,
  paymentStatusSummary,
  updateStatus,
  getShopRatings,
  updateRating,
  getPaymentLink,
  generatePaymentLink
};

export default Factory;
