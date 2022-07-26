import React from 'react';
import cx from 'classnames';
import { get } from 'lodash';
import { useShop } from 'contexts/userContext';
import { usePaymentStats } from 'hooks';
import PropTypes from 'prop-types';
import styles from './Summary.module.css';

function Summary({ dateFilters }) {
  console.log('--->summary-->', dateFilters);
  const [summary = {}] = usePaymentStats(dateFilters);
  const { currency } = useShop();

  const items = [
    { label: 'Item Total', value: get(summary, 'itemTotal', 0) },
    { label: 'Shipping Total', value: get(summary, 'shippingTotal', 0) },
    { label: 'Other Fees Total', value: get(summary, 'otherChargesTotal', 0) },
    { label: 'Discount Coupons Total', value: get(summary, 'discountCoupons', 0) },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.head}> Summary </div>
      {items.map(x => (
        <div className={styles.detail}>
          <div className={styles.key}>
            {' '}
            {x.label}
            {' '}
          </div>
          <div className={styles.value}>
            {' '}
            {`${currency} ${x.value}`}
            {' '}
          </div>
        </div>
      ))}
      <div className={cx(styles.detail, styles.border)}>
        <div className={cx(styles.key, styles.primary)}>
          Total Income
        </div>
        <div className={cx(styles.value, styles.primary)}>
          {`${currency} ${get(summary, 'total', 0)}`}
        </div>
      </div>
    </div>
  );
}

Summary.propTypes = {
  dateFilters: PropTypes.object.isRequired
};

Summary.defaultProps = {};

export default Summary;
