import _ from 'lodash';
import * as Yup from 'yup';

export const FEE_TYPES = [
  { name: 'Additional Fee', value: 'additional' },
  { name: 'Discount', value: 'discount' },
];

export const VALUE_TYPES = [
  { name: 'Percentage', value: 'percentage' },
  { name: 'Flat', value: 'flat' },
];

export const schema = Yup.array()
  .of(
    Yup.object({
      type: Yup.string()
        .oneOf(['cod', 'online', 'customPayment'])
        .required(),
      value: Yup.string()
        .required(),
      enabled: Yup.bool()
        .required(),
      cartValue: Yup.object({
        min: Yup.number()
          .nullable()
          .notRequired(),
        max: Yup.number()
          .nullable()
          .notRequired()
          .min(Yup.ref('min'), 'Should be greater than minimum cart value'),
      })
        .notRequired(),
      advanced: Yup.object({
        feeType: Yup.string()
          .oneOf(['additional', 'discount'])
          .nullable()
          .notRequired(),
        type: Yup.string()
          .oneOf(['percentage', 'flat'])
          .nullable()
          .notRequired(),
        value: Yup.number()
          .nullable()
          .notRequired(),
        maxValue: Yup.number()
          .nullable()
          .notRequired(),
      }),
      partial: Yup.object({
        type: Yup.string()
          .nullable()
          .notRequired(),
        value: Yup.number()
          .nullable()
          .notRequired(),
        maxValue: Yup.number()
          .nullable()
          .notRequired(),
      }),
    })
  );

export const marshall = (payload) => payload.map(item => {
  const {
    advanced,
    ...other
  } = item;
  return {
    ...other,
    advanced: _.isEmpty(advanced?.feeType) ? undefined : advanced,
  };
});

export const getRuleSubString = (currency, rule) => {
  if (!rule?.cartValue?.min && !rule?.cartValue?.max && !rule?.advanced?.value
    && !rule?.advanced?.maxValue && !rule?.partial?.value && !rule?.partial?.maxValue) {
    return 'No rules set';
  }
  const str = [];

  if (rule?.cartValue?.min) {
    str.push(`Min: ${currency} ${rule.cartValue.min}`);
  }

  if (rule?.cartValue?.max) {
    str.push(`Max: ${currency} ${rule.cartValue.max}`);
  }

  if (rule?.advanced?.value) {
    const value = rule?.advanced?.value;
    const type = rule?.advanced?.feeType === 'additional' ? 'Additional' : 'Discount';
    const valueType = rule?.advanced?.type;
    str.push(
      `${type}: ${valueType === 'percentage' ? '' : `${currency} `}${value}${valueType === 'percentage' ? '%' : ''}`
    );
  }
  return str.join(', ');
};
