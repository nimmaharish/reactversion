import _ from 'lodash';
import { longDateFormat } from 'utils';

export function addressToArray(address) {
  return [
    { name: 'Name', value: address?.name ?? '' },
    { name: 'Mobile Number', value: address?.phone ?? '' },
    { name: 'Address Line 1', value: address?.addressLine1 ?? '' },
    { name: 'Address Line 2', value: address?.addressLine2 ?? '' },
    { name: 'Landmark', value: address?.landmark ?? '' },
    { name: 'City', value: address?.city ?? '' },
    { name: 'Pincode / Zipcode', value: address?.pincode ?? '' },
    { name: 'State', value: address?.state ?? '' },
    { name: 'Country', value: address?.country ?? '' },
    { name: 'Email', value: address?.email ?? '' },
  ];
}

export function addressToString(address) {
  return [
    address?.addressLine1 ?? '',
    address?.addressLine2 ?? '',
    address?.landmark ?? '',
    address?.city ?? '',
    address?.pincode ?? '',
    address?.state ?? '',
    address?.country ?? '',
  ].join(', ');
}

export function contactDetailsToArray(address) {
  return [
    { name: 'Name', value: address?.name ?? '' },
    { name: 'Email', value: address?.email ?? '' },
    { name: 'Mobile Number', value: address?.phone ?? '' },
  ];
}

export function mapOrderHistory(order, trackingHistory = [], edd) {
  const outForDelivery = trackingHistory.find(x => x.status === 'out for delivery');
  const delivered = trackingHistory.find(x => x.status === 'delivered');
  const cancelled = trackingHistory.find(x => x.status === 'cancelled');
  const history = (
    order.statusHistory || []
  ).filter(s => ['payment successful', 'confirmed', 'ready to ship'].includes(s.status))
    .map(({ status, at: date, date: other }) => {
      switch (status) {
        case 'payment successful':
          return {
            status,
            date: `Paid on ${longDateFormat(date || other)}`,
            color: 'yellow',
          };
        case 'confirmed':
          return {
            status: 'Order Confirmed',
            date: `Confirmed on ${longDateFormat(date || other)}`,
            color: 'yellow',
          };
        case 'ready to ship':
          return {
            status: 'Order is Ready to Ship',
            date: longDateFormat(date || other),
            color: 'yellow',
          };
        default:
          return {
            status,
            date: longDateFormat(date || other),
            color: 'yellow',
          };
      }
    }).reverse();

  if (trackingHistory.length < 2 && history.length > 0) {
    history[0].color = 'green';
  }

  const [, ...rest] = trackingHistory;

  const readyToShip = (order.statusHistory || []).find(x => x.status === 'ready to ship');

  if (!readyToShip) {
    history.unshift({
      status: 'Order is ready to ship',
      date: '',
      color: 'grey',
    });
  }

  const restHistory = rest.map(s => ({
    status: s.status,
    note: s.note,
    date: longDateFormat(s.at),
    color: 'yellow',
  })).reverse();

  if (restHistory.length > 0) {
    restHistory[0].color = 'green';
  }

  history.unshift(...restHistory);

  if (!cancelled) {
    if (!outForDelivery && !delivered) {
      history.unshift({
        status: 'Out For Delivery',
        date: '',
        color: 'grey',
      });
    }

    if (!delivered) {
      history.unshift({
        status: 'Delivered',
        date: edd ? `Estimated delivery date ${longDateFormat(edd)}` : '',
        color: 'grey',
      });
    }
  }

  return _.uniqBy(history, 'status');
}

export const getBadgeVariant = status => {
  switch (status) {
    case 'cancelled':
    case 'cart cancelled':
      return 'error';
    case 'delivered':
      return 'secondary';
    default:
      return 'primary';
  }
};
