import React from 'react';
import { useHistory } from 'react-router-dom';
import empty from 'assets/images/payments/empty.svg';
import { useIsPaymentsEnabled } from 'contexts';
import { Button } from 'phoenix-components';
import { ActiveModes } from './ActiveModes';
import styles from './Overview.module.css';

function ProductsList() {
  const history = useHistory();
  const isActive = useIsPaymentsEnabled();

  return (
    <div className={styles.container}>
      {/* {!isDesktop && ( */}
      <div className={styles.head}>
        Payment Modes
      </div>
      {/* )} */}
      {!isActive && (
        <div className={styles.emptyContainer}>
          <img src={empty} alt="" />
          <div className={styles.label}> Please Activate Payments </div>
          <div className="flexCenter">
            <Button
              label="ACTIVATE PAYMENTS"
              size="medium"
              onClick={() => {
                history.push('/manage/paymentModes');
              }}
            />
          </div>
        </div>
      )}
      {isActive && <ActiveModes />}
    </div>
  );
}

export default ProductsList;
