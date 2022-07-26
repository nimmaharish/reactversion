import React, { useState } from 'react';
import {
  isOnlyPending,
  useEnableMarkAsPaid, useIsCod,
  useOrder,
  usePendingOrders,
  useRefresh,
  useSetIds,
  useEnableCustomization,
  useEnableAccept
} from 'contexts/orderContext';
import Multi from 'containers/orders/Multi/View';
import checkedIcon from 'assets/images/orders/multi/check.svg';
import unCheckedIcon from 'assets/images/orders/multi/uncheck.svg';
import { OrderCard } from 'components/orders/multi/OrderCard';
import { SettlementAndShippingDetails } from 'components/orders/SettlementAndShippingDetails';
import { CustomizationForm } from 'components/orders/CustomizationForm';
// import { CustomizationFormForDesktop } from 'components/orders/CustomizationFormForDesktop';
import { PriceDetails } from 'components/orders/PriceDetails';
import closeIcon from 'assets/images/orders/list/close.svg';
import cx from 'classnames';
import { Button } from 'phoenix-components';
import SnackBar from 'services/snackbar';
import { Factory } from 'api';
import Loader from 'services/loader';
import { useToggle } from 'hooks/common';
import { useShop } from 'contexts/userContext';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { useDesktop } from 'contexts';
import { Tabs } from 'phoenix-components/lib/containers';
import { Clickable } from 'phoenix-components';
import styles from './OrderDetail.module.css';
import { CenterButton } from './CenterButton';
import { OrderFrom } from './OrderFrom';
import { CustomerDetails } from './CustomerDetails';

export function OrderDetail() {
  const order = useOrder();
  const shop = useShop();
  const [openCodAlert, toggleCodAlert] = useToggle(false);
  const refreshOrder = useRefresh();
  const isPendingOnly = isOnlyPending();
  const pendingOrders = isPendingOnly ? usePendingOrders() : [];
  const [checkedPenOrders, setCheckedPenOrders] = useState([]);

  const [enable, setEnable] = useToggle(false);

  const setIds = useSetIds();
  const enableMarkAsPaid = useEnableMarkAsPaid();
  const enableConfirm = useEnableAccept();
  const enableCustomization = useEnableCustomization();
  const isCod = useIsCod();
  const isDesktop = useDesktop();
  const [tabValue, setTabValue] = useState('Products');

  const markPayment = async () => {
    Loader.show();
    toggleCodAlert();
    try {
      await Factory.markAsPaid(order._id);
      refreshOrder();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const HeaderList = [
    {
      label: 'Products',
      value: 'Products',
      id: 1
    },
    {
      label: 'Payment Settlement',
      value: 'Payment Settlement',
      id: 2
    },
    {
      label: 'Customer Details',
      value: 'Customer Details',
      id: 3
    },
  ];

  const isCheckedPen = (id) => checkedPenOrders.includes(id);

  const updatePenSelections = (id) => {
    if (isCheckedPen(id)) {
      setCheckedPenOrders(checkedPenOrders.filter(x => x !== id));
      setIds(checkedPenOrders.filter(x => x !== id));
      return;
    }
    setCheckedPenOrders(checkedPenOrders.concat(id));
    setIds(checkedPenOrders.concat(id));
  };

  return (
    <div className={styles.container}>
      <OrderFrom />
      {isDesktop ? (
        <div className={styles.tab}>
          <Tabs
            items={HeaderList}
            onChange={(e) => {
              const tab = HeaderList.find(x => x.label === e);
              const container = document.getElementById(`scroll${tab.id}`);
              window.scrollTo({
                top: container.getBoundingClientRect().top,
                behavior: 'smooth'
              });
              setTabValue(e);
            }}
            className={styles.tabHeader}
            value={tabValue}
            size="small"
            separator={true}
          />
        </div>
      ) : null}
      <div id="scroll1"></div>
      {isPendingOnly && (
        <div className={styles.desktopOrders}>
          <div className={styles.header}>
            {' '}
            Products
            <span className={styles.nesHeader}>{`(${pendingOrders.length} items)`}</span>
          </div>
          {pendingOrders.map((x, i) => (
            <div className={cx(styles.flex, { [styles.noBorder]: i === pendingOrders.length - 1 })}>
              <img
                className={styles.checkBox}
                onClick={() => updatePenSelections(x._id)}
                src={isCheckedPen(x._id) ? checkedIcon : unCheckedIcon}
                alt=""
              />
              <div>
                <OrderCard order={x} type="pending" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isPendingOnly && <Multi />}
      {isDesktop && enableCustomization && (
        <div className={styles.title}>
          Have
          <Clickable className={styles.green} onClick={setEnable}>
            Customization Charges?
          </Clickable>
        </div>
      )}
      <PriceDetails />
      {enableMarkAsPaid && (
        <div className={styles.paidButton}>
          <Button
            size="small"
            label="Mark as paid"
            onClick={toggleCodAlert}
          />
        </div>
      )}
      <div id="scroll2"></div>
      {!isCod && <SettlementAndShippingDetails />}
      <div id="scroll3"></div>
      <CustomerDetails />
      {!isDesktop && enableCustomization && (
        <div className={styles.title}>
          Have
          <Clickable className={styles.green} onClick={setEnable}>
            Customization Charges?
          </Clickable>
        </div>
      )}
      <div style={{ height: '150px' }} />
      {(enableCustomization || enableConfirm) && (
        <div className={styles.footer}>
          {enable && enableCustomization && <CustomizationForm onBack={setEnable} />}
          {isPendingOnly && order.status !== 'cancelled' && !enable && <CenterButton groupId={order.groupId} />}
        </div>
      )}
      {openCodAlert && (
        <Dialog
          open={true}
          onClose={toggleCodAlert}
          maxWidth={isDesktop ? 'xs' : 'md'}
        >
          <DialogContent>
            {isDesktop && (
              <div className="flexEnd">
                <Clickable
                  onClick={toggleCodAlert}>
                  <img src={closeIcon} alt="" />
                </Clickable>
              </div>
            )}
            <div className={styles.codHeading}>A little birdie tells us you've received your payment.</div>
            <div className={styles.codAmount}>
              {shop.currency}
              {' '}
              {(order.codBalance || order.customPaymentBalance).toFixed(2)}
            </div>
          </DialogContent>
          <DialogActions className={styles.codActButtons}>
            <Button
              label="No"
              onClick={toggleCodAlert}
              primary={false}
            />
            <Button
              label="Yes"
              onClick={markPayment}
            />
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

OrderDetail.propTypes = {};

OrderDetail.defaultProps = {};
