import React from 'react';
import { useDesktop } from 'contexts';
import { Drawer } from 'components/shared/Drawer';
import { useParams } from 'react-router-dom';
import { useOrder } from 'hooks';
import { OrderContext } from 'contexts/orderContext';
import { OrderDetailsContainer } from 'components/orders/v2/OrderDetailsContainer';
import { TopBar } from 'components/common/desktop/TopBar';
import { Loading } from 'components/shared/Loading';
import styles from './OrderDetails.module.css';

function OrderDetails() {
  const isDesktop = useDesktop();
  const { id } = useParams();
  const [order, refresh] = useOrder(id);

  if (!order) {
    return (
      <Loading />
    );
  }

  if (!isDesktop) {
    return (
      <Drawer title="Order Details">
        <div className={styles.container}>
          <OrderContext.Provider value={{ order, refresh }}>
            <OrderDetailsContainer />
          </OrderContext.Provider>
        </div>
      </Drawer>
    );
  }

  return (
    <div className={styles.container}>
      <TopBar title="Order Details" />
      <OrderContext.Provider value={{ order, refresh }}>
        <OrderDetailsContainer />
      </OrderContext.Provider>
    </div>
  );
}

OrderDetails.propTypes = {};

OrderDetails.defaultProps = {};

export default OrderDetails;
