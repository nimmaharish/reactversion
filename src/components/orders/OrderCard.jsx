import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import moment from 'moment';
import { useShop } from 'contexts/userContext';
import multiIcon from 'assets/images/orders/multi/multi.svg';
import fIcon from 'assets/images/orders/list/bag.svg';
import tIcon from 'assets/images/orders/list/rocket.svg';
import thIcon from 'assets/images/orders/list/payment.svg';
import crIcon from 'assets/images/payments/chevRight.svg';
import { useOpenPlans } from 'contexts';
import { Clickable } from 'phoenix-components';
import cx from 'classnames';
import { useToggle } from 'hooks/common';
import { getOrderStatusLabel, getPaymentStatusLabel, getShippingStatusLabel } from 'components/orders/v2/statusUtils';
import styles from './OrderCard.module.css';

const UpdateDrawer = lazy(() => import(/* webpackChunkName: "order-update-drawer" */
  'components/orders/v2/UpdateButtonDrawer'
));

export function OrderCard({
  order,
  showAlert = false,
  noPadding,
  showBorder,
  refresh,
}) {
  const history = useHistory();
  const shop = useShop();
  const image = _.get(order, 'images[0].url', '');
  const queryParams = useQueryParams();
  const openPlans = useOpenPlans(false, 'abandonCart');
  const isNotMulti = _.get(order, 'items', 1) === 1;
  const [open, toggleOpen] = useToggle();

  const getClass = (type = 0) => {
    if (type === 1) {
      return cx(styles.badge, styles.pink);
    }
    if (type === 2) {
      return cx(styles.badge, styles.blue);
    }
    return cx(styles.badge, styles.green);
  };

  const getIconClass = (type = 0) => {
    if (type === 1) {
      return cx(styles.icon, styles.pink1);
    }
    if (type === 2) {
      return cx(styles.icon, styles.blue1);
    }
    return cx(styles.icon, styles.green1);
  };

  const onClick = () => {
    if (showAlert) {
      openPlans();
      return;
    }
    queryParams.set('id', order._id);
    history.push({
      pathname: `/orders/${order._id}`,
    });
  };

  const isMultiItem = order.items > 1;

  const onCloseDrawer = () => {
    toggleOpen();
    refresh();
  };

  return (
    <>
      {open && (
        <UpdateDrawer
          id={order._id}
          onClose={onCloseDrawer}
        />
      )}
      <Clickable
        onClick={onClick}
        className={cx(styles.root, {
          [styles.noPadding]: noPadding,
          [styles.border]: showBorder,
          [styles.noBorder]: !showBorder
        })}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.left}>
              <img src={image} alt="" loading="lazy" />
              {order.items > 1 && <div className={styles.multi}>{`+${order.items - 1}`}</div>}
            </div>
            <div className={styles.column}>
              <div className={styles.row}>
                <div className={styles.title} translate="no">
                  {order.title}
                </div>
                {order?.status === 'archived' ? (
                  null
                ) : (
                  <Clickable
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOpen();
                    }}
                    className={styles.update}
                  >
                    UPDATE
                  </Clickable>
                )}
              </div>
              <div className={styles.row}>
                <div className={styles.orderId}>
                  {order.orderId}
                </div>
                <div className={styles.dot} />
                <div className={styles.date}>
                  {moment(order.createdAt)
                    .format('ll')}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.price}>
                  {shop.currency}
                  {' '}
                  {order.payable.toFixed(2)}
                </div>
                {!isMultiItem && order?.variant?.value?.length > 0 && order?.variant?.name?.length > 0 && (
                  <div className={styles.price}>
                    <span>
                      {order?.variant?.value || ''}
                      {' '}
                      {order?.variant?.name || ''}
                    </span>
                  </div>
                )}
                {isMultiItem && order.status !== 'payment pending' && (
                  <span className={styles.multiItem}>
                    <img src={multiIcon} alt="" />
                    Multi Item
                  </span>
                )}
                {!isMultiItem && (
                  <div className={styles.price}>
                    {order.quantity}
                    {' '}
                    Qty
                  </div>
                )}
                <img className={styles.view} src={crIcon} alt="" />
              </div>
            </div>
          </div>
          {isNotMulti && (
            <div className={cx(styles.statsSection)}>
              <div
                size="small"
                className={getClass(0)}
              >
                <div className={getIconClass(0)}><img src={thIcon} alt="" /></div>
                <div className={styles.text}>
                  {getOrderStatusLabel(order.orderStatus)}
                </div>
              </div>
              <div
                size="small"
                className={getClass(1)}
              >
                <div className={getIconClass(1)}><img src={tIcon} alt="" /></div>
                <div className={styles.text}>
                  {getShippingStatusLabel(order.shippingStatus)}
                </div>
              </div>
              <div
                size="small"
                className={getClass(2)}
              >
                <div className={getIconClass(2)}><img src={fIcon} alt="" /></div>
                <div className={styles.text}>
                  {getPaymentStatusLabel(order.paymentStatus)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Clickable>
    </>
  );
}

OrderCard.defaultProps = {
  showAlert: false,
  noPadding: false,
  showBorder: false,
  refresh: () => {
  },
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  showAlert: PropTypes.bool,
  noPadding: PropTypes.bool,
  showBorder: PropTypes.bool,
  refresh: PropTypes.func,
};

OrderCard.defaultProps = {};
