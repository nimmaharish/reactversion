import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import Loader from 'services/loader';
import { Factory } from 'api';
import Snackbar from 'services/snackbar';
import { useOrder, useRefresh } from 'contexts/orderContext';
import { ORDER_STATUS_LIST } from './statusUtils';
import { CommonStatusDrawer } from './CommonStatusDrawer';

export function OrderStatusDrawer({
  onClose,
  items
}) {
  const [note, setNote] = useState('');
  const [cancelAlert, toggleCancelAlert] = useToggle();
  const refreshOrder = useRefresh();
  const order = useOrder();

  const onUpdate = async (status, nt) => {
    setNote(nt);
    if (status === 'cancelled') {
      toggleCancelAlert();
      return;
    }
    try {
      Loader.show();
      await Factory.updateStatus(order._id, 'order', status, items.map(item => item._id), nt, {});
      refreshOrder();
      onClose();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onCancel = async () => {
    toggleCancelAlert();
    try {
      Loader.show();
      await Factory.updateStatus(order._id, 'order', 'cancelled', items.map(item => item._id), note, {}, []);
      refreshOrder();
      onClose();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      {cancelAlert && (
        <DeleteAlert
          primary="YES"
          secondary="No"
          title="Oops! Are you sure want to cancel this order?"
          onCancel={toggleCancelAlert}
          onDelete={onCancel}
        />
      )}
      <CommonStatusDrawer
        statusList={ORDER_STATUS_LIST}
        onSubmit={onUpdate}
        onClose={onClose}
        title="Order Status"
      />
    </>
  );
}

OrderStatusDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

OrderStatusDrawer.defaultProps = {};
