import { connector } from './axios';

async function createCoupon(req) {
  const { data } = await connector.post('/coupons/', req);
  return data;
}

async function updateCoupon(id, req) {
  const { data } = await connector.put(`/coupons/${id}`, req);
  return data;
}

async function updateCouponStatus(id, status) {
  const { data } = await connector.put(`/coupons/${id}/status`, {
    status,
  });
  return data;
}

async function getAllCoupons(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/coupons', {
    params: { page, filters, sorts }
  });
  return data;
}

async function getCoupon(id) {
  const { data } = await connector.get(`/coupons/${id}`);
  return data;
}

const Snitch = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCouponStatus,
  updateCoupon,
};

export default Snitch;
