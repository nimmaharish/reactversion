import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CommonStatusDrawer } from 'components/orders/v2/CommonStatusDrawer';
import {
  useConfirmedAmount, useNonConfirmedAmount, useOrder, useRefresh
} from 'contexts/orderContext';
import Loader from 'services/loader';
import { Factory } from 'api';
import Snackbar from 'services/snackbar';
import { PaymentAmount } from 'components/orders/v2/PaymentAmount';
import { PAYMENT_STATUS_LIST } from './statusUtils';

const STATUS_TITLES = {
  'payment successful': {
    title: 'Mark as Paid',
    subTitle: 'A little birdie tells us you\'ve received your payment.',
  },
  'not paid': {
    title: 'Mark as Not Paid',
  },
  refunded: {
    title: 'Mark as Refunded',
  }
};

export function PaymentStatusDrawer({ onClose }) {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState(null);
  const refreshOrder = useRefresh();
  const order = useOrder();
  const confirmedAmount = useConfirmedAmount();
  const balanceAmount = useNonConfirmedAmount();

  const onUpdateApi = async (status, nt, data = {}) => {
    try {
      Loader.show();
      await Factory.updateStatus(order._id, 'payment', status, [], nt, data, []);
      setAmount(null);
      refreshOrder();
      onClose();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onUpdate = (status, nt) => {
    setNote(nt);
    setStatus(status);
    if (status === 'refunded') {
      const x = confirmedAmount - (order?.refunded || 0);
      setAmount(x > 0 ? x : 0);
      return;
    }
    if (status === 'not paid') {
      setAmount(confirmedAmount);
      return;
    }
    if (status === 'payment successful') {
      setAmount(balanceAmount);
      return;
    }
    onUpdateApi(status, nt);
  };

  const onUpdateFromPopUp = (amount) => {
    onUpdateApi(status, note, { amount });
  };

  return (
    <>
      {amount !== null && (
        <PaymentAmount
          amount={amount}
          onSubmit={onUpdateFromPopUp}
          onClose={() => setAmount(null)}
          title={STATUS_TITLES[status].title}
          subTitle={STATUS_TITLES[status].subTitle}
        />
      )}
      <CommonStatusDrawer
        statusList={PAYMENT_STATUS_LIST}
        onSubmit={onUpdate}
        onClose={onClose}
        title="Payment Status"
      />
    </>
  );
}

PaymentStatusDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

PaymentStatusDrawer.defaultProps = {};
