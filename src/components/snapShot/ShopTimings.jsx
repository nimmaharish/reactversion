import React from 'react';
import { useHistory } from 'react-router-dom';
import { useShop } from 'contexts/userContext';
import editIcon from 'assets/overview/edit.svg';
import acceptIcon from 'assets/v2/settings/snapshot/active.svg';
import notacceptIcon from 'assets/v2/settings/snapshot/notactive.svg';
import Accordion from './Accordion';
import styles from './Overview.module.css';

function ShopTimings() {
  const shop = useShop();
  const history = useHistory();

  return (
    <>
      <Accordion
        label="Shop Timings"
        labelHelper="View Shop Timings"
      >
        <div className={styles.padded}>
          <div
            className={styles.top}
            onClick={() => {
              history.push('/storeTimings');
            }}
          >
            <div className={styles.head1}>
              Current shop timings
            </div>
            <img src={editIcon} alt="snapshot" />
          </div>
          <div className={styles.timingContainer}>
            {Object.entries(shop?.storeTimings || {}).map(([key, value]) => (
              <div className={styles.box}>
                <div className={styles.day}>
                  {key}
                  {value.status === 'live' ? (
                    <div className={styles.time}>
                      {value.opensAt}
                      {' '}
                      -
                      {' '}
                      {value.closesAt}
                    </div>
                  ) : (
                    <div className={styles.close}>
                      Closed
                    </div>
                  )}
                </div>
                {value.status === 'live' ? (
                  <>
                    {value.acceptOrders === true && (
                      <div className={styles.acceptContainer}>
                        <img src={acceptIcon} alt="" />
                        <div className={styles.accept}>Accept orders after store timings</div>
                      </div>
                    )}
                    {value.acceptOrders === false && (
                      <div className={styles.acceptContainer}>
                        <img src={notacceptIcon} alt="" />
                        <div className={styles.accept}>Does not accept orders after store timings</div>
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
      </Accordion>
    </>
  );
}

export default ShopTimings;
