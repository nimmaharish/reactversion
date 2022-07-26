import React from 'react';
import { ItemList } from 'components/orders/v2/ItemList';
import { useDesktop } from 'contexts';
import cx from 'classnames';
import { useOrder } from 'contexts/orderContext';
import { PriceDetails } from 'components/orders/PriceDetails';
import PaymentLink from 'components/orders/PaymentLink';
import { CustomerDetails } from 'components/orders/CustomerDetails';
import { StatusDrawer } from 'components/orders/v2/StatusDrawer';
import { useToggle } from 'hooks/common';
import { Clickable } from 'phoenix-components';
import chevUp from 'assets/v2/orders/chevUp.svg';
import { CustomizationForm } from 'components/orders/CustomizationForm';
import { PaymentList } from 'components/orders/v2/PaymentList';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './OrderDetailsContainer.module.css';
import { OrderDetails } from './OrderDetails';
import cmStyles from './Common.module.css';
import { ShareTrackingLink } from '../ShareTrackingLink';

export function OrderDetailsContainer() {
  const order = useOrder();
  const isDesktop = useDesktop();
  const [openStatusDrawer, toggleStatusDrawer] = useToggle();
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <OrderDetails />
        {isDesktop && (
          <div className={cx(cmStyles.borderBottom, cmStyles.marginV30)} />
        )}
        <ItemList />
        <ShareTrackingLink />
        <PriceDetails />
        <PaymentLink />
        <PaymentList />
        <CustomerDetails />
        {openStatusDrawer && (<StatusDrawer onClose={toggleStatusDrawer} />)}
        <CustomizationForm />
        {isDesktop && (
          <div className="flexCenter fullWidth">
            <Kbc type="orderflowAndUpdate" />
          </div>
        )}
        {!isDesktop && (<div className={styles.kbc}><Kbc type="orderflowAndUpdate" /></div>)}
      </div>
      {order?.status === 'archived' ? null : (
        <div className={styles.footer}>
          <Clickable onClick={toggleStatusDrawer} className={styles.button}>
            <span>
              UPDATE STATUS
            </span>
            {!isDesktop && <img src={chevUp} alt="" />}
          </Clickable>
        </div>
      )}
    </div>
  );
}

OrderDetailsContainer.propTypes = {};

OrderDetailsContainer.defaultProps = {};
