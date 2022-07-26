import { connector } from './axios';

async function getUser() {
  try {
    const {
      data
    } = await connector.get('/profile');
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

async function login(token) {
  const { data } = await connector.post('/auth/adminDashBoard', {
    token
  });
  return data;
}

async function register(token, platform) {
  const payload = {
    token,
    type: 'email',
    platform,
  };
  if (window?.Rewardful?.referral) {
    payload.rewardfulReferral = window.Rewardful.referral;
  }
  const { data } = await connector.post('/auth/register/seller', payload);
  return data.token;
}

async function sendOTC(payload) {
  const { data } = await connector.post('/auth/seller/email/sendOtc', payload);
  return data;
}

async function validateEmail(payload) {
  if (window?.Rewardful?.referral) {
    payload.rewardfulReferral = window.Rewardful.referral;
  }
  const { data } = await connector.post('/auth/seller/email/validate', payload);
  return data;
}

async function syncFcmToken(token) {
  const { data } = await connector.post('/sellers/attributes/fcmToken', { token });
  return data.token;
}

async function getSeller() {
  const {
    data
  } = await connector.get('/sellers');
  return data;
}

async function updateSeller(payload) {
  const {
    data
  } = await connector.patch('/sellers', payload);
  return data;
}

async function sendPhoneOTC(payload) {
  const { data } = await connector.post('/sellers/phone/sendOtc', payload);
  return data;
}

async function deleteAccount(payload) {
  const { data } = await connector.post('/sellers/verifyAndDeactivate', payload);
  return data;
}

async function validatePhone(payload) {
  const { data } = await connector.post('/sellers/phone/validate', payload);
  return data;
}

const User = {
  getUser,
  login,
  register,
  syncFcmToken,
  getSeller,
  updateSeller,
  sendOTC,
  validateEmail,
  sendPhoneOTC,
  validatePhone,
  deleteAccount
};

export default User;
