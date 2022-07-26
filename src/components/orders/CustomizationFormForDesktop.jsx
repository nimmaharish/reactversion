import React, { useState } from 'react';
import { useOrder, useRefresh } from 'contexts/orderContext';
import { Grid } from '@material-ui/core';
import { get } from 'lodash';
import SnackBar from 'services/snackbar';
import { Factory } from 'api';
import { Button, Radio, ReactInput } from 'phoenix-components';
import Loader from 'services/loader';
import {
  Dialog, DialogContent
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './CustomizationForm.module.css';
import { CenterButton } from './CenterButton';

export function CustomizationFormForDesktop({ orderDetails }) {
  const order = useOrder();
  const [enable, setEnable] = useState('no');
  const [openPopup, setOpenPopup] = useState(false);
  const enabled = get(order, 'buttons.enableCustomization', false);
  const refresh = useRefresh();
  const [price, setPrice] = useState('');

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

  const onClose = () => {
    setEnable('no');
    setOpenPopup(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Want to add additional customization charges?
      </div>
      <Grid container spacing={2} justify="center">
        <Grid item xs={3} className={styles.customization}>
          <Radio
            label="Yes"
            value="yes"
            selected={enable === 'yes'}
            inputProps={{
              onChange: (e) => { setEnable(e.target.value); setOpenPopup(true); }
            }}
          />
        </Grid>
        <Grid item xs={3} className={styles.customization}>
          <Radio
            label="No"
            value="no"
            selected={enable === 'no'}
            inputProps={{
              onChange: (e) => setEnable(e.target.value)
            }}
          />
        </Grid>
      </Grid>
      {enable === 'yes'
          && (
            <Dialog open={openPopup} onClose={onClose} className={styles.popup}>
              <DialogContent>
                <div className={styles.subTitle}>
                  Add Customization fee
                </div>
                <div className={styles.form}>
                  <div className={styles.formTitle}>
                    Customization Fee
                  </div>
                  <ReactInput
                    value={price}
                    setValue={p => setPrice(p)}
                    type="number"
                    inputClass={styles.formInput}
                  />
                  <Button
                    label="Add"
                    onClick={onClick}
                    size="small"
                  />
                </div>
                {order.status !== 'cancelled' && <CenterButton groupId={orderDetails.groupId} />}
              </DialogContent>
            </Dialog>
          )}
    </div>
  );
}

CustomizationFormForDesktop.propTypes = {
  orderDetails: PropTypes.any
};

CustomizationFormForDesktop.defaultProps = {
  orderDetails: {}
};
