import React from 'react';
import { useShop } from 'contexts/userContext';
// import { BankAccount } from 'containers/payments/BankAccount';
import { StripeAccount } from 'containers/payments/StripeAccount';
// import Info from 'components/info/Info';
import { getCountries } from 'utils/countries';
// import styles from './BankAccount.module.css';
// import Info from 'components/info/Info';
// import { useLocation } from 'react-router-dom';

export function Accounts() {
  // const { pathname } = useLocation();
  // const showProTip = pathname.indexOf('/payments') > -1;
  const { country } = useShop();
  const showOnline = getCountries().filter(x => x.stripeAllowed)
    .map(x => x.countryName).includes(country?.toLowerCase());
  return (
    <>
      {/* {country === 'india' && <BankAccount />} */}
      {showOnline && <StripeAccount />}
      {/* {showProTip && (
        <Info
          title="Pro Tip"
          text={'Your account details will be stored with utmost security (SSL and encrypted) and won’t be '
            + ' visible to customers or any other 3rd party apps.'}
        />
      )} */}
    </>
  );
}

Accounts.propTypes = {};

Accounts.defaultProps = {};
