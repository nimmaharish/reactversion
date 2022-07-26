import PropTypes from 'prop-types';
import {
  Legend, Line, LineChart, Tooltip, XAxis, YAxis
} from 'recharts';
import React from 'react';
import _ from 'lodash';
import { useDesktop } from 'contexts';
import moment from 'moment';

const usersToList = (users, dates) => _.sortBy(dates.map(date => ({
  date: moment(date),
  totalUsers: (users[date]?.shop?.totalUsers || 0) + (users[date]?.product?.totalUsers || 0),
  newUsers: (users[date]?.shop?.newUsers || 0) + (users[date]?.product?.newUsers || 0),
  sessions: (users[date]?.shop?.newUsers || 0) + (users[date]?.product?.newUsers || 0),
})), 'date')
  .map(x => ({
    ...x,
    date: x.date.format('DD/MMM')
  }));

export function UsersChart({ users, dates, syncId }) {
  const list = usersToList(users, dates);
  const isDesktop = useDesktop();

  return (
    <>
      {isDesktop && (
        <LineChart
          width={window.screen.width - 370}
          height={window.screen.height * 0.3}
          data={list}
          syncId={syncId}
        >
          <XAxis dataKey="date" />
          <YAxis width={25} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line name="Total Users" dataKey="totalUsers" stroke="#7cb5ec" />
          <Line name="New Users" type="monotone" dataKey="newUsers" stroke="#66bb6a" />
          <Line name="Sessions" type="monotone" dataKey="sessions" stroke="#f7a35c" />
        </LineChart>
      )}
      {!isDesktop && (
        <LineChart
          width={window.screen.width - 30}
          height={window.screen.height * 0.3}
          data={list}
          syncId={syncId}
        >
          <XAxis dataKey="date" />
          <YAxis width={25} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line name="Total Users" dataKey="totalUsers" stroke="#7cb5ec" />
          <Line name="New Users" type="monotone" dataKey="newUsers" stroke="#66bb6a" />
          <Line name="Sessions" type="monotone" dataKey="sessions" stroke="#f7a35c" />
        </LineChart>
      )}

    </>
  );
}

UsersChart.propTypes = {
  users: PropTypes.object.isRequired,
  dates: PropTypes.array.isRequired,
  syncId: PropTypes.string,
};

UsersChart.defaultProps = {
  syncId: undefined,
};
