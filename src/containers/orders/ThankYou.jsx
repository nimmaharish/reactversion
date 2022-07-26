import React from 'react';
import { Button } from 'phoenix-components';
import illustration from 'assets/images/orders/thankyou/illustration.svg';
import { useHistory, useParams } from 'react-router-dom';
import { isIND } from 'contexts';
import styles from './ThankYou.module.css';

function ThankYou() {
  const isInd = isIND();
  const info = isInd ? 'Download your Shipping Label and Print it, attach it on your shipment.'
    : `Download your Shipping Label and Print it, attach it on your shipment.
  Drop the shipment to the nearest hub of the provider`;
  const history = useHistory();
  const { id } = useParams();

  const onClose = async () => {
    history.replace(`/orders/${id}`);
  };

  return (
    <div className={styles.container}>
      <img src={illustration} alt="" />
      <div className={styles.heading}> Shipment Confirmed</div>
      <div className={styles.info}>{info}</div>
      <div className={styles.tag}> Get your Delivery Tag in order details page</div>
      <div className={styles.buttons}>
        <Button
          onClick={onClose}
          type="large"
          label="Close"
        />
      </div>
    </div>
  );
}

export default ThankYou;
