import moment from 'moment';
import { isEmpty, get } from 'lodash';

export const formatDate = (from, to, createdAt = true) => {
  const key = createdAt ? 'createdAt' : 'updatedAt';
  if (from && !to) {
    return { [key]: { $gte: from } };
  }
  if (!from && to) {
    return { [key]: { $lte: to } };
  }

  return { [key]: { $gte: from, $lte: to } };
};

export const dateFilters = {
  all: null,
  today: formatDate(moment().startOf('day')),
  yesterday: formatDate(moment().startOf('day').add(-1, 'day'), moment().startOf('day')),
  week: formatDate(moment().add(-1, 'week'), moment().endOf('day')),
  lastweek: formatDate(moment().add(-1, 'week'), moment().endOf('day')),
  month: formatDate(moment().add(-1, 'month'), moment().endOf('day')),
  lastmonth: formatDate(moment().add(-1, 'month'), moment().endOf('day')),
  '3mon': formatDate(moment().add(-3, 'month'), moment().endOf('day')),
  last3mon: formatDate(moment().add(-3, 'month'), moment().endOf('day')),
  '6mon': formatDate(moment().add(-6, 'month'), moment().endOf('day')),
  last6mon: formatDate(moment().add(-6, 'month'), moment().endOf('day')),
  year: formatDate(moment().add(-1, 'year'), moment().endOf('day')),
  lastyear: formatDate(moment().add(-1, 'year'), moment().endOf('day')),
};

export const updatedFilters = {
  all: null,
  today: formatDate(moment().startOf('day'), moment(), false),
  yesterday: formatDate(moment().startOf('day').add(-1, 'day'), moment().startOf('day'), false),
  week: formatDate(moment().add(-1, 'week'), moment().endOf('day'), false),
  month: formatDate(moment().add(-1, 'month'), moment().endOf('day'), false),
  '3mon': formatDate(moment().add(-3, 'month'), moment().endOf('day'), false),
  '6mon': formatDate(moment().add(-6, 'month'), moment().endOf('day'), false),
  year: formatDate(moment().add(-1, 'year'), moment().endOf('day'), false),
};

export const customDateFilters = (from,
  to, createdAt = true,) => formatDate(moment(from).startOf('day'), moment(to).endOf('day'), createdAt);

export const getText = (dateRangeFilters) => {
  const isEmptyFrom = isEmpty(dateRangeFilters?.from);
  const isEmptyTo = isEmpty(dateRangeFilters?.to);
  if (isEmptyFrom && isEmptyTo) {
    return 'Select Date';
  }
  if (moment(dateRangeFilters.from).format('MMM D') === moment(dateRangeFilters.to).format('MMM D')) {
    return moment(dateRangeFilters.to).format('MMM D YYYY');
  }
  return `${moment(dateRangeFilters.from).format('MMM D')} - ${moment(dateRangeFilters.to).format('MMM D, YYYY')}`;
};

export const getFeatureFromLoad = (shop, key) => {
  const val = get(shop, `plan.config.${key}`, false);
  return val;
};
