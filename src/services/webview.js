function isWebView() {
  return !!(window && window.flutter_inappwebview);
}

async function execute(name, ...args) {
  if (!isWebView()) {
    throw new Error('method call not allowed');
  }
  const data = await window.flutter_inappwebview.callHandler(...[name, ...args]);
  if (data === null) {
    throw new Error('method not found');
  }
  if (data.success) {
    return data;
  }
  throw new Error(data.error);
}

async function safeExecute(name, ...args) {
  if (!isWebView()) {
    return null;
  }
  const data = await window.flutter_inappwebview.callHandler(...[name, ...args]);
  if (data === null) {
    return null;
  }
  if (data.success) {
    return data;
  }
  throw new Error(data.error);
}

function login() {
  return execute('login');
}

function isFeatureSupported(feature) {
  return execute('featureAvailable', feature);
}

function subscribe(id) {
  return execute('subscribe', id);
}

function appleLogin() {
  return execute('appleLogin');
}

function facebookLogin() {
  return execute('facebookLogin');
}

function logout() {
  return execute('logout');
}

function askRating(type = 'store') {
  return execute('ratings', type);
}

function fcmToken() {
  return safeExecute('fcmToken');
}

function openUrl(url) {
  return execute('openUrl', url);
}

function instagramLogin() {
  return execute('instagramLogin');
}

function share(body, subject) {
  return execute('share', ...[body, subject].filter(x => x));
}

function download(url) {
  return execute('download', url);
}

function copy(url) {
  return execute('copy', url);
}

async function platform() {
  try {
    return (await safeExecute('platform')) ?? { platform: 'web' };
  } catch (e) {
    return { platform: 'web' };
  }
}

async function checkUpdate() {
  try {
    const result = await execute('checkUpdate');
    return result.available;
  } catch (e) {
    if (e.message === 'method not found') {
      return true;
    }
    return true;
  }
}

async function doUpdate() {
  try {
    await execute('doUpdate');
  } catch (e) {
    if (e.message === 'method not found') {
      const plt = await platform();
      if (plt.platform === 'ios') {
        openUrl('https://apps.apple.com/app/windo-create-online-shop/id1559110127');
      } else if (plt.platform === 'android') {
        openUrl('https://play.google.com/store/apps/details?id=live.windo.seller');
      }
      return;
    }
    throw e;
  }
}

async function setEventData(data = {}) {
  try {
    await execute('setEventData', data);
  } catch (e) {
    // Ignore error
  }
}

async function logEvent(name, data = {}) {
  try {
    await execute('logEvent', name, data);
  } catch (e) {
    // Ignore error
  }
}

const WebView = {
  isWebView,
  execute,
  askRating,
  openUrl,
  share,
  platform,
  fcmToken,
  download,
  login,
  appleLogin,
  facebookLogin,
  logout,
  instagramLogin,
  checkUpdate,
  doUpdate,
  setEventData,
  logEvent,
  copy,
  isFeatureSupported,
  subscribe,
};

window.WebView = Object.freeze({
  ...WebView,
});

export default WebView;
