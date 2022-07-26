import React from 'react';
import PropTypes from 'prop-types';
import { useIsFreePlan, useOpenPlans, useIsOnFreeTrial } from 'contexts/userContext';
import { LOGIN_DATA } from 'containers/profile/checkout/loginUtils';
import { Switch } from 'phoenix-components/lib/formik';
import featureIcon from 'assets/overview/feature.svg';
import { useField, useFormikContext } from 'formik';
import styles from './LoginCard.module.css';

export function LoginCard({ name, featured }) {
  const isFreePlan = useIsFreePlan();
  const IsOnFreeTrial = useIsOnFreeTrial();
  const card = LOGIN_DATA[name];
  const openPlans = useOpenPlans();
  const [,, { setValue }] = useField(`${name}.enabled`);
  const [,, { setValue: setDirect }] = useField('direct.enabled');
  const { values, setValues } = useFormikContext();
  // const name = direct ? 'direct' : name;);

  const onChange = (_e, val) => {
    if (val && isFreePlan && !IsOnFreeTrial && featured) {
      openPlans();
      return;
    }
    if (name === 'direct') {
      if (val) {
        const vals = { ...values };
        Object.keys(values).forEach(key => {
          vals[key].enabled = key === 'direct';
        });
        setValues(vals);
        return;
      }
    }
    setValue(val);
    if (val) {
      setDirect(false);
    }
  };

  if (!card) {
    return null;
  }

  return (
    <div className={name === 'guest' ? (styles.main1) : (styles.main)}>
      <div className={styles.container}>
        <img src={card.icon} alt="" />
        <div className={styles.middle}>
          <div className={styles.title}>
            <div>
              {card.title}
            </div>
            {isFreePlan && featured && !IsOnFreeTrial && <img className={styles.feature} src={featureIcon} alt="" />}
          </div>
          <div className={styles.subTitle}>{card.subTitle}</div>
        </div>
      </div>
      <div className={styles.right}>
        <Switch name={`${name}.enabled`} onChange={onChange} />
      </div>
    </div>
  );
}

LoginCard.propTypes = {
  name: PropTypes.string.isRequired,
  featured: PropTypes.bool,
};

LoginCard.defaultProps = {
  featured: false,
};
