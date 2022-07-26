import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormikInput } from 'phoenix-components';
import { Switch } from 'phoenix-components/lib/formik';
import chevUp from 'assets/v2/orders/chevUpPrimary.svg';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import { useToggle } from 'hooks/common';
import { useField } from 'formik';
import styles from './ShippingCard.module.css';

export default function ShippingCard({
  index
}) {
  const [{ value: mode }] = useField(`[${index}]`);
  const [viewForm, toggleForm] = useToggle(false);
  const modeEnabled = mode?.chargeEnabled;

  return (
    <div className={styles.container}>
      <div className={cx('flexBetween')}>
        <p className={styles.modeTitle}>{mode?.title}</p>
        <div
          className={cx('flexBetween')}
        >
          <p className={cx(modeEnabled ? styles.activeText : styles.inActiveText)}>
            {modeEnabled ? 'Active' : 'Inactive'}
          </p>
          <Switch
            name={`[${index}].chargeEnabled`}
          />
        </div>
      </div>
      <div className={cx('flexBetween')}>
        <div className={cx(styles.shippingType)}>
          <p className={styles.shippingTypeTitle}>Shipping Type</p>
          <p className={styles.modeType}>{mode?.type}</p>
        </div>
        <img
          className={styles.chevIcon}
          src={viewForm ? chevUp : chevDown}
          onClick={toggleForm}
          alt="" />
      </div>
      {viewForm && (
        <div>
          <div className={styles.inputContainer}>
            <FormikInput
              name={`[${index}].orderValue.min`}
              label="Minimum order value"
              type="number"
              placeholder="1000"
            />
          </div>
          <div className={styles.inputContainer}>
            <FormikInput
              name={`[${index}].orderValue.max`}
              label="Max order value"
              type="number"
              placeholder="5000"
            />
          </div>
          <div className={styles.inputContainer}>
            <FormikInput
              name={`[${index}].charge`}
              label="Delivery Charge"
              type="number"
              placeholder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

ShippingCard.propTypes = {
  index: PropTypes.number.isRequired
};
