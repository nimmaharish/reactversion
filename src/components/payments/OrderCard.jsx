import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { LightBlueTile } from 'components/cards';
import { Badge } from 'phoenix-components';
import moment from 'moment';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import crIcon from 'assets/images/payments/chevRight.svg';
import { useShop } from 'contexts/userContext';
import { getPaymentStatusLabel } from 'components/orders/v2/statusUtils';
import styles from './OrderCard.module.css';

export function OrderCard({
  order,
  noBorder
}) {
  const history = useHistory();
  const shop = useShop();
  const image = _.get(order, 'images.[0].url', '');
  const queryParams = useQueryParams();

  const onClick = () => {
    queryParams.set('id', order._id);
    history.push({
      pathname: `/orders/${order._id}`,
    });
  };

  const getPsStatus = (item) => getPaymentStatusLabel(item?.status);

  const getPmStatus = (item) => {
    const status = item?.paymentMode?.toLowerCase();
    if (['custompayment'].includes(status)) {
      return 'Custom Payment';
    }
    if (['online'].includes(status)) {
      return 'Online';
    }
    if (['cod'].includes(status)) {
      return 'Cash';
    }
    return status;
  };

  const getClass = (isMode = false) => {
    if (!isMode) {
      return cx(styles.badge, styles.pink);
    }
    return cx(styles.badge, styles.green);
  };

  return (
    <div onClick={onClick} className={cx(styles.root, { [styles.noBorder]: !noBorder })}>
      <LightBlueTile className={styles.container}>
        <div className={styles.top}>
          <div className={styles.left}>
            <img src={image} alt="" />
          </div>
          <div className={styles.right}>
            <div className={styles.orderId}>
              {`Order id : ${order.orderId}`}
            </div>
            <div className={cx(styles.price, 'flexStart')}>
              <div className={cx(styles.currency)}>{shop.currency}</div>
              {' '}
              {order?.amount?.toFixed(2)}
              <div className={styles.date}>
                {moment(order.updatedAt)
                  .format('LL')}
              </div>
            </div>
          </div>
          <img src={crIcon} alt="" />
        </div>
        <div className={cx(styles.statsSection)}>
          <Badge
            size="small"
            className={getClass(true)}
          >
            {getPmStatus(order)}
          </Badge>
          <Badge
            size="small"
            className={getClass(false)}
          >
            {getPsStatus(order)}
          </Badge>
        </div>
      </LightBlueTile>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  noBorder: PropTypes.bool
};

OrderCard.defaultProps = {
  noBorder: true
};
