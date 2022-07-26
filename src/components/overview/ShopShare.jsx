import React from 'react';
import PropTypes from 'prop-types';
import SnackBar from 'services/snackbar';
import { shareShop } from 'utils/share';
import { share } from 'utils';
import { useInfiniteOrders, } from 'hooks';
import { LinkBar } from 'phoenix-components/lib/containers';
import { Button, Clickable } from 'phoenix-components';
import eyeIcon from 'assets/onboarding/eye.svg';
import WebView from 'services/webview';
import qrcodeIcon from 'assets/v2/overview/qrcode.svg';
import {
  useCustomDomain, useIsFreePlan, useIsOnCustomDomain, useOpenPlans
} from 'contexts';
import { useToggle } from 'hooks/common';
import { QRCode } from 'components/overview/lazy';
import DeviceUtils from '../../utils/deviceUtils';
import styles from './ShopShare.module.css';

export function ShopShare({
  slug,
  name,
}) {
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const value = isCustomDomain ? `https://${domain}` : `https://mywindo.shop/${slug}`;
  const [activeOrders] = useInfiniteOrders({}, { createdAt: 1 });
  const [openQr, toggleQr] = useToggle();
  const isFree = useIsFreePlan();
  const openPlans = useOpenPlans();

  const openQrCode = () => {
    if (isFree) {
      openPlans();
      return;
    }
    toggleQr();
  };

  const copyToClipboard = () => {
    DeviceUtils.copy(value);
    SnackBar.show('Shop URL Copied !!!');
  };

  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello
We are now selling online. Please visit my WINDO Shop at
${shareShop(slug, isCustomDomain, domain)} to buy my products.

Thank you
${name}`);
  };

  const url = shareShop(slug, isCustomDomain, domain);

  const openShop = (e) => {
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  return (
    <div className={styles.section}>
      <>
        {activeOrders?.length < 3 ? (
          <div>
            <div className={styles.head}>Get your orders rolling with these easy steps:</div>
            <div className={styles.sub}>
              <span className={styles.dot} />
              Add your shop URL to your Instagram bio
            </div>
            <div className={styles.sub}>
              <span className={styles.dot} />
              Share your shop URL via Whatsapp and Facebook
            </div>
          </div>
        ) : (
          <div className={styles.head}>Share your shop more to get more orders</div>
        )}
        <LinkBar url={value} onCopy={copyToClipboard} onClick={shareToUser} />
        <div className={styles.shareContainer}>
          <div className="spacer" />
          <div>
            <Button
              onClick={openShop}
              primary={false}
              size="small"
              startIcon={eyeIcon}
              className={styles.eye}
              label="View Shop"
            />
          </div>
          <div className="spacer" />
          <Clickable className={styles.qrCode} onClick={openQrCode}>
            <img src={qrcodeIcon} alt="" />
            <span>Scan QR</span>
          </Clickable>
          {openQr && (
            <QRCode url={url} onClose={toggleQr} />
          )}
        </div>
      </>
    </div>
  );
}

ShopShare.propTypes = {
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
