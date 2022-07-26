import { useLayoutEffect, useState } from 'react';
import WebView from 'services/webview';

export function useGooglePlaySupported() {
  const [state, setState] = useState(false);

  const setSupported = async () => {
    try {
      if (!WebView.isWebView()) {
        return;
      }
      const { platform = 'web' } = await WebView.platform();
      if (platform !== 'android') {
        return;
      }
      const { result } = await WebView.isFeatureSupported('subscribe');
      if (result) {
        setState(true);
      }
    } catch (e) {
      // ignore error
    }
  };

  useLayoutEffect(() => {
    setSupported();
  }, []);

  return state;
}
