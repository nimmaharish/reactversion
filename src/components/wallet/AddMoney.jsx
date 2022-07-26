import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import { useUser } from 'contexts';
import { Button } from 'phoenix-components';
import { SnackBar } from 'services';
import Loader from 'services/loader';
import URLUtils from 'utils/url';
import { Piggy } from 'api';
import CONFIG from 'config';
import cx from 'classnames';
import WindoInput from 'components/common/Input';
import { useShop } from 'contexts/userContext';
import Stripe from 'services/stripe';
import { useToggle } from 'hooks/common';
import Alert from 'components/shared/alert/Alert';
import { useHistory } from 'react-router-dom';
import { useDesktop } from 'contexts';
import styles from './AddMoney.module.css';

export function AddMoney() {
  const [amount, setAmount] = useState();
  const [cashFreeData, setCashFreeData] = useState(null);
  const [openPhone, toggleOpenPhone] = useToggle(false);
  const history = useHistory();
  const user = useUser();
  const shop = useShop();
  const countryDenominatons = {
    india: [100, 200, 500, 1000],
    others: [10, 50, 100, 150]
  };
  const recommended = countryDenominatons[shop?.country?.toLowerCase() === 'india' || 'others']
    || countryDenominatons.india;

  const isDesktop = useDesktop();

  const handleCashfree = async data => {
    const options = {
      appId: data.appId,
      orderId: data.orderId,
      orderAmount: data.orderAmount.toString(),
      orderCurrency: data.orderCurrency,
      customerName: user.name || '',
      customerEmail: user.email,
      customerPhone: user.phone,
      returnUrl: data.returnUrl,
      notifyUrl: data.notifyUrl,
      signature: data.tokenData,
      stage: data.stage,
    };
    Loader.show();
    setCashFreeData(options);
    Loader.show();
    const interval = setInterval(() => {
      Loader.show();
      const ele = document.getElementById('cashfree');
      if (ele) {
        clearInterval(interval);
        Loader.hide();
        ele.submit();
      }
    }, 1000);
  };

  const handleStripePayment = async (data) => {
    try {
      await Stripe.redirectToCheckout(data.sessionId);
    } catch (e) {
      SnackBar.showError(e);
    }
  };

  const onPay = async () => {
    try {
      if (!amount) {
        throw new Error('amount should be greater than 0');
      }
      if (+amount <= 0) {
        throw new Error('amount should be greater than 0');
      }
      if (!user.phone) {
        toggleOpenPhone();
        return;
      }
      Loader.show();
      const url = isDesktop ? '/wallet?type=cash' : '/payments?tab=wallet&type=cash';
      const paymentData = {
        returnUrl: URLUtils.getUrl(
          `${url}&payment&pgTid={{pgTid}}&tid={{tid}}&id={{identifier}}`
        ),
        cancelUrl: URLUtils.getUrl(url),
        platform: 'web',
        email: user.email,
        phone: user.phone,
        name: user.name || '',
        amount: +amount,
      };

      const paymentIntent = await Piggy.onPay(paymentData);

      switch (paymentIntent.identifier) {
        case 'cashfree':
          return handleCashfree(paymentIntent);
        case 'stripe':
          return handleStripePayment(paymentIntent);
        default:
          throw new Error('unable to handle payments as of now!');
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      {openPhone && (
        <Alert
          btnText="Ok"
          text="Please add your phone number to proceed"
          onClick={() => {
            history.push('/manage/shop', {
              redirectTo: '/payments?tab=wallet',
            });
          }}
        />
      )}
      <div className={styles.head}>Add Money</div>
      {isDesktop ? (
        <div className={styles.addMoneyContainerForDesktop}>
          <div className={styles.items}>
            <WindoInput
              value={amount}
              className={styles.inputClass}
              labelClassName={styles.labelClass}
              placeholder="Enter Amount"
              type="number"
              setValue={(e) => setAmount(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={styles.adorn}
                    position="start">
                    {shop.currency}
                  </InputAdornment>),
                classes: {
                  input: cx(styles.slug, styles.single),
                },
              }}
            />
            <Button
              className={styles.cusBtn}
              disabled={(+amount <= 0)}
              onClick={onPay}
              label="Add"
              variant="contained"
              type="small"
            />
          </div>
          <div className={styles.section}>
            {recommended.map(x => (
              <div
                className={styles.amount}
                onClick={() => setAmount(x)}
              >
                {shop.currency}
                {' '}
                {x}
                {' '}
              </div>
            ))}
          </div>
        </div>
      )
        : (
          <>
            <div className={styles.flex}>
              <WindoInput
                value={amount}
                className={styles.inputClass}
                labelClassName={styles.labelClass}
                placeholder="Enter Amount"
                type="number"
                setValue={(e) => setAmount(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      className={styles.adorn}
                      position="start">
                      {shop.currency}
                    </InputAdornment>),
                  classes: {
                    input: cx(styles.slug, styles.single),
                  },
                }}
              />
              <Button
                className={styles.cusBtn}
                disabled={(+amount <= 0)}
                onClick={onPay}
                label="Add"
                variant="contained"
                type="large"
              />
            </div>
            <div className={styles.head}>Recommended</div>
            <div className={styles.section}>
              {recommended.map(x => (
                <div
                  className={styles.amount}
                  onClick={() => setAmount(x)}
                >
                  {shop.currency}
                  {' '}
                  {x}
                  {' '}
                </div>
              ))}
            </div>
          </>
        )}

      {cashFreeData && (
        <div className={styles.hiddenForm}>
          <form method="POST" id="cashfree" action={CONFIG.CASHFREE.host}>
            <input type="hidden" name="appId" value={cashFreeData.appId} />
            <input type="hidden" name="orderId" value={cashFreeData.orderId} />
            <input type="hidden" name="orderAmount" value={cashFreeData.orderAmount} />
            <input type="hidden" name="orderCurrency" value={cashFreeData.orderCurrency} />
            <input type="hidden" name="customerName" value={cashFreeData.customerName} />
            <input type="hidden" name="customerEmail" value={cashFreeData.customerEmail} />
            <input type="hidden" name="customerPhone" value={cashFreeData.customerPhone} />
            <input type="hidden" name="returnUrl" value={cashFreeData.returnUrl} />
            <input type="hidden" name="notifyUrl" value={cashFreeData.notifyUrl} />
            <input type="hidden" name="signature" value={cashFreeData.signature} />
          </form>
        </div>
      )}
    </div>
  );
}

AddMoney.propTypes = {};

AddMoney.defaultProps = {};
