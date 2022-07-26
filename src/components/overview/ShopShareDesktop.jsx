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
import {
  useCustomDomain, useIsFreePlan, useIsOnCustomDomain, useOpenPlans
} from 'contexts';
import qrcodeIcon from 'assets/v2/overview/qrcode.svg';
import { useToggle } from 'hooks/common';
import { QrPopUp } from 'components/overview/lazy';
import DeviceUtils from '../../utils/deviceUtils';
import styles from './ShopShare.module.css';

export function ShopShareDesktop({
  slug,
  name
}) {
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const value = isCustomDomain ? `https://${domain}` : `https://mywindo.shop/${slug}`;
  const [openQr, toggleQr] = useToggle();
  const isFree = useIsFreePlan();
  const openPlans = useOpenPlans();
  const [activeOrders] = useInfiniteOrders({}, { createdAt: 1 });

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
${shareShop(slug, true)} to buy my products.
Thank you
${name}`);
  };

  const url = shareShop(slug, isCustomDomain, domain);

  const openShop = (e) => {
    const url = shareShop(slug, true);
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  return (
    <div className={styles.section}>
      {activeOrders?.length < 3 ? (
        <>
          <div className={styles.container}>
            <div>
              <div className={styles.head1}>Get your orders rolling with these easy steps:</div>
              <div className={styles.sub1}>
                <span className={styles.dot1} />
                Add your shop URL to your Instagram bio
              </div>
              <div className={styles.sub1}>
                <span className={styles.dot1} />
                Share your shop URL via Whatsapp and Facebook
              </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.linkBarContainer}>
              <LinkBar url={value} onCopy={copyToClipboard} onClick={shareToUser} />
              <div className={styles.shareContainer1}>
                <Button
                  onClick={openShop}
                  primary={false}
                  size="small"
                  startIcon={eyeIcon}
                  className={styles.eye}
                  label="View Shop"
                />
                <div className={styles.button}>
                  <Clickable className={styles.qrCode} onClick={openQrCode}>
                    <img src={qrcodeIcon} alt="" />
                    <span>Scan QR</span>
                  </Clickable>
                  {openQr && (
                    <QrPopUp url={url} onClose={toggleQr} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.main}>
            <div className={styles.content}>
              <div className={styles.head1}>Share your shop more to get more orders</div>
              <div className={styles.linkBarContainer1}>
                <LinkBar url={value} onCopy={copyToClipboard} onClick={shareToUser} />
              </div>
              <div className={styles.shareContainer1}>
                <Button
                  onClick={openShop}
                  primary={false}
                  size="small"
                  startIcon={eyeIcon}
                  className={styles.eye}
                  label="View Shop"
                />
                <div className={styles.button}>
                  <Clickable className={styles.qrCode} onClick={openQrCode}>
                    <img src={qrcodeIcon} alt="" />
                    <span>Scan QR</span>
                  </Clickable>
                  {openQr && (
                    <QrPopUp url={url} onClose={toggleQr} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

ShopShareDesktop.propTypes = {
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
