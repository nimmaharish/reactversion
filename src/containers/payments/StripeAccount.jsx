import React from 'react';
import icon from 'assets/images/payments/stripe.svg';
import { LightBlueTile } from 'components/cards';
import cx from 'classnames';
import { useRefreshShop, useStripeAccount, useShop } from 'contexts/userContext';
import { BlackButton } from 'components/buttons';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import { KnowMoreDialog } from 'containers/payments/KnowMoreDialog';
import { SnackBar } from 'services';
import { Becca } from 'api';
import { getCountries } from 'utils/countries';
import URLUtils from 'utils/url';
import Loader from 'services/loader';
import { Button } from 'phoenix-components';
import { useDesktop } from 'contexts';
import stripeDesktopIcon from 'assets/desktop/stripe.svg';
import styles from './StripeAccount.module.css';

const list = [
  'Payments done by the customer will be settled to your stripe account immediately. ',
  'You need to connect your bank account in your stripe dashboard to receive the payouts',
  'In most cases, the Stripe account approval process is nearly instantaneous and most users '
    + 'will be able to accept payments right away. If Stripe needs more information about a business or individual, '
    + 'expect a longer delay in processing an account approval, Stripe will reach out to you immediately.',
  'There will be payment gateway charges(as levied by Stripe, not a commission to WINDO) and '
   + ' will be visible in your stripe dashboard',
  'Your payout schedule will be as per the stripe payout schedule in your country. For more details, '
   + ' check here - https://stripe.com/docs/payouts',
  'You will get priority support if there is any dispute with regard to any of your transactions, '
  + ' just click on the help button.'
];

export function StripeAccount() {
  const account = useStripeAccount();
  const history = useHistory();
  const params = useQueryParams();
  const refresh = useRefreshShop();
  const { country } = useShop();
  const showStripe = getCountries().filter(x => x.stripeAllowed)
    .map(x => x.countryName).includes(country?.toLowerCase());
  const show = params.has('openStripe');
  const isDesktop = useDesktop();

  const openStripe = () => {
    params.set('openStripe', 'true');
    history.push({ search: params.toString() });
  };

  const forwardToStripe = async () => {
    try {
      Loader.show();
      if (!showStripe) {
        SnackBar.show('Online Payments not supported, please contact support', 'error');
        history.push('/manage/paymentModes');
        return;
      }
      const data = await Becca.createAccount(
        'stripe',
        URLUtils.getUrl('/stripe/connect?success=true'),
        URLUtils.getUrl('/stripe/connect?cancel=true')
      );
      if (data.enabled) {
        SnackBar.show('Stripe account is enabled', 'success');
        refresh();
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      Loader.hide();
      SnackBar.showError(e);
    }
  };

  const openDashboard = () => {
    window.open(`https://dashboard.stripe.com/${account.identifier}/`, '_blank');
  };

  if (!account.enabled) {
    return (
      <>
        <LightBlueTile className={styles.container}>
          <div className={styles.left}>
            <img className={styles.icon} src={isDesktop ? stripeDesktopIcon : icon} alt="" />
            <div>
              {' '}
              Connect your Stripe Account or Create a new account now to start accepting orders
              and collect your payments.
              {' '}
            </div>
          </div>
          <div className={cx(styles.variantActions, 'fullWidth flexCenter')}>
            <BlackButton
              className={cx(styles.border, styles.btnL50)}
              onClick={openStripe}
            >
              Know More
            </BlackButton>
            <BlackButton
              className={cx(styles.border1, styles.btnR50)}
              onClick={forwardToStripe}
            >
              Connect
            </BlackButton>
          </div>
        </LightBlueTile>
        {show && (
          <KnowMoreDialog
            onAction={forwardToStripe}
            list={list}
            description={`You will receive the payments done for your orders into your stripe account directly.
              Below are some points to note with regards to your transactions.`}
            title="Stripe Account"
          />
        )}
      </>
    );
  }

  return (
    <LightBlueTile className={styles.container1}>
      <div className="flexStart fullWidth">
        <div className={styles.left}>
          <img className={styles.icon} src={isDesktop ? stripeDesktopIcon : icon} alt="" />
        </div>
        <div className={cx(styles.center)} onClick={openDashboard}>
          <div className={styles.details}> Account Details </div>
          <div className={styles.accNo}>
            {account.identifier}
          </div>
        </div>
        <Button primary={false} onClick={openDashboard} label="Manage" size="small" />
      </div>
      <div className={styles.flex}>
        <span
          className={cx(styles.statusLabel)}
        >
          {' '}
          Payout enabled
          {': '}
          <span className={cx(styles.primary, account.payoutEnabled && styles.green)}>
            {account.payoutEnabled ? 'Yes' : 'No'}
          </span>
        </span>
        <div className={styles.spacer}></div>
        <span
          className={cx(styles.statusLabel)}
        >
          {' '}
          Payment enabled
          {': '}
          <span className={cx(styles.primary, account.paymentEnabled && styles.green)}>
            {account.paymentEnabled ? 'Yes' : 'No'}
          </span>
        </span>
      </div>
    </LightBlueTile>
  );
}

StripeAccount.propTypes = {};

StripeAccount.defaultProps = {};
