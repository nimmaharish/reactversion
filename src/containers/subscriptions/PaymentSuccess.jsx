import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import paymentIcon from 'assets/images/subscriptions/paymentSuccess.svg';
import { Button } from 'phoenix-components';
import WebView from 'services/webview';
import styles from './PaymentSuccess.module.css';

export function PaymentSuccess({ onClose, id }) {
  return (
    <Dialog open={true} onClose={onClose} fullWidth fullScreen>
      <div className={styles.container}>
        <div className={styles.spacer} />
        <img className={styles.icon} src={paymentIcon} alt="" />
        <div className={styles.heading}>Payment Successful</div>
        <div className={styles.subHeading}>Your payment has been successfully made.</div>
        <div className={styles.txHeading}>
          Transaction number :
          {' '}
          {id}
        </div>
        <div className={styles.spacer} />
        <div className="flexCenter">
          <Button
            label={WebView.isWebView() ? 'Continue' : 'Open App'}
            size="large"
            onClick={onClose}
          />
        </div>
      </div>
    </Dialog>
  );
}

PaymentSuccess.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

PaymentSuccess.defaultProps = {};
