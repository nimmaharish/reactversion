import { connector } from 'api/becca/axios';

export async function listBanks() {
  const { data } = await connector.get('seller/shop/bank/list');
  return data;
}

export async function listBankStates(params) {
  const { data } = await connector.get('seller/shop/bank/states', { params });
  return data;
}

export async function listBankDistricts(params) {
  const { data } = await connector.get('seller/shop/bank/districts', { params });
  return data;
}

export async function listBankCities(params) {
  const { data } = await connector.get('seller/shop/bank/cities', { params });
  return data;
}

export async function listBankBranches(params) {
  const { data } = await connector.get('seller/shop/bank/branches', { params });
  return data;
}

export async function getBankDetailsByIFSC(params) {
  const { data } = await connector.get('seller/shop/bank/ifsc', { params });
  return data;
}

export async function saveBankDetails(req) {
  const { data } = await connector.post('seller/shop/bank', req);
  return data;
}
