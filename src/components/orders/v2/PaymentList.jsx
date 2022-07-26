import React, { useState } from 'react';
import { useOrder } from 'contexts/orderContext';
import { KeyValue } from 'components/orders/v2/KeyValue';
import { Dialog, Grid } from '@material-ui/core';
import moment from 'moment';
import { Clickable } from 'phoenix-components';
import closeIcon from 'assets/v2/orders/close.svg';
import { useToggle } from 'hooks/common';
import chevUpIcon from 'assets/v2/settings/paymentModes/chevUp.svg';
import chevDownIcon from 'assets/v2/settings/paymentModes/chevDown.svg';
import styles from './PaymentList.module.css';

const getPaymentMode = (x) => {
  switch (x.mode) {
    case 'online':
      return 'Online';
    case 'cod':
      return 'Cash';
    case 'custompayment':
      return x?.metaData?.mode ?? 'Direct Payment';
    default:
      return 'Pending';
  }
};

export function PaymentList() {
  const order = useOrder();
  const [image, setImage] = useState(null);
  const [openPaymentHistory, togglePaymentHistory] = useToggle();

  const list = (order?.paymentList || []).filter(x => x.mode !== 'cod');

  if (!list.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Clickable className={styles.accordionTop} onClick={togglePaymentHistory}>
        <div className={styles.heading}>Payment History</div>
        <img src={openPaymentHistory ? chevUpIcon : chevDownIcon} alt="" />
      </Clickable>
      {openPaymentHistory && (
        <>
          {list.map(x => (
            <div key={x._id} className={styles.card}>
              <Grid container spacing={0}>
                <KeyValue titleWidth={6} valueWidth={6} title="Mode" value={getPaymentMode(x)} />
                <KeyValue
                  titleWidth={6}
                  valueWidth={6}
                  title="Amount"
                  value={`${order.currency} ${x.amount.toFixed(2)}`} />
                {Math.abs(x.pgCharges) > 0 && (
                  <KeyValue
                    titleWidth={6}
                    valueWidth={6}
                    title="Payment Gateway Fee"
                    value={
                      `${x.pgCharges > 0 ? '' : '-'}${order.currency} ${Math.abs(x.pgCharges)
                        .toFixed(2)}`
                    }
                  />
                )}
                <KeyValue
                  titleWidth={6}
                  valueWidth={6}
                  title="Payment Date"
                  value={moment(x.createdAt)
                    .format('DD-MMM-YYYY hh:mm A')}
                />
                {x.mode === 'custompayment' && x?.metaData?.receipts?.length > 0 && (
                  <Grid item xs={12}>
                    <Clickable className="fullWidth" onClick={() => setImage(x?.metaData?.receipts)}>
                      <img className={styles.icon} src={x?.metaData?.receipts} alt="" />
                    </Clickable>
                  </Grid>
                )}
              </Grid>
            </div>
          ))}
          {image && (
            <Dialog
              onClose={() => setImage(null)}
              open={Boolean(image)}
              className={styles.dialog}
            >
              <Clickable onClick={() => setImage(null)} className={styles.close}>
                <img
                  src={closeIcon}
                  alt=""
                />
              </Clickable>
              <img className={styles.full} src={image} alt="" />
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}

PaymentList.propTypes = {};

PaymentList.defaultProps = {};
