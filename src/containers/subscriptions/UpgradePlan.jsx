import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import featureIcon from 'assets/overview/featureNew.svg';
import { useIsFreeTrialEnabled, useRefreshShop, useIsFreeTrialSubscribed } from 'contexts';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import { Button } from 'phoenix-components';
import styles from './ViewPlanModel.module.css';

export function UpgradePlan({
  title,
  subTitle,
  helper,
  planName,
}) {
  const freeTrialEnabled = useIsFreeTrialEnabled();
  const isSubscribed = useIsFreeTrialSubscribed();
  const history = useHistory();
  const refreshShop = useRefreshShop();

  const onClick = async () => {
    if (!freeTrialEnabled) {
      history.replace('/subscriptions');
      return;
    }
    Loader.show();
    try {
      await Becca.startFreeTrail();
      await refreshShop();
      history.replace('/subscriptions');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      <img className={styles.iconF} src={featureIcon} alt="" />
      <div className={styles.bg}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.subTitle}>
          {subTitle}
          <div className={styles.helper}>
            {helper}
          </div>
        </div>
        <div className={styles.buttons}>
          {freeTrialEnabled && !isSubscribed && (
            <Button
              bordered={false}
              label="START 14-DAY FREE TRAIL"
              size="large"
              onClick={onClick}
              className={styles.buttonD}
              primary={false}
              fullWidth
            />
          )}
          <Button
            fullWidth
            bordered={false}
            size="large"
            className={styles.borderB}
            label="VIEW PLANS"
            onClick={() => (planName
              ? (history.push(`/subscriptions?planName=${planName}`)) : history.push('/subscriptions'))}
          />
        </div>
      </div>
    </>
  );
}

UpgradePlan.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  helper: PropTypes.string,
  planName: PropTypes.string,
};

UpgradePlan.defaultProps = {
  title: 'UPGRADE NOW',
  subTitle: 'Grow your business & sales with our premium features.',
  helper: 'Upgrade now for more features & enhance your customers shopping experience.',
  planName: null,
};
