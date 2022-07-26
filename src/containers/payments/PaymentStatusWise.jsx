import React from 'react';
import { get } from 'lodash';
import { useShop } from 'contexts/userContext';
import { usePaymentStats } from 'hooks';
import PropTypes from 'prop-types';
import styles from './PaymentStatusWise.module.css';

function PaymentStatusWise({ psFilters }) {
  const { currency } = useShop();
  const [, summary] = usePaymentStats(null, psFilters, null);
  const items = [
    { label: 'Paid', value: get(summary, 'paid', 0) },
    { label: 'Received', value: get(summary, 'received', 0) },
    { label: 'Failed', value: get(summary, 'failed', 0) },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.head}> Payment Status Wise </div>
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
    </div>
  );
}

PaymentStatusWise.propTypes = {
  psFilters: PropTypes.object.isRequired
};

PaymentStatusWise.defaultProps = {};

export default PaymentStatusWise;
