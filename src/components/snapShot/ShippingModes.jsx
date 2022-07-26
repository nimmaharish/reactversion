import React from 'react';
import { useHistory } from 'react-router-dom';
import { useShop } from 'contexts/userContext';
import editIcon from 'assets/overview/edit.svg';
import acceptIcon from 'assets/v2/settings/snapshot/active.svg';
import deliveryIcon from 'assets/v2/settings/snapshot/delivery.svg';
import pickupIcon from 'assets/v2/settings/snapshot/pickup.svg';
import bothIcon from 'assets/v2/settings/snapshot/both.svg';
import Accordion from './Accordion';
import styles from './Overview.module.css';

function ShippingModes() {
  const shop = useShop();
  const history = useHistory();
  const modes = shop?.delivery?.shippingModes;
  const currency = shop?.currency;

  const bothEnabled = modes?.delivery?.enabled && modes?.pickup?.enabled;

  return (
    <>
      <Accordion
        label="Shipping Modes"
        labelHelper="View Shipping Modes"
      >
        <div className={styles.padded}>
          <div
            className={styles.top}
            onClick={() => {
              history.push('/manage/shippingModes');
            }}
          >
            <div className={styles.head1}>
              Enabled Shipping Modes
            </div>
            <img src={editIcon} alt="snapshot" />
          </div>
          <div className={styles.shipping}>
            {modes?.delivery?.enabled && !bothEnabled && (
              <>
                <div className={styles.modes}>
                  <img src={deliveryIcon} alt="" />
                  <div className={styles.modeText}>
                    Delivery Only
                  </div>
                  <img src={acceptIcon} alt="" />
                </div>
                <div className={styles.valueContainer}>
                  <div className={styles.minValue}>
                    <div className={styles.text}>
                      Min order value
                    </div>
                    <div className={styles.value}>
                      {shop?.delivery?.shippingModes?.delivery?.orderValue?.min ?? 'None'}
                    </div>
                  </div>
                  <div className={styles.lineV} />
                  <div className={styles.minValue}>
                    <div className={styles.text}>
                      Max order value
                    </div>
                    <div className={styles.value}>
                      {shop?.delivery?.shippingModes?.delivery?.orderValue?.max}
                    </div>
                  </div>
                </div>
              </>
            )}
            {modes?.pickup?.enabled === true && !bothEnabled && (
              <div className={styles.modesP}>
                <img src={pickupIcon} alt="" />
                <div className={styles.modeText}>
                  Picup Only
                </div>
                <img src={acceptIcon} alt="" />
              </div>
            )}
            {bothEnabled && (
              <>
                <div className={styles.modes}>
                  <img src={bothIcon} alt="" />
                  <div className={styles.modeText}>
                    Delivery & Pickup
                  </div>
                  <img src={acceptIcon} alt="" />
                </div>
                <div className={styles.valueContainer}>
                  <div className={styles.minValue}>
                    <div className={styles.text}>
                      Min order value
                    </div>
                    <div className={styles.value}>
                      {currency}
                      {' '}
                      {shop?.delivery?.shippingModes?.delivery?.orderValue?.min ?? 'None'}
                    </div>
                  </div>
                  <div className={styles.lineV} />
                  <div className={styles.minValue}>
                    <div className={styles.text}>
                      Max order value
                    </div>
                    <div className={styles.value}>
                      {currency}
                      {' '}
                      {shop?.delivery?.shippingModes?.delivery?.orderValue?.max}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Accordion>
    </>
  );
}

export default ShippingModes;
