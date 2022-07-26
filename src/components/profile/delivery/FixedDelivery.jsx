import React from 'react';
import { useField } from 'formik';
import { useShop } from 'contexts';
import { FormikInput } from 'phoenix-components';
import { DeliveryType } from './utils';
import styles from './Delivery.module.css';

export function FixedDelivery() {
  const shop = useShop();
  const [{ value }] = useField('chargeType');
  if (value !== DeliveryType.FIXED) {
    return null;
  }

  return (
    <div>
      <div className={styles.paddingBottom}>
        <FormikInput
          name="fixed.charges"
          label="Fixed Delivery Charge"
          type="number"
          placeholder={`${shop.currency} 200`}
        />
      </div>
      <div className={styles.paddingBottom}>
        <FormikInput
          name="fixed.freeDeliveryValue"
          label="Free Delivery Above Order Value (Optional)"
          placeholder={`${shop.currency} 2000`}
        />
      </div>
    </div>
  );
}

FixedDelivery.propTypes = {};

FixedDelivery.defaultProps = {};
