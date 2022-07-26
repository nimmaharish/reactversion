import * as Yup from 'yup';

const customPaymentsSchema = Yup.object().shape({
  mode: Yup.string().required().label('Payment Mode'),
  details: Yup.string().required().label('Payment Details'),
  receiptsRequired: Yup.boolean().required(),
  status: Yup.string().required(),
});

export const getInitialValues = (values = {}) => ({
  online: {
    ...values?.online || {},
    enabled: values?.online?.enabled ?? false,
  },
  cod: {
    enabled: values?.cod?.enabled ?? false,
    orderValue: {
      min: values?.cod?.orderValue?.min || '',
      max: values?.cod?.orderValue?.max || '',
    },
  },
  custompayment: {
    enabled: values?.custompayment?.enabled ?? false,
    configured: values?.custompayment?.configured ?? [],
  },
});

export const schema = Yup.object({
  online: Yup.object({
    enabled: Yup.bool()
      .required(),
  }),
  cod: Yup.object({
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
        .when('min', {
          is: (value) => value && value.length > 0,
          then: Yup.number()
            .transform(x => +x || 0)
            .min(0)
            .nullable()
            .label('Max order value')
            .notRequired()
            .min(Yup.ref('min'), 'Max order value should be greater than min order value'),
          otherwise: Yup.number()
            .transform(x => +x || 0)
            .min(0)
            .nullable()
            .label('Max order value')
            .notRequired()
        }),
    })
  }),
  custompayment: Yup.object({
    enabled: Yup.bool()
      .required(),
    configured: Yup.array()
      .when('enabled', {
        is: true,
        then: Yup.array().of(customPaymentsSchema).required().min(1),
        otherwise: Yup.array().notRequired().nullable()
      })
  })
});
