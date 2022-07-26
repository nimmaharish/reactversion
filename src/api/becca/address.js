import { connector } from 'api/becca/axios';

export async function addAddress(address) {
  const { data } = await connector.post('seller/shop/address', address);
  return data;
}

export async function updateAddress(id, address) {
  const { data } = await connector.put(`seller/shop/address/${id}`, address);
  return data;
}

export async function deleteAddress(id) {
  const { data } = await connector.delete(`seller/shop/address/${id}`);
  return data;
}

export async function setDefaultAddress(id) {
  const { data } = await connector.post(`seller/shop/address/${id}/default`);
  return data;
}
