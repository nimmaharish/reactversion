import * as Yup from 'yup';

export const deliverySchema = Yup.object()
  .shape({
    chargeType: Yup.string().required(),
    fixed: Yup.object().shape({
      charges: Yup.number()
        .when('chargeType', {
          is: 'fixed',
          then: Yup.number()
            .min(0)
            .label('Charges').required(),
          otherwise: Yup.number()
            .nullable(),
        }),
      freeDeliveryValue: Yup.number()
        .when('chargeType', {
          is: 'fixed',
          then: Yup.number()
            .label('Free Delivery Value')
            .min(0)
            .required(),
          otherwise: Yup.number()
            .nullable(),
        }),
    }),
  });
