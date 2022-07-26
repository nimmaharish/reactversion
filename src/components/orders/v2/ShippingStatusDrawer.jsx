import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';
import { Factory } from 'api';
import { useOrder, useRefresh } from 'contexts/orderContext';
import _ from 'lodash';
import { useToggle } from 'hooks/common';
import Alert from 'components/shared/alert/Alert';
import { ShippingModal } from 'components/orders/ShippingModal';
import { SHIPPING_STATUS_LIST } from './statusUtils';
import { CommonStatusDrawer } from './CommonStatusDrawer';

export function ShippingStatusDrawer({
  onClose,
  items
}) {
  const [openAlert, toggleAlert] = useToggle();
  const refreshOrder = useRefresh();
  const [groupId, setGroupId] = useState(null);
  const order = useOrder();

  const onUpdate = async (status, nt, digitalProducts) => {
    try {
      Loader.show();
      await Factory.updateStatus(
        order._id, 'shipping', status, items.map(item => item._id), nt, {}, digitalProducts
      );
      refreshOrder();
      onClose();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onStartShipping = async () => {
    const shippedItems = new Set(_.flatten(order.groups.shipped.map(g => g.items.map(i => i._id))));
    const alreadyShippedItems = items.filter(i => shippedItems.has(i));
    if (alreadyShippedItems.length > 0) {
      toggleAlert();
      return;
    }
    try {
      const data = await Factory.getShippingMeta(order?._id, { ids: items.map(item => item._id) });
      setGroupId(data.groupId);
      refreshOrder();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      {openAlert && (
        <Alert
          btnText="Ok"
          text="Some items are already shipped. Unselect the items that are shipped and try again."
          onClick={toggleAlert}
        />
      )}
      {groupId && (
        <ShippingModal groupId={groupId} order={order} onClose={onClose} />
      )}
      <CommonStatusDrawer
        statusList={SHIPPING_STATUS_LIST}
        onSubmit={onUpdate}
        onClose={onClose}
        title="Shipping Status"
        showStartShipping={true}
        onStartShipping={onStartShipping}
        items={items}
      />
    </>
  );
}

ShippingStatusDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

ShippingStatusDrawer.defaultProps = {};
