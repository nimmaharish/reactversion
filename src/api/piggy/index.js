import _ from 'lodash';
import { connector } from './axios';

async function getWallet() {
  const { data } = await connector.get('/seller/wallet');
  return data;
}

async function onPay(req) {
  const { data } = await connector.post('/seller/wallet/reload', req);
  return data;
}

async function getWalletLogs(page, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/wallet/logs', {
    params: {
      page,
      filters,
      sorts,
    }
  });
  return data;
}

async function pollPayment(id, pgTid, tid) {
  const req = {
    id,
  };
  if (!_.isEmpty(pgTid)) {
    req.pgTid = pgTid;
  }
  if (!_.isEmpty(tid)) {
    req.tid = tid;
  }
  const { data } = await connector.post('/seller/wallet/poll', req);
  return data;
}

const Piggy = {
  getWallet,
  getWalletLogs,
  onPay,
  pollPayment,
};

export default Piggy;
