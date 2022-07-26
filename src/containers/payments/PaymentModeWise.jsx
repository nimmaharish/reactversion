import React from 'react';
import { get, isEmpty } from 'lodash';
import { usePaymentStats } from 'hooks';
import { useShop } from 'contexts/userContext';
import {
  usePaymentRules
} from 'contexts/userContext';
import PropTypes from 'prop-types';
import Accordion from 'components/orders/Accordion';
import { psFilterList } from './utils';
import styles from './PaymentModeWise.module.css';

function PaymentModeWise({ pmFilters }) {
  console.log('--->summary pm-->', pmFilters);
  const { currency } = useShop();
  const paymentRules = usePaymentRules(true);
  const { modes, ...others } = pmFilters;
  const isEmptyFilters = isEmpty(modes);

  const all = paymentRules.map(x => ({
    label: x.name,
    value: x.value
  }));

  if (isEmptyFilters) {
    const items = all.map(y => {
      const paymentMode = paymentRules.find(x => x.value === y.value);
      const isOnline = paymentMode.type === 'online';
      const isCustomPayment = paymentMode.type === 'customPayment';
      const filter = {
        'payments.paymentMode': isCustomPayment ? 'custompayment' : paymentMode.type,
      };
      if (isOnline) {
        filter['payments.vendor'] = paymentMode.value;
      }
      if (isCustomPayment) {
        filter['payments.customPaymentDetails.mode'] = paymentMode.name;
      }
      return filter;
    });
    if (!isEmpty(items)) {
      pmFilters = { modes: items, ...others };
    }
  }

  const [, , summary] = usePaymentStats(null, null, pmFilters);

  const appliedFilterLabels = (value) => {
    const pm = all.find(x => x.value === value);
    if (pm) {
      return pm.label;
    }
    const ps = psFilterList.find(x => x.value === value);
    if (ps) {
      return ps.label;
    }
    return value;
  };

  const items = (item) => [
    { label: 'Total Income', value: get(item, 'total', 0) },
    { label: 'Item Total', value: get(item, 'itemTotal', 0) },
    { label: 'Shipping Total', value: get(item, 'shippingTotal', 0) },
    { label: 'Other Fees Total', value: get(item, 'itemTotal', 0) },
    { label: 'Discount Coupons Total', value: get(item, 'discountCoupons', 0) },
  ];

  const detail = (x) => (
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
  );

  return (
    <div className={styles.container}>
      <div className={styles.head}> Payment Mode Wise </div>
      {summary?.map((x, index) => (
        <>
          {appliedFilterLabels(x.name) ? (
            <Accordion
              mainStyle={styles.accordionMain}
              headStyle={styles.accordionHead}
              bodyStyle={styles.accordionBody}
              label={appliedFilterLabels(x.name)}
              showDefault={index === 0}
            >
              {items(x).map(y => detail(y))}
            </Accordion>
          ) : items(x).map(y => detail(y))}
        </>
      ))}
    </div>
  );
}

PaymentModeWise.propTypes = {
  pmFilters: PropTypes.object.isRequired
};

PaymentModeWise.defaultProps = {};

export default PaymentModeWise;
