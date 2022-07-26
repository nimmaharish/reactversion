import React from 'react';
import { Grid } from '@material-ui/core';
import {
  isOrderCustomerPickUp,
  useOrder,
  usePaymentMode,
  useToAddress,
  useToContactDetails
} from 'contexts/orderContext';
import deleteIcon from 'assets/overview/deleteIcon.svg';
import moment from 'moment';
import { KeyValue } from 'components/orders/v2/KeyValue';
import { addressToString } from 'components/orders/utils';
import { useDesktop } from 'contexts';
import { Clickable } from 'phoenix-components';
import { useRefresh } from 'contexts/orderContext';
import Loader from 'services/loader';
import { Factory } from 'api';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useToggle } from 'hooks/common';
import Snackbar from 'services/snackbar';
import styles from './OrderDetails.module.css';
import cmStyles from './Common.module.css';

export function OrderDetails() {
  const order = useOrder();
  const address = useToAddress();
  const isCustomerPickUp = isOrderCustomerPickUp();
  const contactDetails = useToContactDetails();
  const paymentMode = usePaymentMode();
  const getDetails = isCustomerPickUp ? contactDetails : address;
  const isDesktop = useDesktop();
  const refreshOrder = useRefresh();
  const [openDelete, toggleDelete] = useToggle(false);
  const archive = async () => {
    try {
      Loader.show();
      await Factory.updateStatus(order._id, 'order', 'archived');
      refreshOrder();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Grid container spacing={0}>
          <Grid item xs={12} className={styles.head}>
            <div className={cmStyles.heading}>
              Order Details
            </div>
            {order?.status === 'archived' ? (
              null
            ) : (
              <Clickable
                className={styles.delIcon}
                onClick={toggleDelete}
              >
                <img src={deleteIcon} alt="" />
              </Clickable>
            )}
          </Grid>
          <KeyValue title="Order Number" value={order.orderId} />
          <KeyValue
            title="Order Date"
            value={moment(order.createdAt)
              .format('DD MMM, YYYY')} />
          <KeyValue
            title="Order Total"
            value={`${order.currency} ${order.payable}`}
          />
          <div className={cmStyles.borderBottom} />
          <KeyValue
            title="Shipping Mode"
            value={order?.shipping?.mode || 'Delivery'}
            valueClass="capitalize"
          />
          <KeyValue
            title="Payment Mode"
            value={paymentMode}
          />
        </Grid>
      </div>
      {!isDesktop && (
        <div className={cmStyles.borderBottom} />
      )}
      <div>
        <Grid container spacing={0}>
          <KeyValue
            title="Customer Name"
            value={getDetails?.name}
          />
          {!isCustomerPickUp && (
            <KeyValue title="Address" value={addressToString(address)} />
          )}
        </Grid>
      </div>
      {!isDesktop && (
        <div className={cmStyles.borderBottom} />
      )}
      {openDelete && (
        <DeleteAlert
          title="Are you sure want to delete this order?"
          onCancel={toggleDelete}
          onDelete={() => archive() && toggleDelete()}
        />
      )}
    </div>
  );
}

OrderDetails.propTypes = {};

OrderDetails.defaultProps = {};
