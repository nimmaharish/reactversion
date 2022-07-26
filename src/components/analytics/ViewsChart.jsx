import PropTypes from 'prop-types';
import {
  Bar, BarChart, Legend, Tooltip, XAxis, YAxis
} from 'recharts';
import React from 'react';
import _ from 'lodash';
import { useDesktop } from 'contexts';
import moment from 'moment';

const viewsToList = (users, dates) => _.sortBy(dates.map(date => ({
  date: moment(date),
  shop: (users[date]?.shop?.screenPageViews || 0),
  product: (users[date]?.product?.screenPageViews || 0),
})), 'date')
  .map(x => ({
    ...x,
    date: x.date.format('DD/MMM')
  }));

export function ViewsChart({
  users,
  dates,
  syncId
}) {
  const list = viewsToList(users, dates);
  const isDesktop = useDesktop();

  return (
    <>
      {isDesktop && (
        <BarChart
          width={window.screen.width - 370}
          height={window.screen.height * 0.3}
          data={list}
          syncId={syncId}
        >
          <XAxis dataKey="date" />
          <YAxis width={25} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar name="Shop Views" type="monotone" dataKey="shop" fill="#7cb5ec" />
          <Bar name="Product Views" type="monotone" dataKey="product" fill="#66bb6a" />
        </BarChart>
      )}
      {!isDesktop && (
        <BarChart
          width={window.screen.width - 30}
          height={window.screen.height * 0.3}
          data={list}
          syncId={syncId}
        >
          <XAxis dataKey="date" />
          <YAxis width={25} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar name="Shop Views" type="monotone" dataKey="shop" fill="#7cb5ec" />
          <Bar name="Product Views" type="monotone" dataKey="product" fill="#66bb6a" />
        </BarChart>
      )}
    </>

  );
}

ViewsChart.propTypes = {
  users: PropTypes.object.isRequired,
  dates: PropTypes.array.isRequired,
  syncId: PropTypes.string,
};

ViewsChart.defaultProps = {
  syncId: undefined,
};
