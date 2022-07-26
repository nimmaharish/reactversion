import React from 'react';
import { Dialog } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import PropTypes from 'prop-types';
import { UpgradePlan } from 'containers/subscriptions/UpgradePlan';
import styles from './ViewPlanModel.module.css';

export function ViewPlanModel({ forceOpen }) {
  const history = useHistory();
  const params = useQueryParams();
  const openPlans = params.has('openPlans');
  const isPlanNameIncluded = params.has('planName');
  const type = openPlans ? params.get('openPlans') : 'generic';
  const planName = isPlanNameIncluded ? params.get('planName') : null;

  const list = {
    helloBar: 'Upgrade now to unlock promotional banners',
    abandonCart: 'Upgrade now to unlock cart abandoned orders',
    analytics: 'Upgrade now to unlock full analytics report',
    generic: ' Grow your business & sales with our premium features.',
    themes: 'Upgrade now to unlock multiple themes',
    coupons: 'Upgrade now to unlock discount coupons'
  };

  const onClose = () => {
    history.goBack();
  };

  return (
    <Dialog
      classes={{
        paper: styles.padding
      }}
      open={openPlans || forceOpen}
      onClose={onClose}
    >
      <UpgradePlan icon={true} subTitle={list[type] || list.generic} planName={planName} />
    </Dialog>
  );
}

ViewPlanModel.propTypes = {
  forceOpen: PropTypes.bool,
};

ViewPlanModel.defaultProps = {
  forceOpen: false,
};
