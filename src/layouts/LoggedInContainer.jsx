import styles from 'layouts/MainContainer.module.css';
import {
  Redirect, Route, Switch, useHistory
} from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useShopOverview, useShopTemplates, useShopShippingPartners } from 'hooks';
import { UserContext } from 'contexts/userContext';
import { Loading } from 'components/shared/Loading';
import {
  HelpLine
} from 'components/overview';
import { useWallet } from 'hooks/wallet';
import menuIcon from 'assets/desktop/menu.svg';
import faqIcon from 'assets/images/shared/faq.svg';
import getSymbolFromCurrency from 'currency-symbol-map';
import { FeatureRoute } from 'components/shared/FeatureRoute';
import { ViewPlanModel } from 'containers/subscriptions/ViewPlanModel';
import Accounts from 'containers/socialMedia/Accounts';
import Faq from 'components/faq/Custom';
import FaqDesktop from 'containers/faq/FaqDesktop';
import wIcon from 'assets/v2/overview/shop.svg';
import { UpgradeButton } from 'components/overview/UpgradeButton';
import { ChatDrawer } from 'components/chat/ChatDrawer';
import { useQueryParams } from 'hooks';
import {
  AboutSeller,
  AddressList,
  Analytics,
  AnnouncementsBanners,
  Content,
  CreateProduct, CustomDomain,
  Language,
  DeliveryAndShipping,
  ShopFooterContent,
  DeliveryDetails,
  Footer,
  ListCoupons,
  MarketingBanners,
  Orders,
  Thankyou,
  Overview,
  PaymentModes,
  Payments,
  PickupEligibility,
  Products,
  Profile,
  ShippingTime,
  ShippingModes,
  UserProfile,
  Catalog,
  ShippingPartners,
  Shop,
  StripeConnect,
  Subscription,
  ThemeSelection,
  Wallet,
  SellerProfile,
  StoreTimings,
  TermsAndPolicies,
  ProfileDesktop,
  Sidebar,
  CommonOverview,
  OrderDetails,
  PaymentModesDesktop,
  MarketingPixels,
  HelloBar,
  StoreInfo,
  Menu,
  BulkProduct,
  Checkout,
  ShopReviews,
  RatingSettings,
  Instagram,
  Summary,
  areasServed,
  RatingsCreateLink,
  CampaignPage,
  AbandonedCarts,
  CartDetails,
  Taxing,
  SettingsSearch,
  Layout,
} from 'containers/lazy';
import { useDesktop } from 'contexts';
import { useSyncLanguage } from 'hooks/lang';

function LoggedInContainer({
  shop,
  refresh: refreshShop,
  user,
  refreshUser,
}) {
  useSyncLanguage(shop, refreshShop);
  const history = useHistory();
  const params = useQueryParams();
  const [overview, refreshOverview, loading] = useShopOverview();
  const [templates, refreshTemplates] = useShopTemplates();
  const [wallet, refreshWallet] = useWallet();
  const [partners, refreshPartners] = useShopShippingPartners();
  const isDesktop = useDesktop();
  const [menu, openMenu] = useState(false);
  const faqEnabled = params.get('openFaq');
  const faqEnabledDesktop = params.get('openFaqDesktop');
  if (shop?.country && shop?.country?.length > 0) {
    shop.currencySymbol = getSymbolFromCurrency(shop?.currency);
  } else {
    shop.currencySymbol = '';
  }

  if (!overview && loading) {
    return (
      <Loading />
    );
  }

  const values = {
    shop,
    overview,
    refreshShop,
    refreshOverview,
    user,
    refreshUser,
    wallet,
    refreshWallet,
    templates,
    refreshTemplates,
    partners,
    refreshPartners,
  };

  return !isDesktop ? (
    <UserContext.Provider
      value={values}
    >
      <div className={styles.root}>
        <Switch>
          <Route path="/" exact component={Overview} />
          <Route path="/manage/shop" exact>
            <Shop isStart={false} />
          </Route>
          <Route path="/products" component={Products} />
          <Route path="/product/create" component={CreateProduct} />
          <Route exact path="/manage" component={Profile} />
          <Route path="/overview" component={Overview} />
          <Route exact path="/orders/:id" component={OrderDetails} />
          <Route path="/orders/:id/thankyou" component={Thankyou} />
          <Route path="/orders" component={Orders} />
          <Route path="/coupons" component={ListCoupons} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/faq" component={Faq} />
          <Route path="/payments" component={Payments} />
          <Route path="/stripe/connect" component={StripeConnect} />
          <Route path="/subscriptions" component={Subscription} />
          <Route path="/accounts" component={Accounts} />
          <Route path="/manage/search" component={SettingsSearch} />
          <Route path="/manage/address" component={AddressList} />
          <Route path="/manage/delivery" component={DeliveryDetails} />
          <Route path="/manage/pickupEligibility" component={PickupEligibility} />
          <Route path="/shippingAndDelivery" component={DeliveryAndShipping} />
          <Route path="/shopFooterContent" component={ShopFooterContent} />
          <Route path="/manage/shippingModes" component={ShippingModes} />
          <Route path="/manage/shippingPartners" component={ShippingPartners} />
          <Route path="/manage/paymentModes" component={PaymentModes} />
          <Route path="/manage/areasServed" component={areasServed} />
          <Route path="/manage/content" component={Content} />
          <Route path="/manage/announcementsBanners" component={AnnouncementsBanners} />
          <Route path="/manage/marketingBanners" component={MarketingBanners} />
          <Route path="/manage/marketingBanners/:id" component={MarketingBanners} />
          <Route path="/manage/theme">
            <ThemeSelection isStart={false} />
          </Route>
          <Route path="/manage/hellobar" component={HelloBar} />
          <Route path="/manage/domain" component={CustomDomain} />
          <Route path="/manage/language" component={Language} />
          <Route path="/manage/marketingPixels" component={MarketingPixels} />
          <FeatureRoute name="analytics" path="/analytics" component={Analytics} />
          <Route path="/shipping/shippingTime" component={ShippingTime} />
          <Route path="/about/seller" component={AboutSeller} />
          <Route path="/sellerProfile" component={SellerProfile} />
          <Route path="/storeTimings" component={StoreTimings} />
          <Route path="/manage/terms&policies" component={TermsAndPolicies} />
          <Route path="/manage/storeInfo" component={StoreInfo} />
          <Route path="/manage/checkout" component={Checkout} />
          <Route path="/manage/ratings" component={RatingSettings} />
          <Route path="/manage/createRatingLink" component={RatingsCreateLink} />
          <Route path="/reviews" component={ShopReviews} />
          <Route path="/carts" component={AbandonedCarts} exact={true} />
          <Route path="/carts/:id" component={CartDetails} />
          <Route path="/instagram" component={Instagram} />
          <Route path="/layoutCustomization" component={Layout} />
          <Route path="/manage/campaign">
            <CampaignPage />
          </Route>
          <Route path="/settings/tax" component={Taxing} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
      <Footer />
      <ViewPlanModel />
    </UserContext.Provider>
  )
    : (
      <UserContext.Provider
        value={values}
      >
        <div>
          <div className={styles.topBarDesktop}>
            <img
              className={styles.shopIcon}
              role="none"
              src={shop?.icon && shop.icon[0] ? shop.icon[0] : wIcon}
              alt="" />
            <div className={styles.shopName}>
              {shop?.name ?? ''}
              <div className={styles.line}></div>
              <div className={styles.plan} translate="no">
                {shop?.plan?.description ?? ''}
              </div>
              <div>
                {shop?.plan?.name !== 'premium'
                  && <UpgradeButton />}
              </div>
            </div>
            <HelpLine isFloating={true} />
            <img
              src={faqIcon}
              alt="Faq"
              onClick={() => {
                params.set('openFaqDesktop', true);
                history.push({
                  search: params.toString(),
                });
              }} />
            <ChatDrawer isFixed={false} />
            <img src={menuIcon} alt="menu" className={styles.menu} onClick={() => openMenu(!menu)} />
            {menu && <Menu onClose={() => openMenu(false)} />}
            {faqEnabledDesktop && <FaqDesktop />}
          </div>
          {!faqEnabled && (
            <div className={styles.flex}>
              <Sidebar />
              <br />
              <div className={styles.layout}>
                <Switch>
                  <Route path="/" exact component={Overview} />
                  <Route path="/overview/analytics" component={Analytics} />
                  <Route path="/overview" component={Overview} />
                  <Route path="/products" component={Products} />
                  <Route path="/product/create" component={CreateProduct} />
                  <Route path="/product/collections" component={Catalog} />
                  <Route path="/product/gallery" component={UserProfile} />
                  <Route path="/product/bulk/upload" component={BulkProduct} />
                  <Route exact path="/orders/:id" component={OrderDetails} />
                  <Route path="/orders/:id/thankyou" component={Thankyou} />
                  <Route path="/orders" component={Orders} />
                  <Route path="/payments/overview" component={Payments} />
                  <Route path="/payments/payments" component={Payments} />
                  <Route path="/wallet" component={Wallet} />
                  <Route path="/manage/hellobar" component={HelloBar} />
                  <Route path="/settings/profile/search" component={SettingsSearch} />
                  <Route path="/settings/profile" component={ProfileDesktop} />
                  <Route path="/manage/paymentModes" component={PaymentModesDesktop} />
                  <Route path="/sellerProfile" component={SellerProfile} />
                  <Route path="/settings/shopSettings" component={() => <CommonOverview page="Shop Settings" />} />
                  <Route path="/settings/myAccount" component={() => <CommonOverview page="Account Settings" />} />
                  <Route path="/shipping/shippingTime" component={ShippingTime} />
                  <Route path="/manage/areasServed" component={areasServed} />
                  <Route
                    path="/settings/shippingAndDelivery"
                    component={() => <CommonOverview page="Shipping & Delivery" />} />
                  <Route path="/settings/shopWebsite" component={() => <CommonOverview page="Shop Website" />} />
                  <Route path="/manage/checkout" component={() => <Checkout />} />
                  <Route path="/manage/language" component={() => <Language />} />
                  <Route path="/settings/offers" component={() => <CommonOverview page="Offers" />} />
                  <Route path="/settings/support" component={ProfileDesktop} />
                  <Route path="/settings/contactus" component={ProfileDesktop} />
                  <Route path="/manage/address" component={AddressList} />
                  <Route path="/manage/delivery" component={DeliveryDetails} />
                  <Route path="/manage/theme">
                    <ThemeSelection isStart={false} />
                  </Route>
                  <Route path="/manage/pickupEligibility" component={PickupEligibility} />
                  <Route path="/manage/shippingModes" component={ShippingModes} />
                  <Route path="/manage/shippingPartners" component={ShippingPartners} />
                  <Route path="/subscriptions" component={Subscription} />
                  <Route
                    path="/manage/announcementsBanners"
                    component={() => <CommonOverview page="Announcements & Promos" />} />
                  <Route path="/manage/marketingBanners" component={MarketingBanners} />
                  <Route path="/manage/marketingBanners/:id" component={MarketingBanners} />
                  <Route path="/about/seller" component={AboutSeller} />
                  <Route path="/manage/terms&policies" component={TermsAndPolicies} />
                  <Route path="/accounts" component={Accounts} />
                  <Route path="/coupons" component={ListCoupons} />
                  <Route path="/storeTimings" component={StoreTimings} />
                  <Route path="/manage/marketingPixels" component={MarketingPixels} />
                  <Route path="/manage/domain" component={CustomDomain} />
                  <Route path="/manage/storeInfo" component={StoreInfo} />
                  <Route path="/shopFooterContent" component={ShopFooterContent} />
                  <FeatureRoute name="ratings" path="/reviews" component={ShopReviews} />
                  <Route path="/manage/ratings" component={RatingSettings} />
                  <Route path="/manage/createRatingLink" component={RatingsCreateLink} />
                  <Route path="/instagram" component={Instagram} />
                  <Route path="/settings/summary" component={Summary} />
                  <Route path="/manage/campaign">
                    <CampaignPage />
                  </Route>
                  <Route path="/carts" component={AbandonedCarts} exact={true} />
                  <Route path="/carts/:id" component={CartDetails} />
                  <Route path="/settings/tax" component={Taxing} />
                </Switch>
              </div>
            </div>
          )}
        </div>
        <ViewPlanModel />
      </UserContext.Provider>
    );
}

LoggedInContainer.propTypes = {
  shop: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  refreshUser: PropTypes.func.isRequired,
};

export default LoggedInContainer;
