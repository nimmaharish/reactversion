import * as Yup from 'yup';
import { shippingModeType } from 'constants/shippingModes';

export const getInitialValues = (values = {}) => ({
  delivery: {
    enabled: values?.delivery?.enabled ?? false,
    orderValue: {
      min: values?.delivery?.orderValue?.min || '',
      max: values?.delivery?.orderValue?.max || '',
    },
    type: values?.delivery?.type || 'delivery',
    title: values?.delivery?.title || 'Ship by Courier',
  },
  pickup: {
    enabled: values?.pickup?.enabled ?? false,
    orderValue: {
      min: values?.pickup?.orderValue?.min || '',
      max: values?.pickup?.orderValue?.max || '',
    },
    type: values?.pickup?.type || 'pickup',
    title: values?.pickup?.title || 'Store Pickup',
  },
  type: values?.type ?? shippingModeType.PHYSICAL_PRODUCTS,
  custom: values?.custom || [],
});

export const typeOptions = [
  {
    label: 'Shipping / Delivery',
    value: 'delivery',
  },
  {
    label: 'Pickup',
    value: 'pickup',
  },
];

export const shippingSchema = Yup.object({
  enabled: Yup.bool()
    .required(),
  orderValue: Yup.object({
    min: Yup.number()
      .transform(x => +x || 0)
      .min(0)
      .nullable()
      .notRequired()
      .label('Min order value'),
    max: Yup.number()
      .min(0)
      .nullable()
      .label('Max order value')
      .notRequired()
    ,
  }),
  type: Yup.string().required(),
  title: Yup.string().required(),
});

export const schema = Yup.object()
  .shape({
    type: Yup.string(),
    pickup: shippingSchema,
    delivery: shippingSchema,
    custom: Yup.array().of(shippingSchema)
  });

export const getIntitalCustomValues = (index, values) => {
  if (index !== null) {
    return values.custom[index];
  }
  return {
    enabled: true,
    orderValue: {
      min: 0,
      max: 0,
    },
    charge: 0,
    chargeEnabled: false,
    title: '',
    type: '',
  };
};
