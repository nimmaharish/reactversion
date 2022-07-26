import * as Yup from 'yup';

export const schema = Yup.object({
  title: Yup.string(),
  textColor: Yup.string(),
  background: Yup.object({
    type: Yup.string()
      .oneOf(['color', 'image', 'pattern']),
    colorValue: Yup.string(),
    imageValue: Yup.string(),
    patternValue: Yup.string(),
  }),
  button: Yup.object({
    text: Yup.string(),
    url: Yup.string().url().optional().label('Link'),
    color: Yup.string(),
    backgroundColor: Yup.string(),
  }),
  visibility: Yup.object({
    home: Yup.boolean(),
    pdp: Yup.boolean(),
    featured: Yup.boolean(),
    catalogList: Yup.boolean(),
    search: Yup.boolean(),
    productList: Yup.boolean(),
    cart: Yup.boolean(),
  })
});

export function getInitialValues(data = {}) {
  return {
    title: data?.title || '',
    textColor: data?.textColor || '',
    background: {
      type: data?.background?.type || 'color',
      colorValue: data?.background?.type === 'color' ? data?.background?.value || '' : '',
      imageValue: data?.background?.type === 'image' ? data?.background?.value || '' : '',
      patternValue: data?.background?.type === 'pattern' ? data?.background?.value || '' : '',
    },
    button: {
      text: data?.button?.text || '',
      url: data?.button?.url || '',
      color: data?.button?.color || '',
      backgroundColor: data?.button?.backgroundColor || '',
    },
    visibility: {
      home: data?.visibility?.home ?? true,
      pdp: data?.visibility?.pdp ?? true,
      cart: data?.visibility?.cart ?? true,
      featured: data?.visibility?.featured ?? true,
      productList: data?.visibility?.productList ?? true,
      catalogList: data?.visibility?.catalogList ?? true,
      search: data?.visibility?.search ?? true,
    }
  };
}

export function marshall(payload = {}) {
  const obj = {
    ...payload,
  };

  if (payload?.background?.type) {
    const {
      type, colorValue, imageValue, patternValue
    } = payload.background;
    obj.background = {
      type,
      value: type === 'color' ? colorValue : (type === 'image' ? imageValue : patternValue)
    };
  }

  return obj;
}
