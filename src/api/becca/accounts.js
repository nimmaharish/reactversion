import { connector } from './axios';

export async function createAccount(name, returnUrl, cancelUrl) {
  const { data } = await connector.post(`seller/shop/accounts/${name}`, {
    returnUrl,
    cancelUrl,
  });
  return data;
}

export async function pollAccountStatus(name) {
  const { data } = await connector.get(`seller/shop/accounts/${name}/poll`);
  return data;
}
