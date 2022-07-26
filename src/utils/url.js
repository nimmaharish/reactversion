import Storage from 'services/storage';
function getUrl(path = '') {
  return `${window.location.protocol}//${window.location.host}${path}`;
}

function generateWebSubscriptionUrl(planId, priceId) {
  const token = Storage.getItem('token');
  const data = encodeURIComponent(btoa(JSON.stringify({
    token,
    planId,
    priceId,
  })));
  return `${getUrl('/web/subscriptions')}?token=${data}`;
}

function getTokenData(data) {
  return JSON.parse(atob(decodeURIComponent(data)));
}

const URL = {
  getUrl,
  generateWebSubscriptionUrl,
  getTokenData,
};

export default URL;
