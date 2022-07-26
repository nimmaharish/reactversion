import { useEffect } from 'react';
import WebView from 'services/webview';
import { User, App } from 'api';
import { AppUpdateService } from 'services/appUpdate';
import CONFIG from 'config';

export function useSyncFcmToken() {
  const sync = async () => {
    try {
      if (WebView.isWebView()) {
        const { token } = await WebView.fcmToken();
        await User.syncFcmToken(token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    sync();
  }, []);

  return [sync];
}

export function useCheckForUpdate() {
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!WebView.isWebView()) {
        return;
      }
      const result = await WebView.checkUpdate();
      if (result) {
        AppUpdateService.open('app');
      }
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
}

export function useCheckForWebUpdate() {
  const fetch = async () => {
    try {
      const { version } = await App.fetchVersion();
      if (version !== CONFIG.BUILD.version) {
        AppUpdateService.open('web');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
}
