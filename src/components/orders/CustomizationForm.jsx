import React, { useState } from 'react';
import { useOrder, useRefresh } from 'contexts/orderContext';
import { get } from 'lodash';
import SnackBar from 'services/snackbar';
import { Factory } from 'api';
import { Button, Clickable, ReactInput } from 'phoenix-components';
import Loader from 'services/loader';
import PropTypes from 'prop-types';
import closeIcon from 'assets/images/orders/list/close.svg';
import { Dialog } from '@material-ui/core';
import { useToggle } from 'hooks/common';
import styles from './CustomizationForm.module.css';

export function CustomizationForm() {
  const order = useOrder();
  const enabled = get(order, 'buttons.enableCustomization', false);
  const refresh = useRefresh();
  const [price, setPrice] = useState('');
  const [open, toggleOpen] = useToggle();

  if (!enabled) {
    return null;
  }

  const onClick = async () => {
    const value = parseFloat(price) || 0;
    if (value <= 0) {
      SnackBar.show('Invalid Price, It should be greater than 0', 'error');
      return;
    }
    try {
      Loader.show();
      await Factory.addCharge(order._id, { price: value });
    } catch (e) {
      console.error(e);
      SnackBar.show('Something went wrong please try again', 'error');
    } finally {
      setTimeout(async () => {
        Loader.hide();
        await refresh();
      }, 1000);
    }
  };

  if (!open) {
    return (
      <div className={styles.chargeButton}>
        <span>Have </span>
        <Clickable className={styles.click} onClick={toggleOpen}>
          Customization charges?
        </Clickable>
      </div>
    );
  }

  return (
    <Dialog
      maxWidth="xs"
      open={true}
      onClose={toggleOpen}
      fullWidth
    >
      <div className={styles.section}>
        <div className="flexEnd">
          <Clickable
            onClick={toggleOpen}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
        <div className={styles.label}>
          Add customization fee
        </div>
        <div className={styles.container}>
          <div className={styles.form}>
            <ReactInput
              value={price}
              setValue={p => setPrice(p)}
              type="number"
              label="Customization Fee"
              placeholder="e.g. 100"
            />
            <Button
              label="Add"
              onClick={onClick}
              size="large"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

CustomizationForm.propTypes = {
  onBack: PropTypes.func,
};

CustomizationForm.defaultProps = {
  onBack: null
};
