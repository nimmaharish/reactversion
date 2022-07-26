import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  useOrder, useRefresh, useSetIds, isOrderCustomerPickUp, useOrderStatus
} from 'contexts/orderContext';
// import moment from 'moment';
import cx from 'classnames';
import { useToggle } from 'hooks/common';
import { ShippingModal } from 'components/orders/ShippingModal';
import { useShop } from 'contexts/userContext';
import { SettlementAndShippingDetails } from 'components/orders/SettlementAndShippingDetails';
import { CenterButton } from 'components/orders/CenterButton';
import { BottomBar } from 'components/orders/BottomBar';
import { Badge, Button } from 'phoenix-components';
import { getBadgeVariant } from 'components/orders/utils';
import { Note } from 'components/orders/Note';
import styles from './OrderCard.module.css';

export function OrderCard({
  order,
  type
}) {
  const refresh = useRefresh();
  const shop = useShop();
  const setIds = useSetIds();
  const rootOrder = useOrder();
  const isShipped = type === 'shipped';
  const isCustomerPickUp = isOrderCustomerPickUp();
  const isSelfDrop = _.get(order, 'subType', '') === 'selfdrop';
  const image = _.get(order, 'content.images[0].url', '');
  const quantity = _.get(order, 'quantity', 1);
  const isGroupedItems = isShipped && _.get(order, 'isLast', false);
  const groupItemsId = isShipped && _.get(order, 'allItemIds', false);
  const [deliveryForm, setDeliveryForm] = useToggle(false);
  const enableReadyToShip = _.get(order, 'buttons.enableReadyToShip', false);
  const selfShipProvider = _.get(order, 'details.provider', '');
  const awbNo = _.get(order, 'details.awbNo', '');
  const note = _.get(order, 'details.note', '');
  const isCancelledOrder = useOrderStatus() === 'cancelled';

  const readyToShip = async () => {
    const itemIds = isGroupedItems ? groupItemsId : [order._id];
    setIds(itemIds);
    setDeliveryForm(true);
  };

  const onReadyToShipClose = async () => {
    setDeliveryForm(false);
    await refresh();
  };

  const getStatus = () => {
    if (type === 'pending') {
      if (isCancelledOrder) {
        return 'Cancelled';
      }
      if (rootOrder?.status === 'payment successful') {
        return rootOrder.status;
      }
      if (rootOrder?.status === 'payment pending') {
        if (rootOrder?.isCod) {
          return 'pending';
        }
        return 'Added to cart';
      }
      if (rootOrder?.status === 'payment cod' || rootOrder?.status === 'payment custom') {
        return 'pending';
      }
      return order.status;
    }
    if (isCancelledOrder) {
      return 'Cancelled';
    }
    return order.status;
  };

  const variant = order?.content?.details;
  const color = order?.content?.color;

  return (
    <div className={isShipped && styles.shipSection}>
      <div className={cx(styles.root)}>
        <div className={styles.bgWhite}>
          <div className={styles.container}>
            <div className={styles.left}>
              <img src={image} alt="" loading="lazy" />
            </div>
            <div className={styles.column}>
              <div className={cx(styles.row, 'flexBetween')}>
                <div className={styles.title}>
                  {order?.content?.title}
                </div>
                <Badge
                  size="small"
                  rounded
                  variant={getBadgeVariant(order.status)}
                  color="white"
                >
                  {getStatus()}
                </Badge>
              </div>
              <div className={styles.row}>
                <div className={styles.price}>
                  {shop.currency || 'INR'}
                  {' '}
                  {order.amount}
                </div>
                {variant?.name && variant?.value && (
                  <div className={styles.price}>
                    {variant.value}
                    {' '}
                    {variant.name}
                  </div>
                )}
                <div className={styles.price}>
                  {`${quantity} Qty`}
                </div>
              </div>
              {color?.hex && (
                <div className={styles.row}>
                  <div className={styles.colorHeading}>Color</div>
                  <div>
                    <div className={styles.colorBox} style={{ background: color.hex }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.note}>
          <Note note={order?.note} />
        </div>
        {isShipped && isGroupedItems && enableReadyToShip && (
          <div className="fullWidth flexCenter">
            <Button
              label="Ready To Ship"
              onClick={readyToShip}
              size="large"
            />
          </div>
        )}
        {(isShipped && isGroupedItems) && <CenterButton order={order} groupId={order.groupId} hideLabel={true} />}
        {deliveryForm && <ShippingModal order={order} groupId={order.groupId} onClose={onReadyToShipClose} />}
        {(isShipped && isGroupedItems) && (<SettlementAndShippingDetails showShipping={true} order={order} />)}
        {selfShipProvider.length > 0 && (
          <div className={styles.selfprovider}>
            <div> Shipping Details</div>
            <span>
              Shipped By -
            </span>
            <span>
              {' '}
              {selfShipProvider}
            </span>
            <br />
            <span>Tracking ID - </span>
            <span>
              {' '}
              {awbNo}
            </span>
          </div>
        )}
        {isCustomerPickUp && note.length > 0 && (
          <div className={styles.selfprovider}>
            <div> Shipping Details</div>
            <span>
              Shipping Type:
            </span>
            <span>
              {' '}
              Customer Pickup
            </span>
            <br />
            <span>Pickup Remarks: </span>
            <br />
            <span>
              {' '}
              {note}
            </span>
          </div>
        )}
        {isSelfDrop && note.length > 0 && (
          <div className={styles.selfprovider}>
            <div> Shipping Details</div>
            <span>
              Shipping Type:
            </span>
            <span>
              {' '}
              Self Drop
            </span>
            <br />
            <span>Delivery Remarks: </span>
            <br />
            <span>
              {' '}
              {note}
            </span>
          </div>
        )}
        {isShipped && isGroupedItems && (<BottomBar order={order} groupId={order.groupId} />)}
      </div>
    </div>
  );
}

OrderCard.defaultProps = {
  type: ''
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  type: PropTypes.string
};
