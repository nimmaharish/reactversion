import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { Switch } from 'phoenix-components/lib/formik';
import { Clickable, FormikInput } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import { useShop } from 'contexts';
import cx from 'classnames';
import chevUpIcon from 'assets/v2/settings/paymentModes/chevUp.svg';
import chevDownIcon from 'assets/v2/settings/paymentModes/chevDown.svg';
import styles from './PaymentRuleCard.module.css';
import { FEE_TYPES, getRuleSubString, VALUE_TYPES } from './paymentRuleUtils';

export function PaymentRuleCard({ index, partial }) {
  const shop = useShop();
  const [{ value }] = useField(`[${index}]`);
  const [,, { setValue: setEnabled }] = useField(`[${index}].enabled`);
  const [{ value: feeType }, , { setValue: setFeeType }] = useField(`[${index}].advanced.feeType`);
  const [{ value: type }, , { setValue: setType }] = useField(`[${index}].advanced.type`);
  const [open, toggleOpen] = useToggle();
  const [openAccordion, toggleAccordion] = useToggle();
  const [openPartialCODAccordion, togglePartialCODAccordion] = useToggle();

  const onChange = (e, value) => {
    e.stopPropagation();
    setEnabled(value);
    if (!open && value) {
      toggleOpen();
    }
  };

  const subStr = getRuleSubString(shop.currency, value);

  return (
    <div className={styles.container}>
      <Clickable className={styles.top} onClick={toggleOpen}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            {value.name}
          </div>
          <div className={styles.subTitle}>
            {subStr}
          </div>
        </div>
        <div>
          <Switch name={`[${index}].enabled`} onChange={onChange} />
          <div className={styles.chevron}>
            <img src={open ? chevUpIcon : chevDownIcon} alt="" />
          </div>
        </div>
      </Clickable>
      {open && (
        <>
          <div className={styles.subContainer}>
            <FormikInput
              name={`[${index}].cartValue.min`}
              label="Minimum Cart Value (Optional)"
              placeholder={`e.g. ${shop.currency} 1000`}
              type="number"
            />
            <FormikInput
              name={`[${index}].cartValue.max`}
              label="Maximum Cart Value (Optional)"
              placeholder={`e.g. ${shop.currency} 5000`}
              type="number"
            />
          </div>
          <div className={styles.accordion}>
            <Clickable className={styles.accordionTop} onClick={toggleAccordion}>
              <div className={styles.heading}>Advanced Rules</div>
              <img src={openAccordion ? chevUpIcon : chevDownIcon} alt="" />
            </Clickable>
            {openAccordion && (
              <div>
                <div className={styles.column}>
                  <div className={styles.row}>
                    {FEE_TYPES.map(fee => (
                      <Clickable
                        key={fee.value}
                        className={cx(styles.tabLined, { [styles.active]: feeType === fee.value })}
                        onClick={() => setFeeType(fee.value)}
                      >
                        {fee.name}
                      </Clickable>
                    ))}
                  </div>
                  <div className={cx(styles.row, styles.row2)}>
                    {VALUE_TYPES.map(val => (
                      <Clickable
                        key={val.value}
                        className={cx(styles.tabBlocked, { [styles.active]: type === val.value })}
                        onClick={() => setType(val.value)}
                      >
                        {val.name}
                      </Clickable>
                    ))}
                  </div>
                </div>
                <div className={styles.margin12}>
                  <FormikInput
                    name={`[${index}].advanced.value`}
                    label={type === 'percentage' ? 'Percentage Value' : 'Amount'}
                    placeholder={type === 'percentage' ? 'e.g. 5%' : 'e.g. 50'}
                    type="number"
                  />
                  {type === 'percentage' && (
                    <FormikInput
                      name={`[${index}].advanced.maxValue`}
                      label="Maximum Amount"
                      placeholder="e.g. 50"
                      type="number"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {partial && (
            <div className={styles.accordion}>
              <Clickable className={styles.accordionTop} onClick={togglePartialCODAccordion}>
                <div className={styles.heading}>Partial Advance Amount</div>
                <img src={openPartialCODAccordion ? chevUpIcon : chevDownIcon} alt="" />
              </Clickable>
              {openPartialCODAccordion && (
                <div className={styles.marginTop}>
                  <div className={styles.margin12}>
                    <FormikInput
                      name={`[${index}].partial.value`}
                      label="Percentage Value"
                      placeholder="e.g. 5%"
                      type="number"
                    />
                    <FormikInput
                      name={`[${index}].partial.maxValue`}
                      label="Maximum Amount (optional)"
                      placeholder="e.g. 50"
                      type="number"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

PaymentRuleCard.propTypes = {
  index: PropTypes.number.isRequired,
  partial: PropTypes.bool,
};

PaymentRuleCard.defaultProps = {
  partial: false
};

PaymentRuleCard.defaultProps = {};
