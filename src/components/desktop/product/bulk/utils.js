export function mapProduct(product) {
  const { availability } = product;
  const availableType = Number.isNaN(+availability) ? 'infinite' : 'finite';
  return {
    title: product.name,
    description: product.description,
    images: (product.images || []).map(i => ({
      url: i,
      caption: ''
    })),
    videos: (product.videos || []).map(i => ({
      url: i,
      caption: ''
    })),
    categories: [],
    subCategories: [],
    catalogs: product?.catalogs?.length ? product.catalogs : ['all'],
    hashTags: [],
    customizable: 'no',
    unit: {
      value: product.unitValue || 1,
      type: product.unitType || 'Piece',
    },
    tax: {
      inclusive: 'yes',
      slab: 0,
    },
    variants: [
      {
        default: true,
        amount: product.amount,
        discountedAmount: product.discountedAmount,
        available: availableType === 'infinite' ? '0' : availability,
        availableType,
        images: [],
        videos: [],
      }
    ],
    colors: product.colors || [],
  };
}
