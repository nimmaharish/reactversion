import React from 'react';
import PropTypes from 'prop-types';
import { DialogContent, Drawer } from '@material-ui/core';
import { WindoShipForm } from 'components/orders/WindoShipForm';
import { SideDrawer } from 'components/shared/SideDrawer';
import Faq from 'components/faq/Custom';
import { useDesktop } from 'contexts';
import styles from './ShippingModal.module.css';

export function ShippingModal({
  onClose,
  groupId,
  order
}) {
  const isDesktop = useDesktop();

  const getContent = () => (
    <div className={styles.overflow}>
      <WindoShipForm onClose={onClose} groupId={groupId} order={order} />
    </div>
  );

  return (
    <>
      {!isDesktop && (
        <Drawer
          open={true}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
          onClose={onClose}
        >
          <DialogContent>
            <div className={styles.heading}>
              <div className={styles.type}> Shipping Type</div>
              <Faq withText={true} showItems={['shippingAndDelivery']} />
            </div>
            {getContent()}
          </DialogContent>
        </Drawer>
      )}
      {isDesktop && (
        <SideDrawer
          backButton={true}
          onClose={onClose}
          title="Shipping Type"
        >
          {getContent()}
        </SideDrawer>
      )}
    </>
  );
}

ShippingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  order: PropTypes.any
};

ShippingModal.defaultProps = {
  groupId: '',
  order: {}
};
