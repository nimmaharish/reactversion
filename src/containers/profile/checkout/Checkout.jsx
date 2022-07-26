import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import paymentRulesIcon from 'assets/v2/settings/checkout/paymentRules.svg';
import loginSettingsIcon from 'assets/v2/settings/checkout/loginSettings.svg';
import { Clickable } from 'phoenix-components';
import { useQueryParams } from 'hooks';
import featureIcon from 'assets/overview/feature.svg';
import { useDesktop } from 'contexts';
import CommonOverview from 'containers/desktop/CommonOverview';
import { useHistory } from 'react-router-dom';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import { useOpenPlans, useIsFreePlan } from 'contexts/userContext';
import LoginSettings from './LoginSettings';
import styles from './Checkout.module.css';
import PaymentRules from './PaymentRules';

function Checkout() {
  const params = useQueryParams();
  const [state, setState] = useState(params.get('page') || '');
  const isDesktop = useDesktop();
  const history = useHistory();
  const isFree = useIsFreePlan();
  const openPlans = useOpenPlans();
  const onClose = () => {
    params.delete('page');
    history.goBack();
    setState('');
  };

  if (isDesktop) {
    return (
      <>
        <CommonOverview page="Checkout Settings" />
        {state === 'login' && (
          <LoginSettings onClose={onClose} />
        )}
        {state === 'rules' && (
          <PaymentRules onClose={onClose} />
        )}
      </>
    );
  }

  return (
    <Drawer title="Checkout Settings" backButton={true}>
      <div className={styles.container}>
        <div className={styles.cont2}>
          <Clickable
            className={styles.button}
            onClick={() => {
              setState('rules');
              if (isFree) {
                setState('');
                openPlans();
              }
            }}
          >
            {isFree && (<img className={styles.iconF} src={featureIcon} alt="" />)}
            <img src={paymentRulesIcon} alt="" />
            Payment Rules
          </Clickable>
          <Clickable
            className={styles.button}
            onClick={() => {
              setState('login');
            }}
          >
            <img src={loginSettingsIcon} alt="" />
            Login Settings
          </Clickable>
        </div>
        <div className={styles.kbc}>
          <Kbc type="checkSettings" />
        </div>
      </div>
      {state === 'login' && (
        <LoginSettings onClose={onClose} />
      )}
      {state === 'rules' && (
        <PaymentRules onClose={onClose} />
      )}
    </Drawer>
  );
}

Checkout.propTypes = {};

Checkout.defaultProps = {};

export default Checkout;
