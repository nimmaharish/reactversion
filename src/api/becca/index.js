import { connector } from './axios';
import * as accounts from './accounts';
import * as plans from './plans';
import * as common from './common';
import * as analytics from './analytics';
import * as address from './address';
import * as bank from './bank';
import * as areasServed from './areasServed';

async function getShop() {
  try {
    const {
      data
    } = await connector.get('seller/shop');
    return data;
  } catch (e) {
    if (e?.response?.status === 401) {
      localStorage.removeItem('token');
      document.location.reload();
      return;
    }
    throw e;
  }
}

async function createShop(payload) {
  const {
    data
  } = await connector.post('seller/shop', payload);
  return data;
}

async function updateShop(payload) {
  const {
    data
  } = await connector.patch('seller/shop', payload);
  return data;
}

async function rateShop(payload) {
  const {
    data
  } = await connector.post('seller/shop/rate', payload);
  return data;
}

async function updateCatalog(payload) {
  const {
    data
  } = await connector.patch('seller/shop/catalog', payload);
  return data;
}

async function getCatalogStats() {
  const {
    data
  } = await connector.get('seller/shop/catalog/stats');
  return data;
}

async function addProductsToCatalog(payload) {
  const {
    data
  } = await connector.patch('seller/shop/catalog', payload);
  return data;
}

async function updateShopStatus(payload) {
  const {
    data
  } = await connector.post('seller/shop/status', payload);
  return data;
}

async function toggleStatus(payload) {
  const {
    data
  } = await connector.post('seller/shop/status', payload);
  return data;
}

async function uploadAsset(payload) {
  const {
    data
  } = await connector.post('seller/common/asset', payload);
  return data;
}

async function parseProductXLSX(payload) {
  const {
    data
  } = await connector.post('seller/common/parse/products', payload);
  return data;
}

async function getCategories() {
  const {
    data
  } = await connector.get('seller/common/categories');
  return data;
}

async function getHashTags(str) {
  const {
    data
  } = await connector.get(`seller/common/hashTags?query=${str}`);
  return data;
}

async function createProduct(payload) {
  const {
    data
  } = await connector.post('seller/shop/sku', payload);
  return data;
}

async function createProductBulk(payload) {
  const {
    data
  } = await connector.post('seller/shop/sku/bulk', payload);
  return data;
}

async function updateProductStatus(id, payload) {
  const {
    data
  } = await connector.post(`seller/shop/sku/${id}/status`, payload);
  return data;
}

async function updateProduct(id, payload) {
  const {
    data
  } = await connector.patch(`seller/shop/sku/${id}`, payload);
  return data;
}

async function getProducts(page = 0, filters = {}, sorts = {}) {
  const {
    data
  } = await connector.get('seller/shop/sku', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}

async function createVariant(payload) {
  const {
    data
  } = await connector.post('seller/shop/variants', payload);
  return data;
}

async function getSkuRatings(id, page = 0, sorts = {}) {
  const {
    data
  } = await connector.get(`seller/shop/sku/${id}/ratings`, {
    params: {
      page,
      sorts,
    }
  });
  return data;
}

async function updateVariant(id, payload) {
  const {
    data
  } = await connector.patch(`seller/shop/variants/${id}`, payload);
  return data;
}

async function addStock(id, payload) {
  const {
    data
  } = await connector.post(`seller/shop/variants/${id}/stock`, payload);
  return data;
}

async function getVariants(id) {
  const {
    data
  } = await connector.get(`seller/shop/sku/${id}/variants`);
  return data;
}

async function getCharges(payload) {
  const {
    data
  } = await connector.post('seller/common/shipping/calculator', payload);
  return data;
}

async function updateVariantStatus(id, payload) {
  const {
    data
  } = await connector.post(`seller/shop/variants/${id}/status`, payload);
  return data;
}

async function overview() {
  const {
    data
  } = await connector.get('seller/common/overview');
  return data;
}

async function validateSlug(payload) {
  const {
    data
  } = await connector.post('seller/shop/validateSlug', payload);
  return data;
}

async function changeUrl(name) {
  const {
    data
  } = await connector.post('seller/shop/changeUrl', { name });
  return data;
}

async function getPeopleChatRooms(page = 0, sorts = {}) {
  const {
    data
  } = await connector.get('seller/shop/rooms', {
    params: {
      page, sorts,
    }
  });
  return data;
}

async function getFaqs(payload) {
  const {
    data
  } = await connector.get('seller/shop/faqs', {
    params: payload
  });
  return data;
}

async function templates(page, size, filters, sorts) {
  const {
    data
  } = await connector.get('seller/shop/templates', {
    params: {
      page, sorts, filters, size
    }
  });
  return data;
}

async function addTemplate(payload) {
  const {
    data
  } = await connector.post('seller/shop/template', payload);
  return data;
}

async function patchTemplate(id, payload) {
  const {
    data
  } = await connector.patch(`seller/shop/template/${id}`, payload);
  return data;
}

export async function updateStoreTimings(body) {
  const { data } = await connector.patch('seller/shop', body);
  return data;
}

export async function getShippingPartners(body) {
  const { data } = await connector.get('seller/shipping/partners', body);
  return data;
}

export async function updateShippingPartner(id, body) {
  const { data } = await connector.patch(`seller/shipping/partners/${id}`, body);
  return data;
}

export async function deleteShippingPartner(id) {
  const { data } = await connector.delete(`seller/shipping/partners/${id}`);
  return data;
}

export async function createShippingPartner(id, body) {
  const { data } = await connector.post(`seller/shipping/partners/${id}`, body);
  return data;
}

export async function updateStoreInfo(body) {
  const { data } = await connector.patch('seller/shop', body);
  return data;
}

export async function getAccount(name) {
  const { data } = await connector.get(`seller/shop/accounts/generic/account/${name}`);
  return data;
}

export async function toggleAccount(name, payload) {
  const { data } = await connector.post(`seller/shop/accounts/${name}/toggle`, payload);
  return data;
}

export async function updateAccount(name, payload) {
  const { data } = await connector.patch(`seller/shop/accounts/generic/account/${name}`, payload);
  return data;
}

export async function deleteAccount(name) {
  const { data } = await connector.delete(`seller/shop/accounts/generic/account/${name}`);
  return data;
}

export async function addAccount(name, body) {
  const { data } = await connector.post(`seller/shop/accounts/generic/account/${name}`, body);
  return data;
}

export async function getUiConfig(key) {
  const { data } = await connector.get(`seller/uiConfig/${key}`);
  return data;
}

export async function updateUiConfig(key, payload) {
  const { data } = await connector.put(`seller/uiConfig/${key}`, payload);
  return data;
}
export async function getseo() {
  const { data } = await connector.get('seller/seo/get');
  return data;
}

const Becca = {
  ...accounts,
  ...plans,
  ...common,
  ...analytics,
  ...address,
  ...bank,
  ...areasServed,
  getFaqs,
  getShop,
  getCatalogStats,
  createShop,
  toggleStatus,
  updateShop,
  updateCatalog,
  uploadAsset,
  getCategories,
  getHashTags,
  createProduct,
  getProducts,
  createVariant,
  updateProduct,
  getVariants,
  updateVariant,
  updateShopStatus,
  getCharges,
  updateProductStatus,
  updateVariantStatus,
  overview,
  addStock,
  validateSlug,
  getPeopleChatRooms,
  addProductsToCatalog,
  templates,
  addTemplate,
  patchTemplate,
  changeUrl,
  updateStoreTimings,
  getShippingPartners,
  updateShippingPartner,
  deleteShippingPartner,
  createShippingPartner,
  updateStoreInfo,
  parseProductXLSX,
  createProductBulk,
  getAccount,
  toggleAccount,
  deleteAccount,
  updateAccount,
  addAccount,
  getSkuRatings,
  rateShop,
  getUiConfig,
  updateUiConfig,
  getseo,
};

export default Becca;
