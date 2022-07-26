import * as Yup from 'yup';
import { PostType } from 'constants/posts';

export const productSchema = Yup.object()
  .shape({
    title: Yup.string()
      .required()
      .min(4),
    discountedAmount: Yup.number()
      .required()
      .positive()
      .label('Price'),
    amount: Yup.lazy((value) => {
      if (value) {
        return Yup.number()
          .positive()
          .min(Yup.ref('discountedAmount'), 'Strike-off Price should be greater than Price')
          .required()
          .label('Strike-off Price');
      }
      return Yup.number()
        .nullable()
        .notRequired()
        .positive()
        .label('Strike-off Price');
    }),
    availableType: Yup.string()
      .oneOf(['finite', 'infinite'])
      .required(),
    available: Yup.number()
      .when('availableType', {
        is: 'finite',
        then: Yup.number()
          .required()
          .positive(),
        otherwise: Yup.number()
          .nullable(),
      }),
    customizable: Yup.boolean()
      .required(),
  });

export const postSchema = Yup.object()
  .shape({
    type: Yup.string()
      .oneOf(Object.values(PostType))
      .required(),
    description: Yup.string()
      .required(),
    images: Yup.array()
      .when('type', {
        is: PostType.IMAGES,
        then: Yup.array()
          .min(1)
          .required(),
        otherwise: Yup.array()
          .nullable(),
      }),
    video: Yup.mixed()
      .when('type', {
        is: PostType.VIDEO,
        then: Yup.mixed()
          .required(),
        otherwise: Yup.mixed()
          .nullable(),
      }),
    thumbnail: Yup.mixed()
      .when('type', {
        is: PostType.VIDEO,
        then: Yup.mixed()
          .required(),
        otherwise: Yup.mixed()
          .nullable(),
      }),
    language: Yup.string()
      .required(),
    products: Yup.array()
      .of(Yup.string()),
    product: productSchema.nullable(),
  });
