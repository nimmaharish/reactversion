export const list = [
  {
    label: 'All Products',
    value: 'all'
  },
  {
    label: 'Live Products',
    value: 'live'
  },
  {
    label: 'Draft Products',
    value: 'draft'
  },
  {
    label: 'Out of stock',
    value: 'outofstock'
  },
  {
    label: 'Deleted',
    value: 'deleted'
  },
  {
    label: 'Hidden',
    value: 'hidden'
  },
];

export const FilterMap = {
  all: {
    status: {
      $in: ['live', 'created', 'out of stock', 'unlive', 'draft'],
    },
  },
  live: {
    status: {
      $in: ['live', 'created'],
    },
  },
  hidden: {
    status: {
      $in: ['unlive']
    },
  },
  outofstock: {
    status: {
      $in: ['out of stock']
    },
  },
  deleted: {
    status: {
      $in: ['deleted']
    },
  },
  draft: {
    status: {
      $in: ['draft']
    },
  }
};
