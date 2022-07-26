import WebView from './webview';

function askRatings(event) {
  if (WebView.isWebView()) {
    event.preventDefault();
    WebView.askRating();
  }
}

function openUrl(url) {
  return (event) => {
    if (WebView.isWebView()) {
      event.preventDefault();
      WebView.openUrl(url);
    }
  };
}

function openWindow(event) {
  if (WebView.isWebView()) {
    event.preventDefault();
    WebView.openUrl(event.target.getAttribute('href'));
  }
}

const WebViewUtils = {
  askRatings,
  openUrl,
  openWindow,
};

export default WebViewUtils;
