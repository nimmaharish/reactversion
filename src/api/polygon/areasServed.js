import { connector } from './axios';

export async function uploadPincodes(address) {
  const { data } = await connector.post('/areasServed/pincodes/upload', address);
  return data;
}
