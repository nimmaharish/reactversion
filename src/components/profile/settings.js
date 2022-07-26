export const settingsRoutes = [
  {
    title: 'Address',
    route: {
      mobile: '/manage/address',
      desktop: '/manage/address'
    },
    params: {},
    planName: 'free',
  },
  {
    title: 'Shop Profile',
    route: {
      mobile: '/manage/shop',
      desktop: '/settings/profile'
    },
    params: {},
    planName: 'free',
  },
  {
    title: 'Tax Details',
    route: {
      mobile: '/settings/tax',
      desktop: '/settings/tax'
    },
    params: {},
    planName: 'free',
  },
  {
    title: 'Payment Modes',
    route: {
      mobile: '/manage/paymentModes',
      desktop: '/manage/paymentModes'
    },
    params: {},
    planName: 'free',
  },
  {
    title: 'Shipping & Delivery',
    route: {
      mobile: '/shippingAndDelivery',
      desktop: '/settings/shippingAndDelivery'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shipping Time',
    route: {
      mobile: '/shipping/shippingTime',
      desktop: '/shipping/shippingTime'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Delivery Charges',
    route: {
      mobile: '/manage/delivery',
      desktop: '/manage/delivery'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shipping Modes',
    route: {
      mobile: '/manage/shippingModes',
      desktop: '/manage/shippingModes'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shipping Partners',
    route: {
      mobile: '/manage/shippingPartners',
      desktop: '/manage/shippingPartners'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Areas Served',
    route: {
      mobile: '/manage/areasServed',
      desktop: '/manage/areasServed'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Seller Profile',
    route: {
      mobile: '/sellerProfile',
      desktop: '/sellerProfile'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Subscriptions',
    route: {
      mobile: '/subscriptions',
      desktop: '/subscriptions'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shop & Website Language',
    route: {
      mobile: '/manage/language',
      desktop: '/manage/language'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'Themes',
    route: {
      mobile: '/manage/theme',
      desktop: '/manage/theme'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shop Content',
    route: {
      mobile: '/shopfootercontent',
      desktop: '/shopfootercontent'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'About Shop',
    route: {
      mobile: '/about/seller',
      desktop: '/about/seller'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shop Policies',
    route: {
      mobile: '/manage/terms&policies',
      desktop: '/manage/terms&policies'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Shop Info',
    route: {
      mobile: '/manage/storeInfo',
      desktop: '/manage/storeInfo'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Terms & Conditions',
    route: {
      mobile: '/about/seller',
      desktop: '/about/seller'
    },
    params: { type: 'It' },
    planName: 'free'
  },
  {
    title: 'Privacy Policy',
    route: {
      mobile: '/about/seller',
      desktop: '/about/seller'
    },
    params: { type: 'Ip' },
    planName: 'free'
  },
  {
    title: 'Store Timings',
    route: {
      mobile: '/storeTimings',
      desktop: '/storeTimings'
    },
    params: {},
    planName: 'free'
  },
  {
    title: 'Social Media',
    route: {
      mobile: '/accounts',
      desktop: '/accounts'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'Checkout Settings',
    route: {
      mobile: '/manage/checkout',
      desktop: '/manage/checkout'
    },
    params: { },
    planName: 'free',
  },
  {
    title: 'Payment Rules',
    route: {
      mobile: '/manage/checkout',
      desktop: '/manage/checkout'
    },
    params: { page: 'rules' },
    planName: 'plus',
  },
  {
    title: 'Login Settings',
    route: {
      mobile: '/manage/checkout',
      desktop: '/manage/checkout'
    },
    params: { page: 'login' },
    planName: 'plus',
  },
  {
    title: 'Marketing Pixels',
    route: {
      mobile: '/manage/marketingPixels',
      desktop: '/manage/marketingPixels'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'Custom Domain',
    route: {
      mobile: '/manage/domain',
      desktop: '/manage/domain'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'Ratings & Reviews',
    route: {
      mobile: '/manage/ratings',
      desktop: '/manage/ratings'
    },
    params: {},
    planName: 'premium'
  },
  {
    title: 'Hello Bar',
    route: {
      mobile: '/manage/hellobar',
      desktop: '/manage/hellobar'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'SEO',
    route: {
      mobile: '/manage',
      desktop: '/settings/shopWebsite'
    },
    params: { openSeo: true },
    planName: 'premium',
    key: 'seo'
  },
  {
    title: 'Marketing Banners',
    route: {
      mobile: '/manage/marketingBanners',
      desktop: '/manage/marketingBanners'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'Live Chat Settings',
    route: {
      mobile: '/manage',
      desktop: '/settings/shopWebsite'
    },
    params: { openChat: true },
    planName: 'premium',
    key: 'chat'
  },
  {
    title: 'Coupons',
    route: {
      mobile: '/coupons',
      desktop: '/coupons'
    },
    params: {},
    planName: 'plus'
  },
  {
    title: 'Customer List',
    route: {
      mobile: '/manage/campaign',
      desktop: '/manage/campaign'
    },
    params: {},
    planName: 'premium'
  },
];
