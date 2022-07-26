import { useEffect, useState } from 'react';
import WebView from 'services/webview';

export function useIos() {
  const [isIos, setIsIos] = useState();

  useEffect(() => {
    WebView.platform().then(res => setIsIos(res.platform === 'ios'));
  }, []);

  return isIos;
}
