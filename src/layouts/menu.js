import orders from 'assets/desktop/orders.svg';
import overview from 'assets/desktop/overview.svg';
import payments from 'assets/desktop/payments.svg';
import product from 'assets/desktop/product.svg';
import store from 'assets/desktop/store.svg';
// import tutorial from 'assets/desktop/tutorial.svg';
// import howItWorks from 'assets/desktop/howItWorks.svg';

const MENU = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        route: '/',
      },
      {
        title: 'Analytics',
        route: '/overview/analytics',
      },
    ],
    icon: overview
  },
  {
    title: 'Orders',
    items: [
      {
        title: 'Orders',
        route: '/orders',
      },
      {
        title: 'Carts',
        route: '/carts',
      },
      {
        title: 'Reviews',
        route: '/reviews',
      },
    ],
    icon: orders
  },
  {
    title: 'Products',
    items: [
      {
        title: 'Products List',
        route: '/products',
      },
      {
        title: 'Create Product',
        route: '/product/create',
      },
      {
        title: 'Bulk Upload Products',
        route: '/product/bulk/upload',
      },
      {
        title: 'Collections',
        route: '/product/collections',
      },
      {
        title: 'Gallery',
        route: '/product/gallery',
      },
    ],
    icon: product
  },
  {
    title: 'Payments',
    items: [
      {
        title: 'Overview',
        route: '/payments/overview',
        search: '?tab=overview',
      },
      {
        title: 'Payments',
        route: '/payments/payments',
        search: '?tab=payments',
      },
    ],
    icon: payments
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Summary',
        route: '/settings/summary',
      },
      {
        title: 'Profile',
        route: '/settings/profile',
      },
      {
        title: 'Shop Settings',
        route: '/settings/shopSettings',
        nestedRoutes: ['/manage/address', '/manage/paymentModes', '/settings/shippingAndDelivery',
          '/shipping/shippingTime', '/manage/delivery', '/manage/shippingModes', '/manage/shippingPartners']
      },
      {
        title: 'Account Settings',
        route: '/settings/myAccount',
        nestedRoutes: ['/sellerProfile', '/subscriptions', '/manage/language']
      },
      {
        title: 'Shop Website',
        route: '/settings/shopWebsite',
        nestedRoutes: ['/manage/theme', '/shopfootercontent', '/about/seller',
          '/manage/terms&policies', '/manage/storeInfo', '/storeTimings', '/manage/domain']
      },
      {
        title: 'Offers & Marketing',
        route: '/settings/offers',
        nestedRoutes: ['/settings/offers', '/coupons', '/manage/announcementsBanners',
          '/manage/marketingBanners', '/manage/hellobar']
      },
    ],
    icon: store
  },
  // {
  //   title: 'How it Works',
  //   items: [],
  //   icon: howItWorks
  // },
  // {
  //   title: 'Watch Tutorial',
  //   items: [],
  //   icon: tutorial
  // },
];

export default MENU;
