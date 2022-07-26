import moment from 'moment';
import WebView from 'services/webview';

export function longDateFormat(date) {
  return moment(date).format('DD-MM-YYYY hh:mm A');
}

export function share(text) {
  if (WebView.isWebView()) {
    WebView.share(text);
  } else {
    if ('share' in navigator) {
      navigator.share({ text })
        .catch(err => console.log(err));
      return;
    }
    const url = `mailto:team@windo.live?body=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}
