import React from 'react';
import PropTypes from 'prop-types';
import styles from 'components/overview/OrderTile.module.css';
import _ from 'lodash';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { useShop } from 'contexts/userContext';
import { longDateFormat } from 'utils';

export function OrderTile({ order, variant, dot }) {
  const history = useHistory();
  const url = _.get(order, 'images[0].url', '');
  const shop = useShop();
  const date = longDateFormat(order.createdAt);

  const onClick = () => {
    history.push(`/orders/${order._id}`);
  };

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.left}>
        <img src={url} alt="..." />
      </div>
      <div className={styles.center}>
        <div className={styles.line1}>
          <div className={styles.productTitle}>{order?.title}</div>
          {dot && <div className={styles.greenDot} />}
        </div>
        <div className={styles.line2}>
          Order id #
          {order.orderId}
        </div>
        <div className={styles.line3}>
          <div className={cx(styles.button, styles[variant])}>
            {order.status}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.line1}>
          {shop.currency}
          {' '}
          {order.payable}
        </div>
        <div className={styles.line2}>
          1 Qty
        </div>
        <div className={cx(styles.line3, styles.date)}>
          {date}
        </div>
      </div>
    </div>
  );
}

OrderTile.propTypes = {
  order: PropTypes.object.isRequired,
  variant: PropTypes.string,
  dot: PropTypes.bool,
};

OrderTile.defaultProps = {
  variant: 'primary',
  dot: false,
};
