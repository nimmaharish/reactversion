import { lazy } from 'react';

export const Footer = lazy(() => import(/* webpackChunkName: "footer" */ 'layouts/Footer'));
export const Sidebar = lazy(() => import(/* webpackChunkName: "sidebar" */ 'layouts/SideBar'));
export const ListCoupons = lazy(() => import(/* webpackChunkName: "coupon-list" */ 'containers/coupons/ListCoupons'));
export const Wallet = lazy(() => import(/* webpackChunkName: "wallet" */ 'containers/wallet/Wallet'));
export const Payments = lazy(() => import(/* webpackChunkName: "payment-overview" */ 'containers/payments/List'));
export const StripeConnect = lazy(
  () => import(/* webpackChunkName: "stripe-connect" */ 'containers/payments/StripeConnect')
);
export const Subscription = lazy(
  () => import(/* webpackChunkName: "subscriptions" */ 'containers/subscriptions/Subscriptions'),
);
export const Analytics = lazy(() => import(/* webpackChunkName: "analytics" */ 'containers/analytics/Analytics'));
export const Orders = lazy(() => import(/* webpackChunkName: "order-list" */ 'containers/orders/Main'));
export const Thankyou = lazy(() => import(/* webpackChunkName: "order-thankyou" */ 'containers/orders/ThankYou'));
export const Products = lazy(() => import(/* webpackChunkName: "products" */ 'containers/products/Main'));
export const CreateProduct = lazy(() => import(/* webpackChunkName: "products-create" */
  'containers/products/CreateProduct'
));
export const Shop = lazy(() => import(/* webpackChunkName: "shop" */ 'containers/shop/Shop'));
export const Overview = lazy(() => import(/* webpackChunkName: "overview" */ 'containers/overview/View'));
export const Profile = lazy(() => import(/* webpackChunkName: "profile" */ 'containers/profile/Profile'));
export const Menu = lazy(() => import(/* webpackChunkName: "menu" */ 'containers/profile/Menu'));
export const ShippingTime = lazy(() => import(/* webpackChunkName: "profile-shipping-time" */
  'containers/shippingTime/ShippingTime'
));
export const ShippingTimeDesktop = lazy(() => import(/* webpackChunkName: "profile-shipping-time-desktop" */
  'containers/shippingTime/ShippingTimeDesktop'
));
export const AboutSeller = lazy(() => import(/* webpackChunkName: "profile-about" */
  'containers/aboutSeller/AboutSeller'
));
export const TermsAndPolicies = lazy(() => import(/* webpackChunkName: "profile-terms&policies" */
  'containers/termsAndPolicies/TermsAndPolicies'
));
export const Faq = lazy(() => import(/* webpackChunkName: "Faq" */
  'containers/faq/Faq'
));
export const DeliveryAndShipping = lazy(() => import(/* webpackChunkName: "profile-shipping-delivery" */
  'containers/profile/ShippingDelivery'
));

export const ShopFooterContent = lazy(() => import(/* webpackChunkName: "shop-footer-content" */
  'containers/profile/ShopFooter'
));

export const Content = lazy(() => import(/* webpackChunkName: "profile-content" */
  'containers/profile/Content'
));

export const ShippingModes = lazy(() => import(/* webpackChunkName: "profile-shipping-modes" */
  'containers/profile/shippingModes/ShippingModes'
));

export const ShippingPartners = lazy(() => import(/* webpackChunkName: "profile-shipping-partners" */
  'containers/profile/shippingPartners/ShippingPartners'
));

export const PaymentPartners = lazy(() => import(/* webpackChunkName: "payment-partners" */
  'containers/paymentPartners/PaymentPartners'
));

export const PaymentModes = lazy(() => import(/* webpackChunkName: "profile-payment-modes" */
  'containers/profile/paymentMode/PaymentMode'
));
export const PaymentModesDesktop = lazy(() => import(/* webpackChunkName: "profile-payment-modes-desktop" */
  'containers/profile/paymentMode/paymentModeDesktop'
));

export const CustomDomain = lazy(() => import(/* webpackChunkName: "profile-custom-domain" */
  'containers/profile/domain/CustomDomain'
));

export const Language = lazy(() => import(/* webpackChunkName: "profile-language" */
  'containers/profile/languages/Language'
));

export const MarketingPixels = lazy(() => import(/* webpackChunkName: "profile-marketing-pixels" */
  'containers/profile/marketingPixel/MarketingPixels'
));

export const UserProfile = lazy(
  () => import(/* webpackChunkName: "user-post-profile" */ 'containers/userProfile/UserProfile'),
);

export const Catalog = lazy(
  () => import(/* webpackChunkName: "catalog-list" */ 'containers/products/Catalog/List'),
);

export const AddressList = lazy(
  () => import(/* webpackChunkName: "profile-address-list" */ 'containers/profile/address/List'),
);

export const DeliveryDetails = lazy(
  () => import(/* webpackChunkName: "profile-delivery-details" */ 'containers/profile/delivery/Delivery'),
);

export const PickupEligibility = lazy(
  () => import(
    /* webpackChunkName: "profile-pickup-eligibility" */
    'containers/profile/pickupEligibility/PickupEligibility'
  ),
);

export const BankDetails = lazy(
  () => import(
    /* webpackChunkName: "profile-bank-details" */
    'containers/profile/bank/BankDetails'
  ),
);

export const ThemeSelection = lazy(
  () => import(
    /* webpackChunkName: "profile-theme-selection" */
    'containers/profile/theme/Themes'
  ),
);

export const ThemeColorSelection = lazy(
  () => import(
    /* webpackChunkName: "profile-theme-color-selection" */
    'containers/profile/theme/ThemeSelection'
  ),
);

export const AnnouncementsBanners = lazy(
  () => import(
    /* webpackChunkName: "profile-announcements-banners" */
    'containers/profile/AnnouncementsBanners'
  )
);

export const MarketingBanners = lazy(
  () => import(
    /* webpackChunkName: "profile-marketing-banners" */
    'containers/profile/marketingBanners/Banner'
  )
);

export const SellerProfile = lazy(
  () => import(/* webpackChunkName: "seller-profile" */
    'containers/sellerProfile/SellerProfile'
  )
);

export const StoreTimings = lazy(
  () => import(/* webpackChunkName: "store-timings" */
    'containers/storeTimings/StoreTiming'
  )
);
export const ProfileDesktop = lazy(() => import(/* webpackChunkName: "profile-desktop" */
  'containers/profile/ProfileDesktop'
));

export const CommonOverview = lazy(() => import(/* webpackChunkName: "common-desktop-view" */
  'containers/desktop/CommonOverview'
));

// export const OrderDetails = lazy(() => import(/* webpackChunkName: "order-details" */ 'containers/orders/Details'));

export const OrderDetails = lazy(() => import(/* webpackChunkName: "order-details" */
  'containers/orders/OrderDetails'
));

export const DesktopAlert = lazy(() => import(/* webpackChunkName: "common-desktop-alert" */
  'components/shared/alert/DesktopAlert/DesktopAlert'
));

export const HelloBar = lazy(() => import(/* webpackChunkName: "hellobar" */ 'components/profile/HelloBar'));

export const BulkProduct = lazy(
  () => import(/* webpackChunkName: "bulk-product-desktop" */
    'containers/desktop/products/BulkProduct'
  )
);
export const StoreInfo = lazy(() => import(/* webpackChunkName: "store-info" */ 'components/profile/StoreInfo'));

export const Checkout = lazy(
  () => import(/* webpackChunkName: "profile-checkout" */
    'containers/profile/checkout/Checkout'
  )
);

export const ShopReviews = lazy(
  () => import(/* webpackChunkName: "shop-reviews" */
    'containers/orders/Ratings'
  )
);

export const RatingSettings = lazy(
  () => import(
    /* webpackChunkName: "profile-settings-ratings" */
    'containers/profile/ratings/Ratings'
  )
);

export const Instagram = lazy(
  () => import(
    /* webpackChunkName: "instagram-sync" */
    'containers/Instagram'
  )
);

export const areasServed = lazy(() => import(
  /* webpackChunkName: "areas-served" */ 'containers/profile/areasServed/Overview'
));

export const Summary = lazy(
  () => import(
    /* webpackChunkName: "settings-summary" */
    'components/snapShot/Overview'
  )
);

export const RatingsCreateLink = lazy(
  () => import(
    /* webpackChunkName: "profile-settings-ratings-create-link" */
    'containers/profile/ratings/CreateRatingLink'
  )
);

export const CampaignPage = lazy(
  () => import(
    /* webpackChunkName: "campaign-page" */
    'components/customerCampaign/CustomerList'
  )
);

export const AbandonedCarts = lazy(
  () => import(/* webpackChunkName: "abandoned-carts" */
    'containers/orders/Carts'
  )
);

export const CartDetails = lazy(
  () => import(/* webpackChunkName: "cart-details" */
    'components/orders/CartDetails'
  )
);

export const Taxing = lazy(
  () => import(
    /* webpackChunkName: "settings-tax" */
    'components/tax/List'
  )
);

export const SettingsSearch = lazy(
  () => import(
    /* webpackChunkName: "settings-search" */
    'components/profile/SettingsSearch'
  )
);

export const Layout = lazy(
  () => import(
    /* webpackChunkName: "layout" */
    'containers/profile/theme/customThemes/Layout'
  )
);
