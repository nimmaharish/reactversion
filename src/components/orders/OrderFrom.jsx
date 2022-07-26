import React from 'react';
import {
  useOrder
} from 'contexts/orderContext';
import cx from 'classnames';
import moment from 'moment';
import { useDesktop } from 'contexts';
import backArrow from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import styles from './OrderFrom.module.css';

export function OrderFrom() {
  const order = useOrder();
  const isDesktop = useDesktop();
  const history = useHistory();
  return (
    !isDesktop
      ? (
        <div className={styles.from}>
          <div className={styles.customHead}> Order From </div>
          <div className={styles.header}>
            {order?.shipping?.to?.name}
          </div>
          <div className={cx(styles.bottom, 'flexStart')}>
            <div className={styles.type}>Order No : </div>
            <div className={styles.value}>{order.orderId}</div>
          </div>
          <div className={cx('flexStart')}>
            <div className={styles.type}>Order Date : </div>
            <div className={styles.value}>{moment(order.createdAt).format('lll')}</div>
          </div>
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.back}>
            <img className={styles.backIconForDesktop} src={backArrow} alt="" onClick={() => history.goBack()} />
            <span className={styles.text}> Orders Details</span>
          </div>
          <div className={styles.from}>
            <div className={styles.customHead}> Order From </div>
            <div className={styles.header}>
              {order?.shipping?.to?.name}
            </div>
            <div className={cx(styles.bottom, 'flexStart')}>
              <div className={styles.type}>Order No : </div>
              <div className={styles.value}>{order.orderId}</div>
            </div>
            <div className={cx('flexStart')}>
              <div className={styles.type}>Order Date : </div>
              <div className={styles.value}>{moment(order.createdAt).format('lll')}</div>
            </div>
          </div>
        </div>
      )
  );
}

OrderFrom.defaultProps = {
};

OrderFrom.propTypes = {
};
