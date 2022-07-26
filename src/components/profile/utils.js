const getValue = (item = {}) => {
  const { enabled = true } = item;
  return enabled;
};

const getValueForStore = (item = {}) => {
  const { enabled = false } = item;
  return enabled;
};

export function getInitialValues(values = {}) {
  return {
    footerInfo: {
      store: {
        enabled: getValueForStore(values?.store),
        phone: values?.store?.phone || '',
        email: values?.store?.email || '',
        address: values?.store?.address || '',
      },
      order: {
        enabled: getValue(values?.order),
        title: values?.order?.title || 'Order Tracking',
        subTitle: values?.order?.subTitle || '',
      },
      payment: {
        enabled: getValue(values?.payment),
        title: values?.payment?.title || 'Seamless Payments',
        subTitle: values?.payment?.subTitle || '',
      },
      shipping: {
        enabled: getValue(values?.shipping),
        title: values?.shipping?.title || 'Fast Shipping',
        subTitle: values?.shipping?.subTitle || '',
      },
    }
  };
}

const plans = ['free', 'plus', 'premium'];

export function isSubscribed(plan, currentPlan) {
  return plans.indexOf(currentPlan) >= plans.indexOf(plan);
}
