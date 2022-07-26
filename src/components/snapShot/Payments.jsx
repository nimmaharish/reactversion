import React from 'react';
import { useHistory } from 'react-router-dom';
import editIcon from 'assets/overview/edit.svg';
import Accordion from './Accordion';
import { ActiveModes } from '../../containers/payments/ActiveModes';
import styles from './Overview.module.css';

function Payments() {
  const history = useHistory();

  return (
    <>
      <Accordion
        label="Payment Settings"
        labelHelper="View Payment Settings"
      >
        <div>
          <div
            className={styles.top}
            onClick={() => {
              history.push('/manage/paymentModes');
            }}>
            <div className={styles.head1}>
              Payment Overview
            </div>
            <img src={editIcon} alt="snapshot" />
          </div>
          <ActiveModes />
        </div>
      </Accordion>
    </>
  );
}

export default Payments;
