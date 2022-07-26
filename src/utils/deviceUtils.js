import WebView from 'services/webview';

const copy = (data) => {
  if (WebView.isWebView()) {
    return WebView.copy(data);
  }
  if (navigator?.clipboard) {
    return navigator.clipboard.writeText(data);
  }
};

const DeviceUtils = {
  copy,
};

export default DeviceUtils;
