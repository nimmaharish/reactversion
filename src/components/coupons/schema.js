import * as Yup from 'yup';
import { CouponLevel, CouponStatus, DiscountType } from 'constants/coupon';

export const couponSchema = Yup.object()
  .shape({
    code: Yup.string()
      .matches(/^[A-Za-z0-9]*$/, 'coupon code can contain only alphabets and numbers [A-Z][a-z][0-9]')
      .min(4)
      .max(10)
      .required(),
    description: Yup.string(),
    level: Yup.string()
      .oneOf(Object.values(CouponLevel))
      .required(),
    products: Yup.array()
      .when('level', {
        is: CouponLevel.PRODUCT,
        then: Yup.array()
          .of(Yup.string())
          .min(1)
          .required(),
        otherwise: Yup.array()
          .nullable(),
      }),
    type: Yup.string()
      .oneOf(Object.values(DiscountType)),
    value: Yup.number()
      .when('type', {
        is: DiscountType.PERCENTAGE,
        then: Yup.number()
          .positive()
          .lessThan(100)
          .required(),
        otherwise: Yup.number()
          .positive()
          .required(),
      }),
    maxValue: Yup.number()
      .when('type', {
        is: DiscountType.PERCENTAGE,
        then: Yup.number()
          .positive()
          .moreThan(0)
          .required('Max Value is a required field'),
        otherwise: Yup.number()
          .nullable(),
      })
      .transform((_cur, val) => (val === '' ? 0 : val)),
    limits: Yup.object()
      .shape({
        overall: Yup.number()
          .required(),
        user: Yup.number()
          .positive()
          .required('User Limit Required'),
      }),
    status: Yup.string()
      .oneOf(Object.values(CouponStatus))
      .nullable(),
    expiresAt: Yup.date()
      .required(),
    minOrderValue: Yup.number().nullable().notRequired(),
    paymentModes: Yup.object()
      .shape({
        online: Yup.bool(),
        cod: Yup.bool(),
        custompayment: Yup.bool(),
      }),
  });
