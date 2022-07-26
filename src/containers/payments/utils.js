import _ from 'lodash';
import moment from 'moment';

export const windoCashStates = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Credits',
    value: 'credits',
  },
  {
    label: 'Debits',
    value: 'debits',
  }
];

export const windoCreditStates = [
  {
    label: 'My Rewards',
    value: 'rewards',
  },
  {
    label: 'Redemptions',
    value: 'redeem',
  }
];

export const FilterMap = {
  rewards: {
    operation: 'add',
  },
  redeem: {
    operation: 'subtract',
  },
  all: {
  },
  credits: {
    operation: 'add',
  },
  debits: {
    operation: 'subtract',
  },
};

export const isPaymentsActive = (shop) => {
  const isOnlineActive = _.get(shop, 'paymentModes.online.enabled', false);
  const isCPActive = _.get(shop, 'paymentModes.online.enabled', false);
  const isCodActive = _.get(shop, 'paymentModes.online.enabled', false);
  return isCPActive || isCodActive || isOnlineActive;
};

export const stateList = [
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
    value: 'lastweek',
  },
  {
    label: 'Last Month',
    value: 'lastmonth',
  },
  {
    label: 'Last 3 Months',
    value: 'last3mon',
  },
  {
    label: 'Last 6 Months',
    value: 'last6mon',
  },
  {
    label: 'Last Year',
    value: 'lastyear',
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
  lastweek: formatDate(moment().add(-1, 'week'), moment().endOf('day')),
  lastmonth: formatDate(moment().add(-1, 'month'), moment().endOf('day')),
  last3mon: formatDate(moment().add(-3, 'month'), moment().endOf('day')),
  last6mon: formatDate(moment().add(-6, 'month'), moment().endOf('day')),
  lastyear: formatDate(moment().add(-1, 'year'), moment().endOf('day')),
};

export const psFilterList = [
  {
    label: 'Paid',
    value: 'payment_success',
  },
  {
    label: 'Pending',
    value: 'payment_pending',
  },
  {
    label: 'Failed',
    value: 'payment_failed',
  },
  {
    label: 'Not Paid',
    value: 'not_paid',
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
    label: 'Partially Refunded',
    value: 'partial_refunded',
  },
  {
    label: 'Partial Paid',
    value: 'payment_partial',
  },
];

export const psFilterMap = {
  payment_pending: {
    status: ['payment pending', 'payment custom', 'payment cod']
  },
  payment_success: {
    status: ['payment successful']
  },
  payment_failed: {
    status: ['payment failed']
  },
  not_paid: {
    status: ['not paid']
  },
  refund_initiated: {
    status: ['refund initiated']
  },
  refunded: {
    status: ['refunded']
  },
  partial_refunded: {
    status: ['partial refunded']
  },
};

export const psStatusFilters = (queryString) => {
  const selected = !_.isEmpty(queryString) ? queryString.split(',') : [];
  const items = selected.map(y => psFilterMap[y]);
  if (!_.isEmpty(items)) {
    return ({ $or: _.flatten(items) });
  }
  return {};
};

export const pmStatusFilters = (rules, queryString) => {
  const selected = !_.isEmpty(queryString) ? queryString.split(',') : [];
  const items = selected.map(y => {
    const paymentMode = rules.find(x => x.value === y);
    const isOnline = paymentMode.type === 'online';
    const isCustomPayment = paymentMode.type === 'customPayment';
    const filter = {
      'payments.paymentMode': isCustomPayment ? 'custompayment' : paymentMode.type,
    };
    if (isOnline) {
      filter['payments.vendor'] = paymentMode.value;
    }
    if (isCustomPayment) {
      filter['payments.customPaymentDetails.mode'] = paymentMode.name;
    }
    return filter;
  });
  if (!_.isEmpty(items)) {
    return { $or: items };
  }
  return {};
};

export const extractPsFilters = (filters) => {
  const items = filters?.$or?.map(x => x.status).flat();
  if (items) {
    return ({ status: items });
  }
  return null;
};

export const extractPmFilters = (filters) => {
  const items = filters?.$or;
  if (items) {
    return ({ modes: items });
  }
  return null;
};
