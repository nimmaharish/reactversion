import React from 'react';
import {
  isOrderCustomerPickUp, useToAddress, useToContactDetails, isDigitalOrder
} from 'contexts/orderContext';
import cx from 'classnames';
import { LightBlueTile } from 'components/cards';
import { useDesktop } from 'contexts';
import { Clickable } from 'phoenix-components';
import whatsAppIcon from 'assets/images/orders/details/whatsapp.svg';
import emailIcon from 'assets/images/orders/details/emailC.svg';
import phoneIcon from 'assets/images/orders/details/phone.svg';
import WebView from 'services/webview';
import { addressToArray, contactDetailsToArray } from './utils';
import styles from './CustomerDetails.module.css';

export function CustomerDetails() {
  const address = addressToArray(useToAddress());
  const isDesktop = useDesktop();
  const isCustomerPickUp = isOrderCustomerPickUp();
  const contactDetails = contactDetailsToArray(useToContactDetails());
  const getDetails = isCustomerPickUp || isDigitalOrder() ? contactDetails : address;

  const { value: phone } = getDetails.find(x => x.name === 'Mobile Number') || {};
  const { value: email } = getDetails.find(x => x.name === 'Email') || {};

  const openWhatsapp = () => {
    if (!phone) {
      return;
    }
    const url = `https://wa.me/${phone.replace(/\s/g, '')}`;
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openPhone = () => {
    if (!phone) {
      return;
    }
    const url = `tel:${phone.replace(/\s/g, '')}`;
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openEmail = () => {
    if (!email) {
      return;
    }
    const url = `mailto:${email}`;
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={isDesktop ? styles.desktopBox : null}>
        <div className={styles.row}>
          <div className={styles.title}>Customer Details</div>
          <div>
            {phone && (
              <Clickable onClick={openWhatsapp}>
                <img src={whatsAppIcon} className={styles.img} alt="" />
              </Clickable>
            )}
            {email && (
              <Clickable onClick={openEmail}>
                <img src={emailIcon} className={styles.img} alt="" />
              </Clickable>
            )}
            {phone && (
              <Clickable onClick={openPhone}>
                <img src={phoneIcon} className={styles.img} alt="" />
              </Clickable>
            )}
          </div>
        </div>
        <LightBlueTile className={styles.address}>
          {getDetails.map(({
            name,
            value
          }) => (
            <div key={name} className={cx(styles.row)}>
              <div className={styles.name}>{name}</div>
              <div className={styles.value}>{name === 'Country' ? value.toUpperCase() : value}</div>
            </div>
          ))}
        </LightBlueTile>
      </div>
    </div>
  );
}
