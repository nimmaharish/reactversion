import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Drawer } from 'components/shared/Drawer';
import { Becca } from 'api/index';
import { get } from 'lodash';
import Snackbar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import inviteSellerIcon from 'assets/desktop/account/inviteSeller.svg';
import sellerProfileIcon from 'assets/desktop/account/sellerProfile.svg';
import checkoutflowIcon1 from 'assets/overview/checkflowdesktop.svg';
import SubscriptionIcon from 'assets/desktop/account/subscriptions.svg';
import LanguageIcon from 'assets/desktop/settings/language.svg';
import couponsIcon from 'assets/desktop/offers/coupons.svg';
import userIcon from 'assets/desktop/user.svg';
import paymentsIcon from 'assets/desktop/settings/payments.svg';
import shippingIcon from 'assets/desktop/settings/shipping.svg';
import taxIcon from 'assets/desktop/settings/tax.svg';
import customDomainIcon from 'assets/desktop/customDomain.svg';
import deliveryChargesIcon from 'assets/desktop/shipping/deliveryCharges.svg';
import shippingModesIcon from 'assets/desktop/shipping/shippingModes.svg';
import shippingPartnersIcon from 'assets/desktop/shipping/shippingPartners.svg';
import shippingTimeIcon from 'assets/desktop/shipping/shippingTime.svg';
import marketingPixelsIcon from 'assets/desktop/theme/marketingPixels.svg';
import qrCodeIcon from 'assets/desktop/theme/qrCode.svg';
import reviewIcon from 'assets/desktop/settings/review.svg';
import socialMediaIcon from 'assets/desktop/theme/socialMedia.svg';
import themesIcon from 'assets/desktop/theme/themes.svg';
import seoIcon from 'assets/desktop/theme/seoDesk.svg';
import checkoutIcon from 'assets/desktop/settings/checkout.svg';
import chatIcon from 'assets/desktop/settings/liveChat.svg';
import footerContentIcon from 'assets/desktop/settings/footercontent.svg';
import paymentRulesIcon from 'assets/desktop/settings/checkout/paymentRules.svg';
import checkoutLoginIcon from 'assets/desktop/settings/checkout/login.svg';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import featureIcon from 'assets/desktop/feature.svg';
import addressIcon from 'assets/desktop/address.svg';
import WebViewUtils from 'services/webviewUtils';
import Header from 'containers/products/Header';
import { share } from 'utils';
import { shareShop, shareSellerApp } from 'utils/share';
import CallIcon from '@material-ui/icons/Call';
import Email1Icon from '@material-ui/icons/Email';
import Radio from '@material-ui/core/Radio';
import WebView from 'services/webview';
import { allowedCountries } from 'constants/shop';
import {
  Clickable, ReactInput, Button as Btn
} from 'phoenix-components';
import {
  useCustomDomain,
  useIsFreeTrialSubscribed,
  useIsOnCustomDomain, useIsOnFreeTrial,
  useIsPremiumFeatureRequestsEnabled,
  useIsPrioritySupportEnabled,
  usePlan, useShopBaseUrl, useIsAddressAdded,
  useIsPaymentsEnabled,
  useIsSocialMediaLinked,
  useIsHelloBarEnabled,
  useIsShopContentLinked,
  useIsBannersEnabled,
  useIsMarketingPixelEnabled,
  useIsMarketingPixelsAdded,
  useIsCouponsEnabled,
  useIsSeoEnabled,
  useIsCustomerCampaignEnabled,
  useShop, useRefreshShop, useIsFreePlan, useOpenPlans,
  useIsChatEnabled
} from 'contexts/userContext';
import { useIsRatingsEnabled } from 'contexts';
import { InviteSeller } from 'components/profile/InviteSeller';
// import Storage from 'services/storage';
import { FeatureRequest } from 'containers/featureRequests/FeatureRequest';
import FaqModel from 'containers/faq/Faq';
import EventManager from 'utils/events';
import ExpressCheckout from 'components/expressCheckout/ExpressCheckout';
import { useToggle } from 'hooks/common';
import { QRCode } from 'components/overview/lazy';
import errorIcon from 'assets/desktop/error.svg';
import { SideDrawer } from 'components/shared/SideDrawer';
import bannerIcon from 'assets/desktop/banner.svg';
import announcementsIcon from 'assets/desktop/hellobar.svg';
import Info from 'components/info/Info';
import areasServedIcon from 'assets/desktop/shipping/areasServedDesktop.svg';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import ChatSettings from 'components/chat/ChatSettings';
import Seo from 'components/seo/Seo';
import styles from '../profile/Profile.module.css';
import DeliveryCalculator from '../profile/delivery/DeliveryCalculator';

function CommonOverview({ page }) {
  const history = useHistory();
  const shop = useShop();
  const refreshShop = useRefreshShop();
  const params = useQueryParams();
  const plan = usePlan();
  const isInFreeTrial = useIsOnFreeTrial();
  const isFreeTrialSubscribed = useIsFreeTrialSubscribed();
  const isFeatureRequestsEnabled = useIsPremiumFeatureRequestsEnabled();
  const isPrioritySupportEnabled = useIsPrioritySupportEnabled();
  const pageName = page;
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  // const [menu, openMenu] = useState(false);
  const [enabled, setEnableGst] = useState(get(shop, 'tax.enabled', false));
  const [gstin, setGstIn] = useState(get(shop, 'tax.gstin', ''));
  const [slab, setSlab] = useState(get(shop, 'tax.slab', ''));
  const isIND = shop?.country?.toLowerCase() === 'india';
  // const isCouponsEnabled = useIsCouponsEnabled();
  const [openQRCode, toggleQRCode] = useToggle();
  const isCountryEnabled = allowedCountries.includes(shop?.country?.toLowerCase());
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const baseUrl = useShopBaseUrl();
  const openSeo = params.has('openSeo');
  const openChat = params.has('openChat');
  const openCheckout = params.has('chekoutFlow');
  // const IsAboutAdded = useIsAboutAdded();
  // const IsTermsAdded = useIsTermsAdded();
  const IsSocialMediaLinked = useIsSocialMediaLinked();
  const isMarketingPixelsAdded = useIsMarketingPixelsAdded();
  const isMarketingPixelsEnabled = useIsMarketingPixelEnabled();
  const isBannersEnabled = useIsBannersEnabled();
  const isHellobarEnabled = useIsHelloBarEnabled();
  const isCouponsEnabled = useIsCouponsEnabled();
  const isSeoEnabled = useIsSeoEnabled();
  const isCustomerCampaignEnabled = useIsCustomerCampaignEnabled();
  const enableRatings = useIsRatingsEnabled();
  const isShopContentLinked = useIsShopContentLinked();
  const isChatEnabled = useIsChatEnabled();
  const openDeliveryCharges = params.has('openDC');
  const openFaq = params.has('openFaq');
  const openTax = params.has('openTax');
  const openContact = params.has('openContact');
  const openInviteSeller = params.has('inviteSeller');
  const openFeatureRequests = params.has('openFeatureRequests');
  const isAddressAdded = useIsAddressAdded();
  const isPaymentsEnabled = useIsPaymentsEnabled();
  const isFree = useIsFreePlan();
  const openPlans = useOpenPlans();
  const openPremiumPlans = useOpenPlans(false, 'generic', 'premium');

  const taxLabel1 = 'Include Tax';
  const taxLabel2 = 'No Tax';

  const updateShop = async (payload, successMsg) => {
    try {
      const res = await Becca.updateShop(payload);
      refreshShop();
      Snackbar.show(successMsg);
      return res;
    } catch (exception) {
      Snackbar.showError(exception);
    }
  };

  const shareToSeller = () => {
    share(`Hello

We are now selling on WINDO, an instant online shop creation platform. Please visit our online shop at
${shareShop(shop.slug, isCustomDomain, domain)}

You can also start selling and grow by reaching out to more customers through WINDO in less than 30 seconds.

Download WINDO Seller app using this link ${shareSellerApp()}

Thank you
${shop.name}`);
  };

  // eslint-disable-next-line react/no-multi-comp
  const getTile = (primary, icon, param, to, showFeature, showError = false) => (
    <Clickable
      className={styles.tile}
      onClick={() => {
        if (primary === 'Live Chat Settings') {
          if (isChatEnabled) {
            openPremiumPlans();
            return;
          }
          params.set('openChat', 'true');
          history.push({
            search: params.toString()
          });
          return;
        }
        if (primary === 'Checkout Flow') {
          if (isFree) {
            openPremiumPlans();
            return;
          }
          params.set('chekoutFlow', 'true');
          history.push({
            search: params.toString()
          });
          return;
        }
        if (primary === 'Ratings & Reviews') {
          if (!enableRatings) {
            params.set('openPlans', 'generic');
            history.push({
              search: params.toString(),
            });
            return;
          }
          history.push({
            pathname: '/manage/ratings',
          });
          return;
        }
        if (primary === 'Invite Sellers') {
          shareToSeller();
          return;
        }
        if (primary === 'Request Features') {
          if (!isFeatureRequestsEnabled) {
            params.set('openPlans', 'generic');
            history.push({
              search: params.toString(),
            });
            return;
          }
        }
        if (primary === 'Payment Rules') {
          if (isFree) {
            params.set('openPlans', 'generic');
            history.push({
              search: params.toString(),
            });
            return;
          }
        }
        if (primary === 'SEO') {
          if (!isSeoEnabled) {
            params.set('openPlans', 'generic');
            history.push({
              search: params.toString(),
            });
            return;
          }
        }
        if (primary === 'Hello Bar') {
          history.push('/manage/hellobar');
          return;
        }
        if (primary === 'Whatsapp us') {
          if (!isPrioritySupportEnabled) {
            params.set('openPlans', 'whatsapp');
            history.push({
              search: params.toString(),
            });
            return;
          }
          const url = 'https://api.whatsapp.com/send/?phone=+918309690218&text=';
          if (WebView.isWebView()) {
            WebView.openUrl(url);
            return;
          }
          window.open(url, '_blank');
          return;
        }
        if (primary === 'Email us') {
          if (WebView.isWebView()) {
            WebView.openUrl('mailto:team@windo.live');
            return;
          }
          window.open('mailto:team@windo.live', '_blank');
          return;
        }
        // if (primary === 'Discount Coupons') {
        //   if (!isCouponsEnabled) {
        //     params.set('openPlans', 'coupons');
        //     history.push({
        //       search: params.toString(),
        //     });
        //     return;
        //   }
        // }
        if (param) {
          if (param === 'qrCode') {
            if (isFree) {
              openPlans();
              return;
            }
            toggleQRCode();
            return;
          }
          if (param === 'openBank') {
            if (shop?.country?.toLowerCase() !== 'india') {
              history.push('/payments?open=2');
              return;
            }
            history.push('/manage/bank', {
              redirectTo: '/manage',
            });
            return;
          }
          params.set(param, 'true');
          history.push({
            search: params.toString(),
          });
          return;
        }
        history.push(to);
      }}
    >
      {showFeature && <img className={styles.iconF} src={featureIcon} alt="" />}
      {showError && !showFeature && <img className={styles.iconE} src={errorIcon} alt="" />}

      <div className={styles.iconDesktopContainer}>
        <img
          alt=""
          src={icon}
        />
      </div>
      <div
        className={styles.tileText}
      >
        {primary}
      </div>
    </Clickable>
  );

  let subscriptionPlan = plan.description;

  if (isInFreeTrial && !isFreeTrialSubscribed) {
    subscriptionPlan = 'Free Trial';
  }
  console.log(subscriptionPlan);

  const getScreens = () => {
    switch (pageName) {
      case 'Shop Settings':
        return (
          <>
            <div className={styles.desktopGrid}>
              {getTile('Address', addressIcon, null, '/manage/address', null, !isAddressAdded)}
              {getTile('Payments', paymentsIcon, null, '/manage/paymentModes', null, !isPaymentsEnabled)}
              {/* {getTile('Tax Details', taxIcon, 'openTax')} */}
              {getTile('Tax Details', taxIcon, null, '/settings/tax')}

              {getTile('Shipping & Delivery', shippingIcon, null, '/settings/shippingAndDelivery')}
            </div>
          </>
        );
      case 'Account Settings':
        return (
          <div className={styles.desktopGrid}>
            {getTile('Seller Account', sellerProfileIcon, null, '/sellerProfile')}
            {getTile('Subscriptions', SubscriptionIcon, null, '/subscriptions')}
            {getTile('Invite Sellers', inviteSellerIcon, 'inviteSeller', null)}
            {getTile('Language', LanguageIcon, null, '/manage/language')}
          </div>
        );
      case 'Shop Website':
        return (
          <div className={styles.desktopGrid}>
            {getTile('Themes', themesIcon, null, '/manage/theme')}
            {getTile('Shop Content', footerContentIcon, null, '/shopfootercontent', null, !isShopContentLinked)}
            {getTile('Social Media', socialMediaIcon, null, '/accounts', null, !IsSocialMediaLinked)}
            {getTile('Checkout Settings', checkoutIcon, null, '/manage/checkout')}
            {getTile('Custom Domain', customDomainIcon, null, '/manage/domain')}
            {getTile('Marketing Pixels', marketingPixelsIcon, null, '/manage/marketingPixels',
              !isMarketingPixelsEnabled, !isMarketingPixelsAdded)}
            {getTile('QR Code', qrCodeIcon, 'qrCode', null, isFree)}
            {getTile('Ratings & Reviews', reviewIcon, null, '/manage/ratings', !enableRatings)}
            {getTile('Banners', bannerIcon, null, '/manage/marketingBanners', !isBannersEnabled)}
            {getTile('Hello Bar', announcementsIcon, 'null', '/manage/hellobar', !isHellobarEnabled)}
            {getTile('SEO', seoIcon, 'openSeo', null, !isSeoEnabled)}
            {getTile('Live Chat Settings', chatIcon, 'openChat', null, !isChatEnabled)}
          </div>
        );
      case 'Offers':
        return (
          <div className={styles.desktopGrid}>
            {getTile('Discount Coupons', couponsIcon, null, '/coupons', !isCouponsEnabled)}
            {getTile('Customers list & campaign', userIcon, null, '/manage/campaign', !isCustomerCampaignEnabled)}
          </div>
        );
      case 'Support':
        return (
          <div className={styles.desktopGrid}>
          </div>
        );
      case 'Contact Us':
        return (
          <div className={styles.desktopGrid}>
          </div>
        );
      case 'Shipping & Delivery':
        return (
          <>
            <div className={styles.desktopGrid}>
              {getTile('Shipping Timeline', shippingTimeIcon, null, '/shipping/shippingTime')}
              {getTile('Delivery Charges', deliveryChargesIcon, null, '/manage/delivery')}
              {getTile('Shipping Modes', shippingModesIcon, null, '/manage/shippingModes')}
              {isCountryEnabled && getTile('Shipping Partners', shippingPartnersIcon, null, '/manage/shippingPartners')}
              {getTile('Areas Served', areasServedIcon, null, '/manage/areasServed', !isConditionalChargesEnabled)}
            </div>
            <div className={styles.kbcDesk}>
              <Kbc type="shippingAndDelivery" />
            </div>
          </>
        );
      case 'Announcements & Promos':
        return (
          <div className={styles.desktopGrid}>
            {getTile('Banners', bannerIcon, null, '/manage/marketingBanners')}
            {getTile('Hello Bar', announcementsIcon, 'null', '/manage/hellobar')}
          </div>
        );
      case 'Checkout Settings':
        return (
          <>
            <div className={styles.desktopGrid}>
              {getTile('Payment Rules', paymentRulesIcon, null, '/manage/checkout?page=rules', isFree)}
              {getTile('Customer Login', checkoutLoginIcon, null, '/manage/checkout?page=login')}
              {getTile('Checkout Flow', checkoutflowIcon1, 'checkoutFlow', null, isFree)}
            </div>
            <div className={styles.kbcDesk}>
              <Kbc type="checkSettings" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={styles.commonOverviewContainer}
    >
      {openSeo && <Seo onClose={() => { params.delete('openSeo'); history.goBack(); }} />}
      {openChat && <ChatSettings onClose={() => { params.delete('openChat'); history.goBack(); }} />}
      {openFaq && <FaqModel />}
      {openInviteSeller && <InviteSeller />}
      {openFeatureRequests && <FeatureRequest />}
      {openQRCode && <QRCode url={baseUrl} onClose={toggleQRCode} />}
      {openCheckout && <ExpressCheckout />}

      <div id="scroll" className={styles.content}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          {pageName}
        </div>
        <div className={styles.bodyDesktop}>
          {getScreens()}
        </div>
        {openTax && (
          <SideDrawer
            backButton={true}
            title="Tax Details"
            onClose={() => history.goBack()}
          >
            <div className={styles.center_align}>
              <form
                Validate
                autoComplete="off"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const payload = {
                    enabled,
                    gstin: enabled ? gstin : '',
                    slab: enabled ? slab : '',
                  };
                  updateShop({ tax: payload }, 'Tax Details updated');
                  EventManager.emitEvent('tax_details_added', {
                    slab: (slab || 0).toString(),
                    enabled: enabled.toString(),
                  });
                  params.delete('openTax');
                  history.push({
                    search: params.toString(),
                  });
                }}
                className={styles.form}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      className={styles.alignRight}
                    >
                      <FormControlLabel
                        classes={{
                          root: 'textCapital fs14',
                        }}
                        control={(
                          <Radio
                            checked={!enabled}
                            color="primary"
                            onChange={() => setEnableGst(false)}
                            name="checkedA"
                          />
                        )}
                        label={taxLabel2}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      classes={{
                        root: 'textCapital fs14',
                      }}
                    >
                      <FormControlLabel
                        control={(
                          <Radio
                            checked={enabled}
                            color="primary"
                            onChange={() => setEnableGst(true)}
                            name="checkedA"
                          />
                        )}
                        label={taxLabel1}
                      />
                    </FormControl>
                  </Grid>
                  {enabled && (
                    <>
                      <ReactInput
                        value={gstin}
                        label={isIND ? 'Tax Identification Number' : 'Tax Identification Number'}
                        placeholder={isIND ? 'Tax Identification Number' : 'Enter Tax Identification Number'}
                        setValue={(e) => setGstIn(e)}
                        required={true}
                      />
                      <Grid item xs={12}>
                        <ReactInput
                          value={slab}
                          label="Tax Percentage(%)"
                          placeholder="Enter Tax Percentage"
                          type="number"
                          setValue={(e) => setSlab(e)}
                          required
                        />
                      </Grid>
                    </>
                  )}
                  <div className={cx(styles.button_flex2, 'fullWidth')}>
                    <div>
                      <Button
                        id="taxform"
                        hidden
                        type="submit"
                      >
                      </Button>
                      <Btn
                        size="large"
                        label="Save"
                        onClick={() => {
                          const el = document.getElementById('taxform');
                          el.click();
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </form>
            </div>
            <div className={styles.taxInfo}>
              <Info
                title="Pro Tip"
                text={'We\'re saving this as your default tax setting, but you can always '
                  + 'change it later for existing and new products.'}
              />
            </div>
          </SideDrawer>
        )}
        {openDeliveryCharges
          && <DeliveryCalculator />}
        <Drawer
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
          anchor="bottom"
          open={openContact}
          onClose={() => history.goBack()}
        >
          <div className={styles.center_align}>
            <form
              Validate
              autoComplete="off"
              id="form2"
              className={styles.form}
            >
              <Grid container spacing={2}>
                <Header onBack={() => history.goBack()} title="Contact Us" />
                <Grid className={styles.call_button_align} item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.button}
                    endIcon={<CallIcon />}
                    href="tel:+918309690218"
                    onClick={WebViewUtils.openUrl('tel:+918309690218')}
                  >
                    Call Us
                  </Button>
                </Grid>
                <Grid className={styles.call_button_align} item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.button}
                    endIcon={<Email1Icon />}
                    href="mailto:team@windo.live"
                    onClick={WebViewUtils.openUrl('mailto:team@windo.live')}
                  >
                    Email Us
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Drawer>
      </div>
    </div>
  );
}

CommonOverview.propTypes = {
  page: PropTypes.object.isRequired,
};

export default CommonOverview;
