import moment from 'moment';
import _ from 'lodash';

export const FilterMap = {
  all: {
    status: {
      $nin: ['cart cancelled']
    }
  },
  active: {
    status: {
      $nin: ['cancelled',
        'delivered', 'rto delivered', 'cart cancelled', 'payment pending',
        'payment custom', 'picked up', 'payment cod']
    }
  },
  cancelled: {
    status: {
      $in: ['cart cancelled', 'cancelled']
    }
  },
  delivered: [
    {
      status: {
        $in: ['delivered', 'rto delivered']
      }
    },
    {
      'shippingGroups.status': {
        $in: ['delivered', 'rto delivered']
      }
    }
  ],
  incart: {
    status: {
      $in: ['payment pending', 'payment custom', 'payment cod']
    },
    paid: {
      $eq: 0,
    }
  },
  confirmed: [
    {
      status: {
        $in: ['confirmed']
      }
    },
    {
      'items.status': {
        $in: ['confirmed']
      }
    }
  ],
  transit: {
    'shippingGroups.status': {
      $in: ['in transit', 'rto in transit', 'shipped', 'picked up', 'processing', 'out for delivery']
    }
  },
  payment_pending: {
    status: {
      $in: ['payment pending', 'payment custom', 'payment cod']
    }
  },
  payment_success: {
    status: {
      $in: ['payment successful']
    }
  },
  payment_cod: {
    status: {
      $in: ['payment cod']
    }
  },
  ready_to_ship: {
    'shippingGroups.status': {
      $in: ['ready to ship']
    }
  },
};

export const placedList = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Today',
    value: 'today',
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
  },
  {
    label: 'Last Week',
    value: 'week',
  },
  {
    label: 'Last Month',
    value: 'month',
  },
  {
    label: 'Last 3 Months',
    value: '3mon',
  },
  {
    label: 'Last 6 Months',
    value: '6mon',
  },
  {
    label: 'Last Year',
    value: 'year',
  }
];

export const formatDate = (from, to) => {
  if (from && !to) {
    return { createdAt: { $gte: from } };
  }
  if (!from && to) {
    return { createdAt: { $lte: to } };
  }

  return { createdAt: { $gte: from, $lte: to } };
};

export const dateFilters = {
  all: null,
  today: formatDate(moment().startOf('day')),
  yesterday: formatDate(moment().startOf('day').add(-1, 'day'), moment().startOf('day')),
  week: formatDate(moment().add(-1, 'week'), moment().endOf('day')),
  month: formatDate(moment().add(-1, 'month'), moment().endOf('day')),
  '3mon': formatDate(moment().add(-3, 'month'), moment().endOf('day')),
  '6mon': formatDate(moment().add(-6, 'month'), moment().endOf('day')),
  year: formatDate(moment().add(-1, 'year'), moment().endOf('day')),
};

export const orderShippingStatusLabels = [
  {
    label: 'Not Shipped',
    value: 'not_shipped',
  },
  {
    label: 'Dispatch Ready',
    value: 'dispatch_ready',
  },
  {
    label: 'In Transit',
    value: 'in_transit',
  },
  {
    label: 'Out for Delivery',
    value: 'out_for_delivery',
  },
  {
    label: 'Delivery Failed',
    value: 'failed_delivery',
  },
  {
    label: 'Delivered',
    value: 'delivered',
  },
  {
    label: 'Returned',
    value: 'returned',
  },
  {
    label: 'Ready for Pickup',
    value: 'ready_for_pickup',
  },
  {
    label: 'Customer Picked-up',
    value: 'customer_picked_up',
  },
  {
    label: 'Pick-up Delayed',
    value: 'pickup_delayed',
  },
  {
    label: 'Pick-up Failed',
    value: 'pickup_failed',
  },
  {
    label: 'Pick-up Rescheduled',
    value: 'pickup_rescheduled',
  },
  {
    label: 'Shipping Rescheduled',
    value: 'shipping_rescheduled',
  },
  {
    label: 'Shipping Delayed',
    value: 'shipping_delayed',
  },
  {
    label: 'Shipping Failed',
    value: 'shipping_pending',
  },
];

export const orderStatusLabels = [
  {
    label: 'Accepted',
    value: 'confirmed',
  },
  {
    label: 'Received',
    value: 'created',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
  {
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

export const paymentStatusLabels = [
  {
    label: 'Paid',
    value: 'payment_successful',
  },
  {
    label: 'Pending',
    value: 'payment_pending',
  },
  {
    label: 'Not Paid',
    value: 'not_paid',
  },
  {
    label: 'Failed',
    value: 'payment_failed',
  },
  {
    label: 'Refund Initiated',
    value: 'refund_initiated',
  },
  {
    label: 'Refunded',
    value: 'refunded',
  },
  {
    label: 'Partial Paid',
    value: 'payment_partial',
  },
  {
    label: 'Partial refunded',
    value: 'partial_refunded',
  },
];

export const osFilterMap = {
  confirmed: ['confirmed'],
  created: ['created'],
  rejected: ['rejected'],
  cancelled: ['cancelled'],
  in_progress: ['in progress'],
  completed: ['completed'],
  archived: ['archived']
};

export const psFilterMap = {
  payment_successful: ['payment successful'],
  payment_pending: ['payment custom', 'payment cod', 'payment pending'],
  not_paid: ['not paid'],
  payment_failed: ['payment failed'],
  refund_initiated: ['refund initiated'],
  refunded: ['refunded'],
  payment_partial: ['payment partial'],
  partial_refunded: ['partial refunded'],
};

export const ssFilterMap = {
  not_shipped: ['not shipped'],
  dispatch_ready: ['dispatch ready'],
  in_transit: ['in transit'],
  out_for_delivery: ['out for delivery'],
  failed_delivery: ['failed delivery'],
  delivered: ['delivered'],
  returned: ['returned'],
  ready_for_pickup: ['ready for pickup'],
  customer_picked_up: ['customer picked up'],
  pickup_delayed: ['pickup delayed'],
  pickup_failed: ['pickup defailedlayed'],
  pickup_rescheduled: ['pickup rescheduled'],
  shipping_rescheduled: ['shipping rescheduled'],
  shipping_delayed: ['shipping delayed'],
  shipping_pending: ['shipping pending'],
};

export const osStatusFilters = (queryString) => {
  const selected = !_.isEmpty(queryString) ? queryString.split(',') : [];
  const items = selected.map(y => osFilterMap[y]);
  if (!_.isEmpty(items)) {
    return ({ orderStatus: _.flatten(items) });
  }
  return {};
};

export const psStatusFilters = (queryString) => {
  const selected = !_.isEmpty(queryString) ? queryString.split(',') : [];
  const items = selected.map(y => psFilterMap[y]);
  if (!_.isEmpty(items)) {
    return ({ paymentStatus: _.flatten(items) });
  }
  return {};
};

export const ssStatusFilters = (queryString) => {
  const selected = !_.isEmpty(queryString) ? queryString.split(',') : [];
  const items = selected.map(y => ssFilterMap[y]);
  if (!_.isEmpty(items)) {
    return ({ shippingStatus: _.flatten(items) });
  }
  return {};
};
