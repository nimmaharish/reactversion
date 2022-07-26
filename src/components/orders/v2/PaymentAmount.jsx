import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import {
  Button, Clickable, Radio, ReactInput
} from 'phoenix-components';
import { useShop } from 'contexts';
import cx from 'classnames';
import closeIcon from 'assets/images/orders/list/close.svg';
import styles from './PaymentAmount.module.css';

const CHIPS = [
  {
    label: '25%',
    value: 0.25
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '75%',
    value: 0.75
  },
];

export function PaymentAmount({
  title,
  onClose,
  subTitle,
  amount,
  onSubmit,
}) {
  const [state, setState] = useState('complete');
  const [newAmount, setNewAmount] = useState('');
  const [chip, setChip] = useState('');
  const { currency } = useShop();

  const onAmountChange = val => {
    setNewAmount(val);
    setChip('');
  };

  const onChipClick = val => {
    setChip(val.label);
    setNewAmount((Math.floor(amount * val.value)).toString());
  };

  const onSubmitClick = () => {
    onSubmit(+(state === 'partial' ? newAmount : amount));
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <div className={styles.title}>{title}</div>
            <Clickable
              onClick={onClose}>
              <img src={closeIcon} alt="" />
            </Clickable>
          </div>
          {subTitle && (
            <div className={styles.subTitle}>{subTitle}</div>
          )}
          <div className={styles.payments}>
            <Radio
              inputProps={{
                onChange: () => setState('complete'),
              }}
              label="Complete Payment"
              value="complete"
              selected={state === 'complete'}
            />
            <Radio
              inputProps={{
                onChange: () => setState('partial'),
              }}
              label="Partial Payments"
              value="partial"
              selected={state === 'partial'}
            />
          </div>
          {state === 'complete' && (
            <div className={styles.price}>
              {currency}
              {' '}
              {amount}
            </div>
          )}
          {state === 'partial' && (
            <div>
              <ReactInput
                value={newAmount}
                setValue={onAmountChange}
                type="number"
                label="Enter Amount"
                placeholder={`e.g. ${currency} 100`}
              />
              <div className={styles.chips}>
                {CHIPS.map(ch => (
                  <Clickable
                    key={ch.label}
                    onClick={() => onChipClick(ch)}
                    className={cx(styles.chip, { [styles.selected]: ch.label === chip })}
                  >
                    {ch.label}
                  </Clickable>
                ))}
              </div>
            </div>
          )}
          <div className={styles.button}>
            <Button label="UPDATE STATUS" onClick={onSubmitClick} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

PaymentAmount.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  amount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

PaymentAmount.defaultProps = {
  subTitle: null,
};
