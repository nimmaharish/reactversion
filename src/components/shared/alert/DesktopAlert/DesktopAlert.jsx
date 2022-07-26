/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog
} from '@material-ui/core';
import { Button as MuiButton } from '@material-ui/core';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import { Button } from 'phoenix-components';
import { useHistory } from 'react-router-dom';
import headerIcon from 'assets/v2/models/header.svg';
import WebViewUtils from 'services/webviewUtils';
import whatsappIcon from 'assets/v2/contact/waFaq.svg';
import emailIcon from 'assets/v2/contact/emFaq.svg';
import WebView from 'services/webview';
import styles from './DesktopAlert.module.css';

function DesktopAlert({
  type,
}) {
  const isDesktop = useDesktop();
  const history = useHistory();

  const url = 'https://api.whatsapp.com/send/?phone=+918309690218&text=';
  const url1 = 'mailto:team@windo.live';

  const openWhatsapp = (e) => {
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  const values = {
    desktop: {
      heading: 'Thanks for being here! Please upgrade your plan to access WINDO for PC',
      body: 'With our Blossom or Garden plan, '
        + 'get free access to WINDO for PC + an exciting bouquet of other premium features.'
    }
  };

  const { heading, body } = values[type];

  return (
    <Dialog
      open={true}
      onClose={() => {}}
      fullWidth
      maxWidth={isDesktop ? 'sm' : 'sm'}
    >
      <div className={styles.header}>
        <img className={styles.headerIcon} src={headerIcon} alt="" />
      </div>
      <div className={styles.heading}>
        {heading}
      </div>
      <div className={styles.body}>
        {body}
      </div>
      <div className={cx(styles.btn, 'flexCenter')}>
        <Button
          label="Upgrade To Premium"
          onClick={() => history.push('/subscriptions')}
          size="medium"
          fullWidth={!isDesktop}
        />
      </div>
      <div className={styles.contact}>
        <div className={styles.label}>
          Need Help? Contact Us
        </div>
        <div className="flexCenter">
          <MuiButton
            href={url1}
            target="_blank"
            onClick={WebViewUtils.openUrl('mailto:team@windo.live')}
            className={styles.yes}
          >
            <div className={styles.iconContainer}>
              <div className={styles.icon}>
                <img src={emailIcon} alt="" />
                <div> Email Us </div>
              </div>
            </div>
          </MuiButton>
          <div className={styles.no}></div>
          <MuiButton
            href={url}
            target="_blank"
            onClick={openWhatsapp}
            className={styles.yes}
          >
            <div className={styles.iconContainer}>
              <div className={styles.icon}>
                <img src={whatsappIcon} alt="" />
                <div> Whatsapp </div>
              </div>
            </div>
          </MuiButton>
        </div>
      </div>
    </Dialog>
  );
}

DesktopAlert.propTypes = {
  type: PropTypes.string.isRequired,
};

export default DesktopAlert;
