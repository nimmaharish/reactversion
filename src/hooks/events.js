import { useEffect } from 'react';
import EventManager from 'utils/events';
import WebView from 'services/webview';

export function useStartEventsCapture(user, shop) {
  useEffect(() => {
    if (user?.sellerId) {
      const id = (+user.sellerId.split('-')
        .pop()).toString();

      const obj = {
        id,
        name: user?.name,
        email: user?.email,
      };

      if (user?.phone) {
        obj.phone = user?.phone;
      }

      if (shop?._id) {
        obj.shopId = shop?._id;
        obj.country = shop?.country;
        obj.plan = shop?.plan?.description;
      }

      EventManager.patchGlobalData(obj);

      if (WebView.isWebView()) {
        WebView.setEventData(obj);
      } else {
        EventManager.initializeWebEvents(obj);
      }
    }
  }, [user?.sellerId, shop?._id]);
}
