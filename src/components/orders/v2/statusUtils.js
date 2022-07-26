import { capitalCase } from 'change-case';

export const PAYMENT_STATUS_LIST = [
  {
    label: 'Pending',
    value: 'payment pending'
  },
  {
    label: 'Paid',
    value: 'payment successful'
  },
  {
    label: 'Not Paid',
    value: 'not paid'
  },
  {
    label: 'Failed',
    value: 'payment failed'
  },
  {
    label: 'Refund Initiated',
    value: 'refund initiated'
  },
  {
    label: 'Refunded',
    value: 'refunded'
  }
];

export const ORDER_STATUS_LIST = [
  {
    label: 'Accepted',
    value: 'confirmed'
  },
  {
    label: 'Rejected',
    value: 'rejected'
  },
  {
    label: 'Cancelled',
    value: 'cancelled'
  },
  {
    label: 'In Progress',
    value: 'in progress'
  },
  {
    label: 'Completed',
    value: 'completed'
  },
];

export const SHIPPING_STATUS_LIST = [
  {
    label: 'Not Shipped',
    value: 'not shipped'
  },
  {
    label: 'Dispatch Ready',
    value: 'dispatch ready'
  },
  {
    label: 'In transit',
    value: 'in transit'
  },
  {
    label: 'Out for Delivery',
    value: 'out for delivery'
  },
  {
    label: 'Delivery Failed',
    value: 'failed delivery'
  },
  {
    label: 'Delivered',
    value: 'delivered'
  },
  {
    label: 'Returned',
    value: 'returned'
  },
  {
    label: 'Ready for Pickup',
    value: 'ready for pickup'
  },
  {
    label: 'Customer Picked-up',
    value: 'customer picked up'
  },
  {
    label: 'Pick-up Delayed',
    value: 'pickup delayed'
  },
  {
    label: 'Pick-up Failed',
    value: 'pickup failed'
  },
  {
    label: 'Pick-up Rescheduled',
    value: 'pickup rescheduled'
  },
  {
    label: 'Shipping Rescheduled',
    value: 'shipping rescheduled'
  },
  {
    label: 'Shipping Delayed',
    value: 'shipping delayed'
  },
];

export const ORDER_STATUS_MAP = {
  created: 'Received',
  confirmed: 'Accepted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  'in progress': 'In Progress',
  completed: 'Completed',
};

export const PAYMENT_STATUS_MAP = {
  'payment pending': 'Pending',
  'payment successful': 'Paid',
  'not paid': 'Not Paid',
  'payment failed': 'Failed',
  'refund initiated': 'Refund Initiated',
  refunded: 'Refunded',
  'payment custom': 'Pending',
  'payment cod': 'Pending',
  'payment partial': 'Partial Paid',
  'partial refunded': 'Partial refunded'
};

export const SHIPPING_STATUS_MAP = {
  'not shipped': 'Not Shipped',
  'dispatch ready': 'Dispatch Ready',
  'in transit': 'In Transit',
  'out for delivery': 'Out for Delivery',
  'failed delivery': 'Delivery Failed',
  delivered: 'Delivered',
  returned: 'Returned',
  'ready for pickup': 'Ready for Pickup',
  'customer picked up': 'Customer Picked-up',
  'pickup delayed': 'Pick-up Delayed',
  'pickup failed': 'Pick-up Failed',
  'pickup rescheduled': 'Pick-up Rescheduled',
  'shipping rescheduled': 'Shipping Rescheduled',
  'shipping delayed': 'Shipping Delayed',
  'shipping pending': 'Shipping Failed'
};

export function getOrderStatusLabel(status) {
  return ORDER_STATUS_MAP[status] || 'In progress';
}

export function getPaymentStatusLabel(status) {
  return PAYMENT_STATUS_MAP[status] || 'Pending';
}

export function getShippingStatusLabel(status) {
  return SHIPPING_STATUS_MAP[status] || capitalCase(status);
}
