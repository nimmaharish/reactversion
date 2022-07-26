import React, { createRef } from 'react';
import ReactQRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { Clickable } from 'phoenix-components';
import downloadIcon from 'assets/images/orders/details/download.svg';
import emailIcon from 'assets/images/email.svg';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import WebView from 'services/webview';
import { Becca } from 'api';
import { useDesktop } from 'contexts';
import { Drawer } from '@material-ui/core';
import closeIcon from 'assets/images/shippingModes/close.svg';
import styles from './QRCode.module.css';

function QRCode({
  url,
  onClose
}) {
  const ref = createRef();
  const isDesktop = useDesktop();

  const download = async () => {
    try {
      Loader.show();
      const { url } = await Becca.downloadQRCode();
      if (WebView.isWebView()) {
        WebView.openUrl(url);
        return;
      }
      window.open(url, '_blank');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const sendEmail = async () => {
    try {
      Loader.show();
      await Becca.emailQRCode();
      SnackBar.show('Your QR code is e-mailed to you!', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (isDesktop) {
    return (
      <Drawer
        anchor="bottom"
        open={true}
        onClose={onClose}
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.img2}><img src={closeIcon} alt="" onClick={onClose} /></div>
          <div className={styles.qrCode} ref={ref}>
            <ReactQRCode ref={ref} value={url} />
          </div>
          <div className={styles.flex}>
            <Clickable onClick={download} className={styles.button}>
              <img src={downloadIcon} alt="" />
              Download QR Code
            </Clickable>
            <Clickable onClick={sendEmail} className={styles.button}>
              <img src={emailIcon} alt="" />
              Email Your QR Code
            </Clickable>
          </div>
        </div>
      </Drawer>
    );
  }

  return (
    <BottomDrawer classes={{ heading: styles.heading }} onClose={onClose} title="Your shop QR code">
      <div className={styles.container}>
        <div className={styles.qrCode} ref={ref}>
          <ReactQRCode ref={ref} value={url} />
        </div>
        <Clickable onClick={download} className={styles.button}>
          <img src={downloadIcon} alt="" />
          Download QR Code
        </Clickable>
        <Clickable onClick={sendEmail} className={styles.button}>
          <img src={emailIcon} alt="" />
          Email Your QR Code
        </Clickable>
      </div>
    </BottomDrawer>
  );
}

QRCode.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QRCode;
