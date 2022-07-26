import React from 'react';
import { Clickable } from 'phoenix-components';
import cx from 'classnames';
import ChevronRight from 'assets/images/orders/multi/rightChev.svg';
import stripeIcon from 'assets/images/payments/multi/stripe.svg';
import razorpayIcon from 'assets/images/payments/multi/razorpay.svg';
import paypalIcon from 'assets/images/payments/multi/paypal.svg';
import cashfreeIcon from 'assets/images/payments/multi/cashfree.svg';
import paystackIcon from 'assets/images/payments/multi/paystack.svg';
import flutterwaveIcon from 'assets/images/payments/multi/flutterwave.svg';
import midtransIcon from 'assets/images/payments/multi/midtrans.svg';
import moncashIcon from 'assets/images/payments/multi/moncash.svg';
import paytmIcon from 'assets/images/payments/multi/paytm.svg';
import { useShop } from 'contexts';
import { Loading } from 'components/shared/Loading';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { useDesktop } from 'contexts';
import {
  isPayPalAllowed,
  isStripeAllowed,
  isFlutterWaveAllowed,
  isPayStackAllowed,
} from 'utils/countries';
import { isMonCashAllowed, isMidtransAllowed, isPaytmAllowed } from './utils.js';
import Partner from './Partner.jsx';
import styles from './PaymentPartners.module.css';

function PaymentPartners() {
  const shop = useShop();
  const isIndia = shop?.country?.toLowerCase() === 'india';
  const isPayPalEnabled = isPayPalAllowed(shop?.country);
  const isStripeEnabled = isStripeAllowed(shop?.country);
  const isFlutterWaveEnabled = isFlutterWaveAllowed(shop?.currency);
  const isPaystackEnabled = isPayStackAllowed(shop?.currency);
  const isMoncashEnabled = isMonCashAllowed(shop?.currency);
  const isMidtransEnabled = isMidtransAllowed(shop?.currency);
  const isPaytmEnabled = isPaytmAllowed(shop?.currency);
  const params = useQueryParams();
  const history = useHistory();
  const partner = params.get('partner') || '';

  const partners = shop?.accounts;
  const isDesktop = useDesktop();

  const setPartner = (val) => {
    params.set('partner', val);
    history.push({
      search: params.toString(),
    });
  };

  const getText = (partner) => {
    const item = partners.find(x => x.name === partner);
    if (item) {
      if (item.enabled) {
        return 'Active';
      }
      return 'Connected';
    }
    return 'Connect';
  };

  const getClass = (partner) => {
    const value = getText(partner);
    if (value === 'Connect') {
      return styles.primary;
    }
    if (value === 'Connected') {
      return styles.blue;
    }
    return styles.green;
  };

  const body = () => (
    <div className={styles.mainContainer}>
      {partner.length > 0 && <Partner name={partner} partners={partners} /> }
      {isStripeEnabled && (
        <div>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => {
              setPartner('stripe');
            }}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                src={stripeIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Stripe
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('stripe'))}>
                {getText('stripe')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </div>
      )}
      {isPayPalEnabled && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('paypal')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                src={paypalIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Paypal
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('paypal'))}>
                {getText('paypal')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
      {isFlutterWaveEnabled && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('flutterwave')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                height="40"
                width="80"
                src={flutterwaveIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Flutter wave
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('flutterwave'))}>
                {getText('flutterwave')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
      {isPaystackEnabled && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('paystack')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                height="40"
                width="80"
                src={paystackIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Paystack
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('paystack'))}>
                {getText('paystack')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
      {isMidtransEnabled && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('midtrans')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                height="40"
                width="80"
                src={midtransIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Midtrans
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('midtrans'))}>
                {getText('midtrans')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
      {isMoncashEnabled && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('moncash')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                height="40"
                width="80"
                src={moncashIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Moncash
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('moncash'))}>
                {getText('moncash')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
      {isPaytmEnabled && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('paytm')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                height="40"
                width="80"
                src={paytmIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Paytm
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('paytm'))}>
                {getText('paytm')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
      {isIndia && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('razorpay')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                src={razorpayIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Razorpay
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('razorpay'))}>
                {getText('razorpay')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('cashfree')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                height="40"
                width="80"
                src={cashfreeIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Cashfree
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('cashfree'))}>
                {getText('cashfree')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </>
      )}
    </div>
  );

  if (!partners) {
    return <Loading />;
  }

  return !isDesktop ? (
    <>
      {body()}
    </>
  ) : (
    <div className={styles.main}>
      {body()}
    </div>
  );
}

export default PaymentPartners;
