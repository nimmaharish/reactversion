import PropTypes from 'prop-types';
import {
  Legend, Line, LineChart, Tooltip, XAxis, YAxis
} from 'recharts';
import React from 'react';
import _ from 'lodash';
import { useDesktop } from 'contexts';
import moment from 'moment';

const orderToList = (orders, dates) => _.sortBy(dates.map(date => ({
  date: moment(date),
  orders: orders[date]?.orders ?? 0,
  carts: orders[date]?.cart ?? 0,
})), 'date')
  .map(x => ({
    ...x,
    date: x.date.format('DD/MMM')
  }));

export function OrdersChart({ orders, dates, syncId }) {
  const list = orderToList(orders, dates);
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
          <YAxis allowDecimals={false} width={25} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line name="Orders" type="linear" dataKey="orders" stroke="#66bb6a" />
          <Line name="Carts" type="linear" dataKey="carts" stroke="#CB7E93" />
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
          <YAxis allowDecimals={false} width={25} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line name="Orders" type="linear" dataKey="orders" stroke="#66bb6a" />
          <Line name="Carts" type="linear" dataKey="carts" stroke="#CB7E93" />
        </LineChart>
      )}
    </>
  );
}

OrdersChart.propTypes = {
  orders: PropTypes.object.isRequired,
  dates: PropTypes.array.isRequired,
  syncId: PropTypes.string,
};

OrdersChart.defaultProps = {
  syncId: undefined,
};
