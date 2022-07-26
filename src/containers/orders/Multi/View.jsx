import React, { useState } from 'react';
import {
  useConfirmedOrders,
  useOrder,
  usePendingOrders,
  useRefresh,
  useSetIds,
  useTransformedShippedOrders
} from 'contexts/orderContext';
import { useToggle } from 'hooks/common';
import { Factory } from 'api';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { ShippingModal } from 'components/orders/ShippingModal';
import { OrderCard } from 'components/orders/multi/OrderCard';
import { Button } from 'phoenix-components';
import checkedIcon from 'assets/images/orders/multi/check.svg';
import unCheckedIcon from 'assets/images/orders/multi/uncheck.svg';
import Alert from 'components/shared/alert/Alert';
import cx from 'classnames';
import EventManager from 'utils/events';
import { useDesktop } from 'contexts/';
import { SideDrawer } from '../../../components/shared/SideDrawer';
import styles from './View.module.css';

function View() {
  const refresh = useRefresh();
  const order = useOrder();
  const pendingOrders = usePendingOrders();
  const confirmedOrders = useConfirmedOrders();
  const shippedOrders = useTransformedShippedOrders();
  const [checkedPenOrders, setCheckedPenOrders] = useState([]);
  const [checkedConOrders, setCheckedConOrders] = useState([]);
  const [grpId, setGrpId] = useState('');
  const [deliveryForm, setDeliveryForm] = useToggle(false);
  const [showError, setShowError] = useToggle(false);
  const setIds = useSetIds();
  const isDesktop = useDesktop();
  const emptyIdErr = 'Oops! You haven\'t ticked the orders you\'d like to proceed with.';

  const readyToShip = async () => {
    if (checkedConOrders.length === 0) {
      setShowError();
      return;
    }
    Factory.getShippingMeta(order?._id, { ids: checkedConOrders })
      .then((res) => {
        setGrpId(res.groupId);
        setDeliveryForm(true);
      })
      .catch(() => {
        SnackBar.show('something went wrong', 'error');
        Loader.hide();
      });
  };

  const isCheckedPen = (id) => checkedPenOrders.includes(id);
  const isCheckedAcc = (id) => checkedConOrders.includes(id);

  const updatePenSelections = (id) => {
    setCheckedPenOrders([]);
    if (isCheckedPen(id)) {
      const others = checkedPenOrders.filter(x => x !== id);
      setCheckedPenOrders(others);
      setIds(others);
      return;
    }
    setCheckedPenOrders(checkedPenOrders.concat(id));
    setIds(checkedPenOrders.concat(id));
  };

  const onReadyToShipClose = async () => {
    setCheckedConOrders([]);
    setDeliveryForm(false);
    await refresh();
  };

  const updateConSelections = (id) => {
    setCheckedConOrders([]);
    if (isCheckedAcc(id)) {
      const others = checkedConOrders.filter(x => x !== id);
      setCheckedConOrders(others);
      setIds(others);
      return;
    }
    setIds(checkedConOrders.concat(id));
    setCheckedConOrders(checkedConOrders.concat(id));
  };

  const acceptOrder = async () => {
    if (checkedPenOrders.length === 0) {
      setShowError();
      return;
    }
    try {
      Loader.show();
      await Factory.confirm(order._id, { ids: checkedPenOrders });
      EventManager.emitEvent('order_accepted', {
        id: order._id,
        length: checkedPenOrders.length,
      });
      await refresh();
      setCheckedPenOrders([]);
      setIds([]);
    } catch (e) {
      console.error(e);
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      {showError && (
        <Alert
          text={emptyIdErr}
          textClass={styles.textClass}
          btnText="Ok"
          onClick={setShowError}
        />
      )}
      {pendingOrders.length > 0 && (
        <>
          <div className={styles.heading}>
            Pending Orders
          </div>
          {pendingOrders.map(x => (
            <div className={styles.flex}>
              <img
                onClick={() => updatePenSelections(x._id)}
                src={isCheckedPen(x._id) ? checkedIcon : unCheckedIcon}
                alt=""
              />
              <OrderCard order={x} type="pending" />
            </div>
          ))}
          <Button
            className={styles.confirmButton}
            fullWidth={true}
            label={`Accept Order${checkedPenOrders.length > 1 ? 's' : ''}`}
            onClick={acceptOrder}
            size="large"
          />
        </>
      )}
      {confirmedOrders.length > 0 && (
        <>
          <div className={cx(styles.heading, styles.divider)}>
            Orders Accepted
          </div>
          {confirmedOrders.map(x => (
            <div className={styles.flex}>
              <img
                onClick={() => updateConSelections(x._id)}
                src={isCheckedAcc(x._id) ? checkedIcon : unCheckedIcon}
                alt=""
              />
              <div>
                <OrderCard order={x} />
              </div>
            </div>
          ))}
          <Button
            className={styles.confirmButton}
            fullWidth={true}
            label="Ready To Ship"
            onClick={readyToShip}
            size="large"
          />
        </>
      )}
      {shippedOrders.length > 0 && (
        <>
          <div className={cx(styles.heading, styles.divider)}>
            Shipped Items
          </div>
          <div className={styles.shipBlock}>
            {shippedOrders.map(x => x.items.map(y => <OrderCard type="shipped" order={y} />))}
          </div>
        </>
      )}
      {deliveryForm && (isDesktop
        ? (
          <SideDrawer
            title="Shipping Type"
            onClose={onReadyToShipClose}
            backButton={true}
          >
            <ShippingModal groupId={grpId} order={order} onClose={onReadyToShipClose} />
          </SideDrawer>
        ) : <ShippingModal groupId={grpId} order={order} onClose={onReadyToShipClose} />)}
    </div>
  );
}

View.propTypes = {
  // onLogin: PropTypes.func.isRequired,
};

export default View;
