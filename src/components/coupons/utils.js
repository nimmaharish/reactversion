import { CouponStatus, DiscountType } from 'constants/coupon';
import moment from 'moment';

export function getInitialValues(values = {}, paymentModes) {
  const obj = {
    code: '',
    minOrderValue: '',
    description: '',
    level: values?.level || '',
    products: [],
    type: DiscountType.FLAT,
    value: '',
    maxValue: '',
    limits: {
      user: '',
      overall: -1,
    },
    expiresAt: moment().add(1, 'week').toDate(),
    status: CouponStatus.ACTIVE,
    paymentModes: {
      online: paymentModes?.online?.enabled,
      cod: paymentModes?.cod?.enabled,
      custompayment: paymentModes?.custompayment?.enabled
    },
    ...values,
  };

  if (!obj.minOrderValue && obj.minOrderValue !== 0) {
    obj.minOrderValue = '';
  }
  return obj;
}
