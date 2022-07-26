import { createContext, useContext } from 'react';
import { useShop } from 'contexts/userContext';
import _ from 'lodash';

export const OrderContext = createContext({
  order: null,
  ids: [],
  setIds: () => {
  },
  refresh: () => {
  }
});

export function useOrder() {
  return useContext(OrderContext).order;
}

export function useRefresh() {
  return useContext(OrderContext).refresh;
}

export function useGetIds() {
  return useContext(OrderContext).ids;
}

export function useSetIds() {
  return useContext(OrderContext).setIds;
}

export function useContent() {
  const order = useOrder();
  return order?.content;
}

export function useVariant() {
  const content = useContent();
  return _.get(content, 'variants[0]', null);
}

export function useMedia() {
  const content = useContent();
  const variant = useVariant();
  const skuImages = _.get(content, 'images', []);
  const skuVideos = _.get(content, 'videos', []);
  const variantImages = _.get(variant, 'images', []);
  const variantVideos = _.get(variant, 'videos', []);

  return {
    images: [...skuImages, ...variantImages].map(x => x.url),
    videos: [...skuVideos, ...variantVideos].map(x => x.url)
  };
}

export function useVariations() {
  const order = useOrder();
  const variant = useVariant();
  const quantity = _.get(order, 'quantity', 1);
  return Object.entries({
    ...(variant?.details || {}),
    ...{
      quantity,
    }
  })
    .map(([key, value]) => ({
      key,
      value,
    }));
}

export function useCustomizationMessage() {
  const order = useOrder();
  return _.get(order, 'note', '');
}

export function useProductName() {
  const content = useContent();
  return _.get(content, 'title', _.get(content, 'name', ''));
}

export function isOnlyPending() {
  const order = useOrder();
  const {
    groups: {
      shipped = [],
      confirmed = []
    }
  } = order;
  return shipped.length === 0 && confirmed.length === 0;
}

export function usePendingPricing() {
  const order = useOrder();
  // const { shippingCharges } = useContent();

  const { coupon } = order;

  const couponDiscount = coupon?.amount ?? 0;

  const {
    charges: {
      shipping = 0,
      customization = 0,
      pg = 0,
    } = {},
    tax: {
      amount = 0,
      value = {},
    }
  } = order;

  const pricing = [
    {
      name: 'Total Product Price',
      value: order.amount - amount,
      split: 1
    }
  ];

  if (amount > 0) {
    pricing.push({
      name: 'Tax',
      value: amount,
      split: 1
    });
  }
  if (shipping > 0) {
    pricing.push({
      name: 'Shipping Charges',
      value: shipping,
      split: 1
    });
  }

  if (customization > 0) {
    pricing.push({
      name: 'Customization Fee',
      value: customization,
      split: 1
    });
  }

  pricing.push({
    name: 'Total Product Discount',
    value: order.amount - order.discountedAmount,
    split: 2
  });

  if (couponDiscount > 0) {
    pricing.push({
      name: `Coupon Discount  [ ${coupon.code} ]`,
      value: couponDiscount,
      split: 2
    });
  }

  if (pg < 0) {
    pricing.push({
      name: 'Payment Gateway Fee Discount',
      value: Math.abs(pg),
      split: 2
    });
  } else if (pg > 0) {
    pricing.push({
      name: 'Payment Gateway Fee',
      value: Math.abs(pg),
      split: 1
    });
  }

  const total = order.payable - couponDiscount;

  return {
    pricing,
    total,
    taxes: value,
  };
}

export function useSettlement() {
  const order = useOrder();
  const shop = useShop();
  const { coupon } = order;

  const couponDiscount = coupon?.amount ?? 0;

  const total = order.payable - couponDiscount;

  const pGCharges = (shop?.country === 'india' ? total * 0.02 : 2.93).toFixed(2);

  const settlement = [
    {
      name: 'Total Paid By Customer',
      value: total.toFixed(2),
      split: 1
    },
  ];

  const commission = order?.charges?.windoCommission || 0;
  const paymentGateway = order?.charges?.paymentGateway || 0;
  if (paymentGateway === 0) {
    settlement.push(
      {
        name: 'Payment Gateway Charge Waiver',
        value: pGCharges,
        split: 1
      },
      {
        name: 'Payment Gateway Charges',
        value: pGCharges,
        split: 2
      }
    );
  } else {
    settlement.push(
      {
        name: 'Payment Gateway Charges',
        value: paymentGateway.toFixed(2),
        split: 2
      }
    );
  }

  if (commission > 0) {
    settlement.push(
      {
        name: 'Transaction Charges',
        value: commission.toFixed(2),
        split: 2
      },
    );
  }

  settlement.push({
    name: 'Settlement Amount',
    value: (total - paymentGateway - commission).toFixed(2),
    split: 3
  });

  return {
    settlement,
  };
}

export function useToAddress() {
  const { shipping: { to = {} } = {} } = useOrder();
  return to;
}

export function useToContactDetails() {
  const { shipping: { toContactDetails = {} } = {} } = useOrder();
  return toContactDetails;
}

export function usePaymentMode() {
  const order = useOrder();
  switch (order?.paymentMode) {
    case 'online':
      return 'Online';
    case 'cod':
      return 'Cash';
    case 'custompayment':
      return order?.customPaymentMode ?? 'Custom Payment';
    default:
      return 'Pending';
  }
}

export function useButton(name) {
  const order = useOrder();
  return _.get(order, `buttons.${name}`, false);
}

export function useEnableCustomization() {
  return useButton('enableCustomization');
}

export function useEnableTracking() {
  return useButton('enableTracking');
}

export function useEnableConfirm() {
  return useButton('enableConfirm');
}

export function useEnableAccept() {
  return useButton('enableAccept');
}

export function useEnablePendingCustomization() {
  return useButton('enablePendingCustomization');
}

export function useEnableAddress() {
  return useButton('enableAddress ');
}

export function useEnableBankDetails() {
  return useButton('enableBankDetails');
}

export function useEnableCancel() {
  return useButton('enableCancel');
}

export function useEnableReadyToShip() {
  return useButton('enableReadyToShip');
}

export function useEnableDelivered() {
  return useButton('enableDelivered');
}

export function useOrderStatus() {
  return useOrder().status;
}

export function useEnableMarkAsPaid() {
  return useButton('enableMarkAsPaid') && useOrderStatus() !== 'cancelled';
}

export function useIsCod() {
  return !!useOrder()?.isCod;
}

export function useIsCustomPayment() {
  return !!useOrder()?.isCustomPayment;
}

export function useEnableDownloadLabel() {
  return useButton('enableDownloadLabel');
}

export function useDirectPayment() {
  return useButton('directPayment');
}

export function useSellerShips() {
  const order = useOrder();
  return !!order?.sellerShips;
}

export function usePendingOrders() {
  const order = useOrder();
  const { groups: { pending = [] } } = order;
  return pending;
}

export function useConfirmedOrders() {
  const order = useOrder();
  const { groups: { confirmed = [] } } = order;
  return confirmed;
}

export function useTransformedShippedOrders() {
  const order = useOrder();
  const { groups: { shipped = [] } } = order;
  const other = shipped.map(x => {
    const { items = [] } = x;
    const newItems = items.map((y, i) => {
      y.buttons = x.buttons;
      y.sellerShips = x.sellerShips;
      y.shippingCharges = x.shippingCharges;
      y.walletTransactions = x.walletTransactions;
      y.groupId = x._id;
      y.dimensions = x.dimensions;
      y.weight = x.weight;
      y.status = x.status;
      y.details = x.details;
      y.statusHistory = x.statusHistory;
      y.isLast = i === items.length - 1;
      y.allItemIds = items.map(x => x._id);
      return y;
    });
    x.items = newItems;
    return x;
  });
  return other;
}

export function useShippedOrders() {
  const order = useOrder();
  const { groups: { shipped = [] } } = order;
  return shipped;
}

export function usePaymentStatus() {
  const {
    balance,
    codBalance,
    customPaymentBalance,
  } = useOrder();
  const isCod = useIsCod();
  const isCustomPayment = useIsCustomPayment();
  const enableMark = useEnableMarkAsPaid();
  if (isCod) {
    if (codBalance > 0) {
      return 'pending';
    }
    if (enableMark) {
      return 'pending';
    }
    return 'paid';
  }

  if (isCustomPayment) {
    if (customPaymentBalance > 0) {
      return 'pending';
    }
    if (enableMark) {
      return 'pending';
    }
    return 'paid';
  }

  if (balance > 1) {
    return 'pending';
  }
  return 'paid';
}

export function usePaymentCustomDetails() {
  const {
    payments: { customPaymentDetails }
  } = useOrder();
  return customPaymentDetails;
}

export function isOrderCustomerPickUp() {
  const order = useOrder();
  return _.get(order, 'shipping.mode', '') === 'customerpickup';
}

export function isDigitalOrder() {
  const order = useOrder();
  return _.get(order, 'shipping.mode', '') === 'digital';
}

export function useBalanceAmount() {
  const order = useOrder();
  return order.balance || 0;
}

export function useConfirmedAmount() {
  return useOrder().confirmedAmount || 0;
}

export function useNonConfirmedAmount() {
  const order = useOrder();
  return order.payable - (order.confirmedAmount || 0) - (order?.coupon?.amount || 0);
}

export function useOrderItems() {
  const order = useOrder();
  return _.flatten([
    ...(order.groups.pending || []),
    ...(order.groups.shipped || []).map(group => group.items)
  ]);
}

export function useOrderItemIds() {
  const items = useOrderItems();
  return items.map(x => x._id);
}
