/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Drawer, Dialog } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';
import locationIcon from 'assets/images/orders/details/route.svg';
import { TrackingPopOver } from 'components/orders/TrackingPopOver';
import { Button } from 'phoenix-components';
import Loader from 'services/loader';
import { Factory } from 'api';
import {
  useOrder, useRefresh, useOrderStatus
} from 'contexts/orderContext';
import SnackBar from 'services/snackbar';
import { useDesktop } from 'contexts';
import { CenterButton } from './CenterButton';
import styles from './BottomBar.module.css';

export function BottomBar({ order, groupId }) {
  const enableTracking = _.get(order, 'buttons.enableTracking', false);
  const enableDownloadLabel = _.get(order, 'buttons.enableDownloadLabel', false);

  const enablePickedUp = _.get(order, 'buttons.enableReadyToPickUp', false);
  const enableOutForDelivery = _.get(order, 'buttons.enableOutForDelivery', false);

  const isCancelledOrder = useOrderStatus() === 'cancelled';

  const [popOverEL, setPopOverEl] = useState(null);
  const [, setTagEl] = useState(null);

  const refresh = useRefresh();
  const rootOrder = useOrder();
  const isDesktop = useDesktop();

  const openPopOver = (e) => {
    setPopOverEl(e.currentTarget);
  };

  const closePopOver = () => {
    setPopOverEl(null);
    setTagEl(null);
  };
  const pickedupOrder = async () => {
    try {
      Loader.show();
      await Factory.picked(rootOrder._id, order.groupId);
      await refresh();
    } catch (e) {
      console.error(e);
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  const outForDelivery = async () => {
    try {
      Loader.show();
      await Factory.outForDelivery(rootOrder._id, order.groupId);
      await refresh();
    } catch (e) {
      console.error(e);
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  if (!enableDownloadLabel && !enableTracking && !enablePickedUp && !enableOutForDelivery && !isCancelledOrder) {
    return null;
  }

  return (
    <>
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={!!popOverEL}
          onClose={closePopOver}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {!!popOverEL && (<TrackingPopOver order={order} groupId={groupId} />)}
        </Drawer>
      )}
      {isDesktop && (
        <Dialog
          maxWidth="xs"
          open={!!popOverEL}
          onClose={closePopOver}
        >
          {!!popOverEL && (<TrackingPopOver order={order} groupId={groupId} />)}
        </Dialog>
      )}
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          {enableTracking && (
            <div onClick={openPopOver} className={styles.iconContainer}>
              <img src={locationIcon} alt="" />
              <div className={styles.iconLabel}>Track Order</div>
            </div>
          )}
          {(enableDownloadLabel) && <CenterButton order={order} groupId={groupId} />}
          {(enableOutForDelivery && !isCancelledOrder) && (
            <div className={styles.btn}>
              <Button
                label="Out For Delivery"
                onClick={outForDelivery}
                size="medium"
                fullWidth={true}
              />
            </div>
          )}
          {(enablePickedUp && !isCancelledOrder) && (
            <div className={styles.btn}>
              <Button
                label="Picked Up"
                onClick={pickedupOrder}
                size="medium"
                fullWidth={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

BottomBar.propTypes = {
  order: PropTypes.any.isRequired,
  groupId: PropTypes.string,
};

BottomBar.defaultProps = {
  groupId: '',
};
