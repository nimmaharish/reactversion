import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SnackBar from 'services/snackbar';
import { Factory } from 'api';
import { useOrder, useGetIds, isOrderCustomerPickUp } from 'contexts/orderContext';
import Loader from 'services/loader';
import { useDesktop } from 'contexts';
import { ReactInput, Button } from 'phoenix-components';
import styles from 'components/orders/UserShippingForm.module.css';
import EventManager from 'utils/events';
import Accordion from './Accordion';

export function UserShippingForm({ onClose, groupId }) {
  const [vendor, setVendor] = useState('');
  const isCustomerPickUp = isOrderCustomerPickUp();
  const [trackingId, setTrackingId] = useState('');
  const [note, setNote] = useState('');
  const [resGrpId, setResGrpId] = useState(null);
  const order = useOrder();
  const isDesktop = useDesktop();
  const ids = useGetIds();

  useEffect(() => {
    if (order?._id) {
      Loader.show();
      if (groupId.length > 0) {
        Factory.getShippingMetaWithGroup(order?._id, groupId, { ids })
          .then((res) => {
          // setMeta(res);
          // const index = 1;
            setResGrpId(res.groupId);
            Loader.hide();
          })
          .catch(() => {
            SnackBar.show('something went wrong', 'error');
            Loader.hide();
          });
      } else {
        Factory.getShippingMeta(order?._id, { ids })
          .then((res) => {
          // setMeta(res);
          // const index = 1;
            setResGrpId(res.groupId);
            Loader.hide();
          })
          .catch(() => {
            SnackBar.show('something went wrong', 'error');
            Loader.hide();
          });
      }
    }
  }, [order]);

  const onSubmit = async (subType) => {
    try {
      Loader.show();
      const payload = {
        trackingId,
        vendor,
        type: 'self',
        subType,
        note,
        ids
      };
      await Factory.shipOrder(order._id, resGrpId, payload);
      EventManager.emitEvent('order_shipped', {
        type: payload.type,
        id: order._id,
        groupId: groupId || '',
      });
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      onClose();
      Loader.hide();
    }
  };

  return (
    <>
      {!isCustomerPickUp && (
        <>
          <Accordion label="Self-Drop">
            <ReactInput
              value={note}
              type="textarea"
              rows={4}
              setValue={(e) => setNote(e)}
              label="Enter delivery remarks"
              placeholder="Drop your delivery agent's name, the estimated date of delivery, and other remarks here"
            />
            <div className={styles.buttons}>
              <Button
                fullWidth={!isDesktop}
                onClick={() => onSubmit('selfdrop')}
                size="medium"
                label="Ready to ship"
              />
            </div>
          </Accordion>
          <div className={styles.spacer}></div>
          <Accordion label="Third-Party Delivery">
            <ReactInput
              value={vendor}
              setValue={(e) => setVendor(e)}
              label="Enter Delivery Provider"
              placeholder="e.g. Fedex"
            />
            <ReactInput
              value={trackingId}
              setValue={(e) => setTrackingId(e)}
              label="Enter Tracking ID"
              placeholder="e.g. XYZ1234"
            />
            <div className={styles.buttons}>
              <Button
                fullWidth={!isDesktop}
                onClick={() => onSubmit('thirdparty')}
                size="medium"
                label="Confirm Dispatch" />
            </div>
          </Accordion>
        </>
      )}
      <div className={styles.spacer}></div>
      {isCustomerPickUp && (
        <Accordion label="Customer Pickup">
          <ReactInput
            value={note}
            type="textarea"
            rows={4}
            setValue={(e) => setNote(e)}
            label="Enter Pickup Remarks"
            placeholder="Drop your pickup time, estimated date of delivery, and other remarks here"
          />
          <div className={styles.buttons}>
            <Button
              fullWidth={true}
              onClick={() => onSubmit('customerpickup')}
              size="medium"
              label="Ready for Pick-up"
            />
          </div>
        </Accordion>
      )}
      <div className={styles.spacer}></div>
    </>
  );
}

UserShippingForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  groupId: PropTypes.string
};

UserShippingForm.defaultProps = {
  groupId: ''
};
