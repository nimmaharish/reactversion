import React from 'react';
import SnackBar from 'services/snackbar';
import { share } from 'utils';
import { LinkBar } from 'phoenix-components/lib/containers';
import {
  useCustomDomain, useIsOnCustomDomain
} from 'contexts';
import { useShop } from 'contexts';
import { useOrder } from 'contexts/orderContext';
import DeviceUtils from '../../utils/deviceUtils';
import styles from './shareTrackingLink.module.css';

export function ShareTrackingLink() {
  const shop = useShop();
  const order = useOrder();
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const value = isCustomDomain ? `${domain}/tracking/${order.orderId}`
    : `mywindo.shop/${shop.slug}/tracking/${order.orderId}`;

  const copyToClipboard = () => {
    DeviceUtils.copy(`https://${value}`);
    SnackBar.show('Shop URL Copied !!!');
  };

  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello
Your order tracking link for order id #${order.orderId} is

https://${value}

Thank you
${shop.name}`);
  };

  return (
    <div className={styles.section}>
      <div className={styles.head}>Share Tracking link</div>
      <div className={styles.link}>
        <LinkBar url={value} onCopy={copyToClipboard} onClick={shareToUser} />
      </div>
    </div>
  );
}

ShareTrackingLink.propTypes = {
};
