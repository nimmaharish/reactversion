import React from 'react';
import { useOrder } from 'contexts/orderContext';
import { Item } from 'components/orders/v2/Item';
import { useDesktop } from 'contexts';
import cx from 'classnames';
import { ShippingGroup } from 'components/orders/v2/ShippingGroup';
import cmStyles from './Common.module.css';
import styles from './ItemList.module.css';

export function ItemList() {
  const order = useOrder();
  const isDesktop = useDesktop();

  return (
    <div>
      {!isDesktop && (
        <div className={cmStyles.heading}>
          Item List
        </div>
      )}
      <div className={styles.infoContainer}>
        <div className={styles.info}>
          <span>
            Total Products
          </span>
          <span>:</span>
          <span>
            {order.totalItems}
          </span>
        </div>
        <div className={styles.info}>
          <span>
            Total Quantity
          </span>
          <span>:</span>
          <span>
            {order.totalQuantity}
          </span>
        </div>
      </div>
      {order.groups.shipped.map(group => (
        <>
          <ShippingGroup group={group} key={group._id} />
          <div className={cx(cmStyles.borderBottom, cmStyles.marginV20)} />
        </>
      ))}
      {order.groups.pending.map(item => (
        <>
          <Item item={item} key={item._id} />
          <div className={cx(cmStyles.borderBottom, cmStyles.marginV20)} />
        </>
      ))}
    </div>
  );
}

ItemList.propTypes = {};

ItemList.defaultProps = {};
