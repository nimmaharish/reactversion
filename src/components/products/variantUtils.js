import isImage from 'is-image';
import { get } from 'lodash';
import * as Yup from 'yup';

export const unitTypes = [
  'Piece', 'Liter', 'Gram', 'Set', 'Square Meter', 'Year', 'Kilogram', 'Day', 'Bunch', 'Pair', 'Square Feet', 'Feet',
  'Montly', 'Minute', 'Meter', 'Inch', 'Hour', 'Pound', 'Quintal', 'Bundle', 'Km', 'Dozen', 'Pound',
  'Packet', 'Month', 'Box', 'Plate', 'Ton', 'Millimeter'
];

export const taxSlabs = [
  {
    label: 'No Tax',
    value: 0
  },
  {
    label: '5%',
    value: 5
  },
  {
    label: '12%',
    value: 12
  },
  {
    label: '18%',
    value: 18
  },
  {
    label: '28%',
    value: 28
  },
];

export const variantSchema = Yup.object({
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
      .transform(x => +x || 0)
      .min(0)
      .nullable()
      .label('Strike-off Price')
      .notRequired();
  }),
  availableType: Yup.string()
    .required()
    .label('Available type'),
  available: Yup.number()
    .when('availableType', {
      is: 'finite',
      then: Yup.number()
        .required(),
      otherwise: Yup.number()
        .notRequired()
        .transform(x => x || 0)
        .nullable(),
    })
    .label('Availability'),
  info: Yup.object()
    .shape({
      name: Yup.string()
        .required()
        .label('Variant title'),
      type: Yup.string()
        .required()
        .label('Custom variant type'),
      value: Yup.string()
        .required()
        .label('Variant type'),
    })
});

export const colorSchema = Yup.object()
  .shape({
    hex: Yup.string()
      .required()
      .label('Color'),
  });

export const variantsSchema = Yup.array()
  .of(variantSchema);
export const colorsSchema = Yup.array()
  .of(colorSchema);

export const variantDrawerSchema = Yup.object().shape({
  colors: colorsSchema,
  variants: variantsSchema,
});

export const draftSchema = Yup.object({
  variants: variantsSchema,
  colors: colorsSchema,
  title: Yup.string()
    .required()
    .label('Product name'),
});

export const digitalProductsSchema = Yup.object({
  type: Yup.string(),
  value: Yup.string(),
  name: Yup.string(),
});

export const productSchema = Yup.object({
  variants: variantsSchema,
  colors: colorsSchema,
  status: Yup.string(),
  title: Yup.string()
    .required()
    .label('Product name'),
  description: Yup.string()
    .label('Description'),
  images: Yup.array()
    .label('images'),
  videos: Yup.array()
    .label('videos'),
  categories: Yup.array()
    .label('categories'),
  subCategories: Yup.array()
    .label('sub categories'),
  unit: Yup.object()
    .shape({
      value: Yup.string(),
      type: Yup.string(),
    }),
  taxes: Yup.object()
    .shape({
      inclusive: Yup.boolean().required(),
      ids: Yup.array()
        .label('Tax Slab'),
    }),
  variant: Yup.object({
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
        .transform(x => +x || 0)
        .min(0)
        .nullable()
        .label('Strike-off Price')
        .notRequired();
    }),
    availableType: Yup.string()
      .required()
      .label('Available type'),
    available: Yup.number()
      .when('availableType', {
        is: 'finite',
        then: Yup.number()
          .required()
          .min(1, 'Availability should be greater than 0')
          .typeError('Availability should be greater than 0')
          .required()
          .positive(),
        otherwise: Yup.number()
          .transform(x => x || 0)
          .notRequired()
          .nullable(),
      })
      .label('Availability'),
  }),
  quantity: Yup.object({
    type: Yup.string().required(),
    group: Yup.number()
      .min(1, 'Should be greater than 1')
      .label('Group')
      .required(),
    minQuantity: Yup.number().required().positive().label('Min quantity'),
    maxQuantity: Yup.lazy((value) => {
      if (value) {
        return Yup.number()
          .transform(x => +x || 0)
          .positive()
          .min(Yup.ref('minQuantity'), 'Maximum Order Quantity should be greater than Minimum Order Quantity')
          .required()
          .label('Max quantity');
      }
      return Yup.number()
        .transform(x => +x || 0)
        .label('Maximum Order Quantity')
        .nullable()
        .notRequired();
    }),
    enabled: Yup.boolean().required(),
  }),
  productType: Yup.string().required(),
  links: Yup.array().of(digitalProductsSchema)
});

export function getInitialValues(values = {}, taxes = []) {
  const isCreate = taxes.length > 0;
  const taxIds = taxes.filter(x => x.enabled).map(x => x._id);
  const { quantity, ...rest } = values;
  return {
    title: '',
    description: '',
    images: [],
    videos: [],
    categories: [],
    subCategories: [],
    status: 'live',
    catalogs: [],
    hashTags: [],
    customizable: 'no',
    unit: {
      value: '1',
      type: 'Piece',
    },
    taxes: {
      inclusive: true,
      ids: isCreate ? taxIds : [],
    },
    variant: {
      default: true,
      amount: '',
      discountedAmount: '',
      available: '0',
      availableType: 'infinite',
      images: [],
      videos: [],
    },
    colors: [],
    variants: [],
    variantType: 'size',
    plainDescription: '',
    quantity: {
      enabled: get(quantity, 'enabled', true),
      maxQuantity: quantity?.maxQuantity || '',
      minQuantity: quantity?.minQuantity || 1,
      group: quantity?.group || 1,
      type: quantity?.type || 'infinite'
    },
    productType: 'physical',
    links: [],
    ...rest,
  };
}

export function calculateDiscount(amount, discountedAmount) {
  return (((amount - discountedAmount) / amount) * 100).toFixed(0);
}

const arrayToHash = (array, path) => array.reduce((acc, val) => {
  acc[get(val, path)] = val;
  return acc;
}, {});

function extractTaxes(ids = [], shopTaxes) {
  const taxesObj = arrayToHash(shopTaxes, '_id');
  const taxes = ids;
  if (taxes.length === 0) {
    return 0;
  }
  return taxes.reduce((acc, taxId) => {
    const tax = taxesObj[taxId];
    if (tax) {
      return acc + tax.value;
    }
    return acc;
  }, 0);
}

export function calculateTax(shopTaxes, sku) {
  const { taxes: { inclusive, ids }, variant: { discountedAmount } } = sku;
  const slab = extractTaxes(ids, shopTaxes);
  if (!inclusive) {
    return Math.ceil(discountedAmount * (1 + slab / 100));
  }
  return discountedAmount;
}

export function getSizeInitialValues(value = {}) {
  return {
    amount: '',
    discountedAmount: '',
    available: '0',
    availableType: 'infinite',
    images: [],
    videos: [],
    info: {
      type: 'size',
      name: 'Size',
      value: ''
    },
    status: 'live',
    ...value,
  };
}

export function getCustomInitialValues({
  info = {},
  ...other
} = {}) {
  return {
    ...getSizeInitialValues({
      info: {
        type: 'custom',
        name: '',
        value: '',
        ...info,
      }
    }),
    ...other,
  };
}

export function getColorInitialValues(value = {}) {
  return {
    hex: '#4B7BE5',
    name: '',
    status: 'live',
    images: [],
    ...value,
  };
}

export function convertHTML(value) {
  const div = document.createElement('div');
  div.innerHTML = value;
  return div.innerText;
}

export function getVideosAndImages(files) {
  return files.reduce((acc, file) => {
    if (isImage(file.url)) {
      acc.images.push(file);
    } else {
      acc.videos.push(file);
    }
    return acc;
  }, {
    images: [],
    videos: []
  });
}

export function marshallPayload(data) {
  const {
    variants,
    variant,
    ...sku
  } = data;
  const allVariants = [variant, ...variants];
  return {
    variants: allVariants,
    sku: {
      ...sku,
      customizable: sku.customizable === 'yes',
      catalogs: sku.catalogs?.length > 0 ? sku.catalogs : ['all']
    },
  };
}

export function unMarshallPayload(data) {
  const {
    variants,
    ...sku
  } = data;
  const variant = variants.find(x => x.default) || variants[0];
  variant.default = true;
  variant.amount = variant.amount || '';
  variant.discountedAmount = variant.discountedAmount || '';
  const rest = variants.filter(x => x._id !== variant._id);
  const variantType = rest[0]?.info?.type === 'custom' ? 'custom' : 'size';
  return {
    ...sku,
    plainDescription: convertHTML(sku.description || ''),
    customizable: sku.customizable ? 'yes' : 'no',
    variant: {
      ...variant,
      amount: variant.amount === variant.discountedAmount ? '' : variant.amount,
    },
    variants: rest.map(v => ({
      ...v,
      amount: v.amount === v.discountedAmount ? '' : v.amount,
      discountedAmount: v.discountedAmount || ''
    })),
    variantType,
  };
}
