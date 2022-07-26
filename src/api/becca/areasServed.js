import { connector } from 'api/becca/axios';

export async function createAreaConfig(payload) {
  const { data } = await connector.post('/seller/shop/createAreaConfig', payload);
  return data;
}

export async function getAreaConfig() {
  const { data } = await connector.get('/seller/shop/getAreaConfig');
  return data;
}

export async function getAllZones() {
  const { data } = await connector.get('/seller/shop/getAllZones');
  return data;
}

export async function getChargeConfig() {
  const { data } = await connector.get('/seller/shop/getChargeConfig');
  return data;
}

export async function updateChargeConfig(payload) {
  const { data } = await connector.post('/seller/shop/updateChargeConfig', payload);
  return data;
}

export async function exportPincodes(id) {
  const { data } = await connector.get(`/seller/shop/exportPincodes/${id}`);
  return data;
}
