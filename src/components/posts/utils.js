import { PostType } from 'constants/posts';
import _ from 'lodash';

export const getInitialValues = (other = {}) => ({
  images: [],
  video: null,
  thumbnail: null,
  type: PostType.IMAGES,
  description: '',
  hashTags: [],
  products: [],
  product: null,
  language: 'English',
  ...other,
});

export const getInitialProductValues = (values = {}) => ({
  title: '',
  amount: '',
  discountedAmount: '',
  availableType: 'infinite',
  available: '',
  customizable: 'true',
  ...values,
});

export function marshallProductData(values, shop) {
  const product = {
    title: values.title,
    amount: +values.amount,
    discountedAmount: +values.discountedAmount,
    availableType: values.availableType,
    available: (+values.available) || 0,
    customizable: values.customizable === 'true',
  };
  if (shop?.tax?.enabled) {
    product.tax = {
      slab: shop.tax.slab,
    };
  }
  product.paymentType = {
    online: true,
    cod: false
  };

  return product;
}

export function marshallData(values, shop) {
  const data = {
    type: values.type,
    description: values.description,
    hashTags: values.hashTags.map(x => x.label),
    categories: values?.categories?.map(x => x.label) || [],
    products: values.products || [],
    language: values.language || 'English',
  };

  if (!_.isEmpty(values.product)) {
    data.product = marshallProductData(values.product, shop);
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (data.type === PostType.IMAGES) {
    values.images.forEach((file, i) => {
      formData.append(`images[${i}]`, file);
    });
  } else {
    formData.append('video', values.video);
    formData.append('thumbnail', values.thumbnail);
  }
  return formData;
}

// export function unMarshallData(_data) {
//
// }
