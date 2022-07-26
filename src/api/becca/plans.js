import { connector } from 'api/becca/axios';

export async function listPlans() {
  const {
    data
  } = await connector.get('seller/plans');
  return data;
}

export async function subscribePlan(planId, priceId, successUrl, cancelUrl, provider = 'stripe') {
  const { data } = await connector.post('seller/plans/subscribe', {
    planId,
    priceId,
    successUrl,
    cancelUrl,
    provider,
    packageName: 'live.windo.seller'
  });
  return data;
}

export async function activatePlan(identifier, token) {
  const { data } = await connector.post('seller/plans/activate', {
    identifier,
    token,
  });
  return data;
}

export async function getPortal(returnUrl) {
  const { data } = await connector.post('seller/plans/portal', {
    returnUrl
  });
  return data;
}

export async function pollSubscriptionStatus(id) {
  const { data } = await connector.get(`seller/plans/subscribe/poll/${id}`);
  return data;
}

export async function startFreeTrail() {
  const { data } = await connector.post('seller/plans/freeTrial');
  return data;
}
