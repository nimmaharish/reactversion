/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureConfig } from 'contexts';
import { Route } from 'react-router-dom';
import { ViewPlanModel } from 'containers/subscriptions/ViewPlanModel';

export function FeatureRoute({
  name,
  ...props
}) {
  const config = useFeatureConfig();
  if (!config[name]) {
    return <ViewPlanModel forceOpen={true} />;
  }
  return (
    <Route {...props} />
  );
}

FeatureRoute.propTypes = {
  name: PropTypes.string.isRequired,
};

FeatureRoute.defaultProps = {};
