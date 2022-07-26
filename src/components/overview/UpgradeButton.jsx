import React from 'react';
import rocketIcon from 'assets/images/subscriptions/rocket.svg';
import { Link } from 'react-router-dom';
import { useIsFreeTrialEnabled } from 'contexts';
import styles from './UpgradeButton.module.css';

export function UpgradeButton() {
  const freeTrailEnabled = useIsFreeTrialEnabled();
  return (
    <Link to={freeTrailEnabled ? '/?openPlans=true' : '/subscriptions'} className={styles.button}>
      <img className={styles.icon} src={rocketIcon} alt="" />
      <span>Upgrade</span>
    </Link>
  );
}

UpgradeButton.propTypes = {};

UpgradeButton.defaultProps = {};
