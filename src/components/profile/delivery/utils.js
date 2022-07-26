// import {
//   isIND,
// } from 'contexts/userContext';

// const isInd = isIND();

export const DeliveryType = {
  FREE: 'free',
  FIXED: 'fixed',
  CONDITIONAL: 'conditional',
  AREA: 'area',
  SHIPPING: 'shipping'
};

export const DistanceMatrix = {

  shortKilometers: {
    fromDistance: 0,
    toDistance: 250,
    unit: 'km',
    label: 'Around the corner (0-250 kilometers)',
  },

  shortMiles: {
    fromDistance: 0,
    toDistance: 250,
    unit: 'mile',
    label: 'Around the corner (0-250 miles)',
  },

  mediumKilometers: {
    fromDistance: 250,
    toDistance: 500,
    unit: 'km',
    label: 'On the horizon (250-500 kilometers)',
  },

  mediumMiles: {
    fromDistance: 250,
    toDistance: 500,
    unit: 'mile',
    label: 'On the horizon (250-500 miles)',
  },

  longKilometers: {
    fromDistance: 500,
    toDistance: 10000,
    unit: 'km',
    label: 'Afar (>500 kilometers)',
  },

  longMiles: {
    fromDistance: 500,
    toDistance: 10000,
    unit: 'mile',
    label: 'Afar (>500 miles)',
  }
};

export const DistanceOptions = Object.entries(DistanceMatrix).map(([key, value]) => ({
  value: key,
  label: value.label,
  fromDistance: value.fromDistance,
  toDistance: value.toDistance,
  unit: value.unit,
}));

export function formatConditionalCharge(charge, currency) {
  return `${currency} ${charge.from} - ${currency} ${charge.to} → ${currency} ${charge.charge}`;
}

export function formatDistanceCharge(charge, currency) {
  if (charge.fromDistance === 500) {
    return `${currency} ${charge.from} - ${currency} ${charge.to}
  In ( > ${charge.fromDistance} ${charge.unit}s)
   → ${currency} ${charge.charge}`;
  }
  return `${currency} ${charge.from} - ${currency} ${charge.to}
  In (${charge.fromDistance} - ${charge.toDistance} ${charge.unit}s)
   → ${currency} ${charge.charge}`;
}

export function getInitialValues(values) {
  return {
    otherCharges: values?.otherCharges || [],
    config: values?.config || [],
    chargeType: values?.chargeType || DeliveryType.FREE,
    edd: 0,
    charges: values?.charges || '',
    fixed: {
      charges: values?.fixed?.charges || '',
      freeDeliveryValue: values?.fixed?.freeDeliveryValue || '',
    }
  };
}

export function getInitialConditionalValues(charges, index) {
  if (index !== null) {
    return charges[index];
  }

  if (charges.length === 0) {
    return {
      from: 0,
      to: '',
      charge: ''
    };
  }

  return {
    from: charges[charges.length - 1]?.to ?? '',
    to: '',
    charge: '',
  };
}

export function getChargeConfig(values, index) {
  if (index !== null) {
    const value = values?.find(obj => obj.value === index)?.config;
    if (value) {
      return {
        value: value.value ?? '',
        min: value.min ?? '',
        max: value.max ?? '',
      };
    }
  }
  return {
    value: '',
    min: '',
    max: '',
  };
}
