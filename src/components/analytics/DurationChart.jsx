import PropTypes from 'prop-types';
import {
  Area, AreaChart, Legend, Tooltip, XAxis, YAxis
} from 'recharts';
import React from 'react';
import _ from 'lodash';
import { useDesktop } from 'contexts';
import moment from 'moment';

const durationToList = (users, dates) => _.sortBy(dates.map(date => ({
  date: moment(date),
  shop: ((users[date]?.shop?.userEngagementDuration || 0) / 60).toFixed(2),
  product: ((users[date]?.product?.userEngagementDuration || 0) / 60).toFixed(2),
})), 'date')
  .map(x => ({
    ...x,
    date: x.date.format('DD/MMM')
  }));

export function DurationChart({
  users,
  dates,
  syncId
}) {
  const list = durationToList(users, dates);
  const isDesktop = useDesktop();
  return (
    <>
      {isDesktop && (
        <AreaChart
          width={window.screen.width - 370}
          height={window.screen.height * 0.3}
          data={list}
          syncId={syncId}
        >
          <defs>
            <linearGradient id="shopDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="productDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis width={30} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area
            name="Shop"
            type="linear"
            dataKey="shop"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#shopDuration)"
          />
          <Area
            name="Products"
            type="linear"
            dataKey="product"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#productDuration)"
          />
        </AreaChart>
      )}
      {!isDesktop && (
        <AreaChart
          width={window.screen.width - 30}
          height={window.screen.height * 0.3}
          data={list}
          syncId={syncId}
        >
          <defs>
            <linearGradient id="shopDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="productDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis width={30} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area
            name="Shop"
            type="linear"
            dataKey="shop"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#shopDuration)"
          />
          <Area
            name="Products"
            type="linear"
            dataKey="product"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#productDuration)"
          />
        </AreaChart>
      )}
    </>

  );
}

DurationChart.propTypes = {
  users: PropTypes.object.isRequired,
  dates: PropTypes.array.isRequired,
  syncId: PropTypes.string,
};

DurationChart.defaultProps = {
  syncId: undefined,
};
