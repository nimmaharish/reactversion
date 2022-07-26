import React, { useEffect, useState } from 'react';
import { useIos } from 'containers/login/ios';
import ReviewProductIos from 'components/reviewProduct/ReviewProductIos';
import ReviewProductAndroid from 'components/reviewProduct/ReviewProductAndroid';
import { RatingService } from 'services/ratings';
import { useDesktop } from 'contexts';
import WebView from 'services/webview';

export default function Ratings() {
  const isIos = useIos();
  const isWebView = WebView.isWebView();
  const [open, setOpen] = useState(false);
  const isDesktop = useDesktop();

  useEffect(() => {
    const subscribe = (value) => {
      if (isDesktop) {
        return;
      }
      if (!isWebView) {
        window.open('https://windo-seller.onelink.me/yopW/install', '_blank');
        return;
      }
      setOpen(value);
    };
    RatingService.on(subscribe);

    return () => {
      RatingService.off(subscribe);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  const Component = isIos ? ReviewProductIos : ReviewProductAndroid;

  return (
    <Component onClose={onClose} />
  );
}
