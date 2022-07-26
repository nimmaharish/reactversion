import React from 'react';
import { useTrackOrder } from 'hooks';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useOrder } from 'contexts/orderContext';
import { useShop } from 'contexts';
import WebViewUtils from 'services/webviewUtils';
import { Button } from '@material-ui/core';
import SnackBar from 'services/snackbar';
import { Clickable, Badge } from 'phoenix-components';
import copyIcon from 'assets/overview/copy1.svg';
import { mapOrderHistory } from './utils';
import { addressToArray } from './utils';
import styles from './TrackingPopOver.module.css';

export function TrackingPopOver({ order, groupId }) {
  const sellerShips = order?.sellerShips;
  const rootOrder = useOrder();
  const shop = useShop();
  const addressTo = addressToArray(rootOrder?.shipping?.to || {});
  const addressFrom = addressToArray(rootOrder?.shipping?.from || {});
  const [orderHistory] = useTrackOrder(sellerShips ? undefined : rootOrder._id, groupId);

  const showReport = shop?.country?.toLowerCase() === 'india' && orderHistory?.email?.length > 0;

  const history = mapOrderHistory(order, orderHistory.history, orderHistory.edd);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(orderHistory?.vendorIdentifier);
    SnackBar.show('Code Copied !!!');
  };

  const body = `Hi,

I've an issue with the delivery of order #${orderHistory?.vendorIdentifier} as below,
please help me with the resolution at the earliest.

<Your issue here>

Pickup Address

${addressFrom.map(x => x.value).join(',')}

Drop Address:

${addressTo.map(x => x.value).join(',')}

`;

  const url1 = `mailto:${orderHistory?.email}
  ?subject=Delivery Issue for Order #${order?.externalId}&body=${encodeURIComponent(body)}&cc=team@windo.live`;

  return (
    <div className={styles.container}>
      {showReport && (
        <>
          <div className="flexBetween">
            <div className={styles.title}>Tracking Details</div>
            <div className="flexCenter">
              <span className={styles.text}>Have an issue?</span>
              <Clickable
                onClick={WebViewUtils.openUrl(url1)}
              >
                <Badge
                  size="medium"
                  rounded
                  variant="primary"
                >
                  Report
                </Badge>
              </Clickable>
            </div>
          </div>
          <div className={styles.grey1}>
            {`${orderHistory?.partner} : ${orderHistory?.vendorIdentifier}`}
            <span>
              <Button
                className={styles.copyButton}
                onClick={copyToClipboard}>
                <img src={copyIcon} alt="" />
              </Button>
            </span>
          </div>
        </>
      )}
      {!showReport && (
        <div className={styles.title}>
          Tracking Details
        </div>
      )}
      <div className={styles.statusContainer}>
        {history.map(s => (
          <div key={s.status} className={cx(styles.statusBlock, styles[s.color ?? 'yellow'])}>
            <div className={cx(styles.status, styles[s.color ?? 'yellow'])}>
              {s.status}
            </div>
            <div className={styles.note}>
              {s.note}
            </div>
            <div className={styles.date}>
              {s.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TrackingPopOver.propTypes = {
  order: PropTypes.string.isRequired,
  groupId: PropTypes.string,
};

TrackingPopOver.defaultProps = {
  groupId: '',
};
