/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { useShopSummary } from 'hooks/analytics';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CircularProgress, Grid } from '@material-ui/core';
import visitorIcon from 'assets/images/analytics/visitorIcon.svg';
import productViewsIcon from 'assets/images/analytics/productViewsIcon.svg';
import cartIcon from 'assets/images/analytics/cartIcon.svg';
import ordersIcon from 'assets/images/analytics/ordersIcon.svg';
import fullReportIcon from 'assets/images/analytics/fullReport.svg';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { useIsAnalyticsEnabled, useOpenPlans } from 'contexts';
import { Clickable } from 'phoenix-components';
import styles from './Summary.module.css';

function getFilters(type) {
  switch (type) {
    case 'week':
      return {
        date: {
          $gte: moment()
            .startOf('day')
            .subtract(1, 'week'),
          $lte: moment()
            .endOf('day'),
        }
      };
    case 'month':
      return {
        date: {
          $gte: moment()
            .startOf('day')
            .subtract(1, 'month'),
          $lte: moment()
            .endOf('day'),
        }
      };
    default:
      return {
        date: {
          $gte: moment()
            .startOf('day'),
          $lte: moment()
            .endOf('day'),
        }
      };
  }
}

export function SummaryDesktop({
  heading,
  mini
}) {
  const [selected, setSelected] = useState('month');
  const history = useHistory();
  const [summary,, loading] = useShopSummary(getFilters(selected));
  const openPlans = useOpenPlans(false, 'analytics');
  const isAnalyticsEnabled = useIsAnalyticsEnabled();

  if (!summary || loading) {
    return (
      <div className={cx(styles.container, styles.loader)}>
        <CircularProgress variant="indeterminate" color="primary" />
      </div>
    );
  }

  const visitors = (summary?.users?.shop?.totalUsers ?? 0) + (summary?.users?.product?.totalUsers ?? 0);
  const productViews = (summary?.users?.shop?.screenPageViews ?? 0) + (summary?.users?.product?.screenPageViews ?? 0);
  const cart = summary?.orders?.cart ?? 0;
  const orders = summary?.orders?.orders ?? 0;

  const renderItem = (icon, text, value) => (
    <div className={styles.tile}>
      <img className={styles.tileIcon} src={icon} alt="" />
      <div className={styles.tileDetails}>
        <div className={styles.tileValue}>{value}</div>
        <div className={styles.tileText}>{text}</div>
      </div>
    </div>
  );

  const renderChip = (label, value) => (
    <Clickable
      onClick={() => setSelected(value)}
      className={cx(styles.chip, {
        [styles.selected]: selected === value
      })}>
      {label}
    </Clickable>
  );

  return (
    <div className={styles.container}>
      <div className={styles.firstRow}>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.chipContainer}>
          {renderChip('Daily', 'day')}
          {renderChip('Weekly', 'week')}
          {renderChip('Monthly', 'month')}
        </div>
      </div>

      <Grid container spacing={1} className={styles.cardContainer}>
        <Grid item xs={3} className={styles.desktopCard}>
          {renderItem(visitorIcon, 'Total visitors', visitors)}
        </Grid>
        <Grid item xs={3} className={styles.desktopCard}>
          {renderItem(productViewsIcon, 'Total product views', productViews)}
        </Grid>
        <Grid item xs={3} className={styles.desktopCard}>
          {renderItem(cartIcon, 'Added to cart', cart)}
        </Grid>
        <Grid item xs={3} className={styles.desktopCard}>
          {renderItem(ordersIcon, 'Orders received', orders)}
        </Grid>
      </Grid>

      {!mini && (
        <div className={styles.buttonContainer}>
          <Clickable
            className={styles.button}
            onClick={() => {
              if (isAnalyticsEnabled) {
                history.push('/overview/analytics');
                return;
              }
              openPlans();
            }}
          >
            View full report
            <img src={fullReportIcon} alt="" />
          </Clickable>
        </div>
      )}
    </div>
  );
}

SummaryDesktop.propTypes = {
  heading: PropTypes.string,
  mini: PropTypes.bool,
};

SummaryDesktop.defaultProps = {
  heading: '',
  mini: false,
};
