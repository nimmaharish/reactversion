import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/swiper.min.css';
import { useOrder } from 'hooks';
import Header from 'components/orders/header/Header';
import { OrderContext } from 'contexts/orderContext';
import { OrderDetail } from 'components/orders';
import { Drawer } from '@material-ui/core';
import { useDesktop } from 'contexts';
import styles from './Details.module.css';

SwiperCore.use([Pagination]);

function Details() {
  const { id } = useParams();
  const [order, refresh] = useOrder(id);
  const history = useHistory();
  const [ids, setIds] = useState([]);
  const isDesktop = useDesktop();

  if (!order) {
    return null;
  }

  if (!isDesktop) {
    return (
      <Drawer
        anchor="bottom"
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
        open={true}
        onClose={() => history.goBack()}
      >
        <div className={styles.container}>
          <Header
            showFaq={true}
            title="Order Details"
            showItems={['orders', 'cancellationsReturnsAndRefunds', 'shippingAndDelivery']}
            onBack={history.goBack}
          />
          <OrderContext.Provider
            value={{
              order,
              refresh,
              ids,
              setIds
            }}>
            <OrderDetail />
          </OrderContext.Provider>
        </div>
      </Drawer>
    );
  }

  return (
    <div className={styles.container2}>
      <OrderContext.Provider
        value={{
          order,
          refresh,
          ids,
          setIds
        }}>
        <OrderDetail />
      </OrderContext.Provider>
    </div>
  );
}

Details.propTypes = {};

Details.defaultProps = {};

export default Details;
