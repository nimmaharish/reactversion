import * as Yup from 'yup';

export const conditionalChargeSchema = Yup.object()
  .shape({
    from: Yup.number()
      .min(0)
      .label('min order value').required(),
    to: Yup.number()
      .positive()
      .moreThan(Yup.ref('from'), 'It should be greater than min order value')
      .label('max order value')
      .required(),
    charge: Yup.number()
      .min(0)
      .label('delivery charge').required(),
  });

export const distanceChargeSchema = Yup.object()
  .shape({
    from: Yup.number()
      .min(0)
      .label('min order value')
      .required(),
    to: Yup.number()
      .positive()
      .moreThan(Yup.ref('from'), 'It should be greater than min order value')
      .label('max order value')
      .required(),
    fromDistance: Yup.number()
      .min(0)
      .label('min distance')
      .required(),
    toDistance: Yup.number()
      .positive()
      .moreThan(Yup.ref('fromDistance'), 'It should be greater than min distance')
      .label('max distance')
      .required(),
    charge: Yup.number()
      .min(0)
      .label('delivery charge')
      .required(),
  });
