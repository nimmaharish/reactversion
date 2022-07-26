import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { Clickable } from 'phoenix-components';
import chevRight from 'assets/v2/orders/chevRight.svg';
import cx from 'classnames';
import { ItemSelectionDrawer } from 'components/orders/v2/ItemSelectionDrawer';
import { OrderStatusDrawer } from 'components/orders/v2/OrderStatusDrawer';
import { ShippingStatusDrawer } from 'components/orders/v2/ShippingStatusDrawer';
import chevDown from 'assets/v2/orders/chevDown.svg';
import { useOrderItemIds, useOrderItems } from 'contexts/orderContext';
import { PaymentStatusDrawer } from './PaymentStatusDrawer';
import styles from './StatusDrawer.module.css';

const STATUS_TYPES = [
  {
    value: 'order',
    label: 'Order Status'
  },
  {
    value: 'shipping',
    label: 'Shipping Status'
  },
  {
    value: 'payment',
    label: 'Payment Status'
  }
];

export function StatusDrawer({ onClose }) {
  const isDesktop = useDesktop();
  const [statusType, setStatusType] = useState(null);
  const allItems = useOrderItems();
  const [items, setItems] = useState([]);
  const itemIds = useOrderItemIds();

  const onSetStatusType = (type) => (e) => {
    e.stopPropagation();
    setStatusType(type);
    if (itemIds.length === 1 && statusType !== 'payment') {
      setItems(allItems.filter(item => item._id === itemIds[0]));
    }
  };

  const Component = isDesktop ? SideDrawer : BottomDrawer;

  if (statusType === 'payment') {
    return <PaymentStatusDrawer onClose={onClose} />;
  }

  if (!items.length && (statusType === 'order' || statusType === 'shipping')) {
    return (
      <ItemSelectionDrawer onSubmit={setItems} onClose={onClose} />
    );
  }

  if (statusType === 'order') {
    return (
      <OrderStatusDrawer onClose={onClose} items={items} />
    );
  }

  if (statusType === 'shipping') {
    return (
      <ShippingStatusDrawer onClose={onClose} items={items} />
    );
  }

  return (
    <Component
      title="Choose Status Type"
      backButton
      onClose={onClose}
      classes={!isDesktop ? {
        paper: styles.drawer,
        heading: styles.bottomDrawerContainer,
      } : {}}
      onClick={isDesktop ? () => {
      } : undefined}
      btnLabel={isDesktop ? 'Update' : undefined}
    >
      {!isDesktop && (
        <div className={styles.borderBottom} />
      )}
      <div className={styles.container}>
        {STATUS_TYPES.map(x => (
          <Clickable
            key={x.value}
            onClick={onSetStatusType(x.value)}
            className={cx(styles.radio)}
          >
            <div>{x.label}</div>
            <img src={chevRight} alt="" />
          </Clickable>
        ))}
      </div>
      {!isDesktop && (
        <div className={styles.footer}>
          <Clickable onClick={onClose} className={styles.button}>
            <span>
              UPDATE STATUS
            </span>
            <img src={chevDown} alt="" />
          </Clickable>
        </div>
      )}
    </Component>
  );
}

StatusDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

StatusDrawer.defaultProps = {};
