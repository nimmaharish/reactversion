import React from 'react';
import PropTypes from 'prop-types';
import HorizontalLinearStepper from 'components/orders/stepper/Stepper';
import { useShop } from 'contexts';
import { Button } from 'phoenix-components';
import { useHistory } from 'react-router-dom';
import styles from './WindoShipForm.module.css';

export function WindoShipForm({ groupId, order, onClose }) {
  const shop = useShop();
  const history = useHistory();
  const addresses = !!shop?.addresses?.length || 0;
  if (addresses === 0) {
    return (
      <div className={styles.noAddress}>
        <div className="textCenter">
          Woohoo, you've made it this far! Now all that's left to do is complete your address and get your shipment out.
          <br />
          <br />
          <div className="flexCenter">
            <Button
              label="Add address"
              onClick={() => {
                history.push('/manage/address', {
                  redirectTo: `/orders/${order._id}`,
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <HorizontalLinearStepper onClose={onClose} groupId={groupId} order={order} />
  );
}

WindoShipForm.propTypes = {
  groupId: PropTypes.string,
  order: PropTypes.any,
  onClose: PropTypes.func,
};

WindoShipForm.defaultProps = {
  groupId: '',
  order: {},
  onClose: () => {},
};
