import React, { useState } from 'react';
import { Summary } from 'components/analytics/Summary';
import { SummaryDesktop } from 'components/analytics/SummaryDesktop';
import { Drawer } from 'components/shared/Drawer';
import { useShopCohort } from 'hooks/analytics';
import { OrdersChart } from 'components/analytics/OrdersChart';
import { UsersChart } from 'components/analytics/UsersChart';
import { ViewsChart } from 'components/analytics/ViewsChart';
import moment from 'moment';
import { DurationChart } from 'components/analytics/DurationChart';
import { Loading } from 'components/shared/Loading';
import { useHistory } from 'react-router-dom';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useDesktop } from 'contexts';
import { Clickable } from 'phoenix-components';
import { MenuItem, Select } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './Analytics.module.css';

function getFilters(type) {
  switch (type) {
    case 'week':
      return {
        date: {
          $gte: moment()
            .startOf('week'),
          $lte: moment()
            .endOf('day'),
        }
      };
    case 'month':
      return {
        date: {
          $gte: moment()
            .startOf('month'),
          $lte: moment()
            .endOf('day'),
        }
      };
    case 'lastWeek':
      return {
        date: {
          $gte: moment()
            .startOf('week')
            .subtract(1, 'week'),
          $lte: moment()
            .startOf('week')
            .subtract(1, 'week')
            .endOf('week'),
        }
      };
    case 'lastMonth':
      return {
        date: {
          $gte: moment()
            .startOf('month')
            .subtract(1, 'month'),
          $lte: moment()
            .startOf('month')
            .subtract(1, 'month')
            .endOf('month'),
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
const getDates = filter => {
  let start = moment(filter.$gte);
  const end = filter.$lte;
  const list = [];
  while (start <= end) {
    list.push(start.format('YYYY-MM-DD'));
    start = start.add(1, 'day');
  }
  return list;
};

const labels = [
  { label: 'This Week', value: 'week' },
  { label: 'Last Week', value: 'lastWeek' },
  { label: 'This Month', value: 'month' },
  { label: 'Last Month', value: 'lastMonth' },
];

function Analytics() {
  const isDesktop = useDesktop();
  const history = useHistory();
  const [duration, setDuration] = useState('month');
  const filters = getFilters(duration);
  const [summary] = useShopCohort(filters);
  const dates = getDates(filters.date);
  if (!summary) {
    return <Loading />;
  }
  return (
    <>
      {isDesktop && (
        <div className={styles.container}>
          <div className={styles.header}>
            <Clickable
              className={styles.deskBackButton}>
              <img src={chevronLeftDesk} alt="" onClick={history.goBack} />
            </Clickable>
            <div className={styles.desktopHeading}>
              Your full report
            </div>
          </div>
          <SummaryDesktop mini={true} heading="Today’s Report" />
          <div className={styles.heading}>
            Orders
            <Grid item xs={2}>
              <Select value={duration} onChange={e => setDuration(e.target.value)}>
                {labels.map(label => (
                  <MenuItem key={label.value} value={label.value}>{label.label}</MenuItem>
                ))}
              </Select>
            </Grid>
          </div>
          <div className={styles.chart}>
            <OrdersChart syncId="analytics" dates={dates} orders={summary.orders || {}} />
          </div>

          <div className={styles.heading}>
            Total Users
            <Grid item xs={2}>
              <Select value={duration} onChange={e => setDuration(e.target.value)}>
                {labels.map(label => (
                  <MenuItem key={label.value} value={label.value}>{label.label}</MenuItem>
                ))}
              </Select>
            </Grid>
          </div>
          <div className={styles.chart}>
            <UsersChart syncId="analytics" dates={dates} users={summary.users || {}} />
          </div>
          <div className={styles.heading}>
            Product Views
            <Grid item xs={2}>
              <Select value={duration} onChange={e => setDuration(e.target.value)}>
                {labels.map(label => (
                  <MenuItem key={label.value} value={label.value}>{label.label}</MenuItem>
                ))}
              </Select>
            </Grid>
          </div>
          <div className={styles.chart}>
            <ViewsChart syncId="analytics" dates={dates} users={summary.users || {}} />
          </div>
          <div className={styles.heading}>
            User Duration (minutes)
            <Grid item xs={2}>
              <Select value={duration} onChange={e => setDuration(e.target.value)}>
                {labels.map(label => (
                  <MenuItem key={label.value} value={label.value}>{label.label}</MenuItem>
                ))}
              </Select>
            </Grid>
          </div>
          <div className={styles.chart}>
            <div className={styles.heading}></div>
            <DurationChart syncId="analytics" dates={dates} users={summary.users || {}} />
          </div>
          <div className="flexCenter fullWidth">
            <Kbc type="shopanalytics" />
          </div>
        </div>
      )}
      {!isDesktop
        && (
          <Drawer title="Shop Analytics" containerClass={styles.background} topBarClass={styles.background}>
            <div className={styles.container}>
              <Summary mini={true} heading="Summary" />
              <div className={styles.select}>
                <Select value={duration} onChange={e => setDuration(e.target.value)}>
                  {labels.map(label => (
                    <MenuItem key={label.value} value={label.value}>{label.label}</MenuItem>
                  ))}
                </Select>
              </div>
              <div className={styles.chart}>
                <div className={styles.heading}>Orders</div>
                <OrdersChart syncId="analytics" dates={dates} orders={summary.orders || {}} />
              </div>
              <div className={styles.chart}>
                <div className={styles.heading}>Total Users</div>
                <UsersChart syncId="analytics" dates={dates} users={summary.users || {}} />
              </div>
              <div className={styles.chart}>
                <div className={styles.heading}>Views</div>
                <ViewsChart syncId="analytics" dates={dates} users={summary.users || {}} />
              </div>
              <div className={styles.chart}>
                <div className={styles.heading}>User Duration (minutes)</div>
                <DurationChart syncId="analytics" dates={dates} users={summary.users || {}} />
              </div>
              <div className={styles.kbc}>
                <Kbc type="shopanalytics" />
              </div>
            </div>
          </Drawer>
        )}
    </>
  );
}

Analytics.propTypes = {};

Analytics.defaultProps = {};

export default Analytics;
