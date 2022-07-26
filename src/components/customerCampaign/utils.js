import moment from 'moment';
// import _ from 'lodash';
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

export const getQueryFilters = (name) => {
  if (name) {
    return { name };
  }
  return {};
};
