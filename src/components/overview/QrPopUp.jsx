/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import {
  Dialog,
} from '@material-ui/core';
import React, { createRef } from 'react';
import ReactQRCode from 'qrcode.react';
import { Clickable } from 'phoenix-components';
import downloadIcon from 'assets/images/orders/details/download.svg';
import closeIcon from 'assets/images/orders/details/close.svg';
import emailIcon from 'assets/images/email.svg';
import SnackBar from 'services/snackbar';
import {
  Card, CardContent,
} from '@material-ui/core';
import Loader from 'services/loader';
import WebView from 'services/webview';
import { Becca } from 'api';
import styles from './QRCode.module.css';

function QrPopUp({
  url,
  onClose
}) {
  const ref = createRef();
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
  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <div className={styles.card}>
        <Card>
          <CardContent>
            <div className={styles.top}>
              <Clickable onClick={onClose} className={styles.closeButton}>
                <img src={closeIcon} alt="" />
              </Clickable>
              <div className={styles.header}>Your shop QR code</div>
            </div>
            <div className={styles.container}>
              <div className={styles.qrCode} ref={ref}>
                <ReactQRCode ref={ref} value={url} />
              </div>
              <div className={styles.bottom}>
                <Clickable onClick={download} className={styles.button1}>
                  <img src={downloadIcon} alt="" className={styles.image} />
                  Download QR Code
                </Clickable>
                <div className={styles.line}></div>
                <Clickable onClick={sendEmail} className={styles.button1}>
                  <img src={emailIcon} alt="" className={styles.image} />
                  Email Your QR Code
                </Clickable>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
}

QrPopUp.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

QrPopUp.defaultProps = {
};

export default QrPopUp;
