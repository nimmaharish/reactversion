import React from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import cx from 'classnames';
import { startCase } from 'lodash';
import { useShop } from 'contexts/userContext';
import PropTypes from 'prop-types';
import ShippingModes from './ShippingModes';
import ShopTimings from './ShopTimings';
import Payments from './Payments';
import ShippingPartner from './ShippingPartners';
import ShippingCharges from './ShippingCharges';
import Areas from './Areas';
import styles from './Overview.module.css';

export default function Overview({ onClose }) {
  const shop = useShop();
  const isDesktop = useDesktop();
  const history = useHistory();
  const Component = isDesktop ? SideDrawer : Drawer;
  const closeDraw = () => {
    if (isDesktop) {
      history.push('/settings/profile');
    } else {
      history.push('/settings/profile');
    }
  };
  return (
    <Component
      title="Shop Settings Snapshot"
      backButton={true}
      onClose={onClose || closeDraw}
    >
      <div className={styles.container}>
        <>
          <div className={styles.card}>
            <div className={styles.top}>
              <div
                className={styles.head}
                onClick={() => {
                  history.push('/manage');
                }}
              >
                Shop Status
              </div>
            </div>
            <div className={styles.shopStatusBar}>
              <div className={styles.shopStatusText}>Shop status :</div>
              <span
                className={cx(styles[shop?.status === 'created' ? 'live' : shop?.status])}
              >
                <span
                  className={cx(styles[shop?.status === 'created' ? 'live' : shop?.status])}
                >
                </span>
                {shop?.status === 'created' ? 'Live' : startCase(shop?.status)}
              </span>
            </div>
          </div>
          <ShopTimings />
          <Payments />
          <ShippingModes />
          <Areas />
          <ShippingCharges />
          <ShippingPartner />
        </>
      </div>
    </Component>
  );
}

Overview.propTypes = {
  onClose: PropTypes.func.isRequired,
};

Overview.defaultProps = {};
