import React, { useEffect, useState } from 'react';
import {
  Button, FormControl, FormControlLabel, Grid,
} from '@material-ui/core';
import cx from 'classnames';
import { Drawer } from 'components/shared/Drawer';
import { FooterButton } from 'components/common/FooterButton';
import { get, startCase } from 'lodash';
import Snackbar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import blacky from 'assets/images/shop.svg';
import addressIcon from 'assets/overview/address.svg';
import paymentDetailIcon from 'assets/overview/paymentsDetails.svg';
import taxIcon from 'assets/overview/tax.svg';
import requestIcon from 'assets/overview/requests.svg';
import faqIcon from 'assets/overview/faq.svg';
import shopLanguageIcon from 'assets/overview/shopLanguage.svg';
import reviewIcon from 'assets/overview/review.svg';
import shippingIcon from 'assets/overview/shipping.svg';
import announcementsIcon from 'assets/v2/settings/announcements.svg';
import marketingIcon from 'assets/overview/marketing.svg';
import qrCodeIcon from 'assets/overview/qrCode.svg';
import userIcon from 'assets/overview/users.svg';
import coustomDomainIcon from 'assets/overview/coustomDomain.svg';
import shopProfileIcon from 'assets/overview/shop.svg';
import dicountCouponsIcon from 'assets/overview/discountCoupons.svg';
import sellerProfileIcon from 'assets/overview/sellerProfile.svg';
import subscriptionIcon from 'assets/overview/subscriptions.svg';
import desktopIcon from 'assets/overview/desktop.svg';
import bannersIcon from 'assets/overview/banners.svg';
import communityIcon from 'assets/overview/community.svg';
import blogIcon from 'assets/overview/blogiconsettings.svg';
import socialMediaIcon from 'assets/overview/socialMedia.svg';
import inviteSellerIcon from 'assets/overview/inviteSeller.svg';
import themeIcon1 from 'assets/overview/theme.svg';
import footerIcon from 'assets/overview/shopFooter.svg';
import storeTimeIcon from 'assets/overview/shopTimingsMobile.svg';
import loginSettingsIcon from 'assets/overview/loginSettingsMobile.svg';
import paymentRulesIcon from 'assets/overview/paymentRulesMobile.svg';
import checkoutflowIcon1 from 'assets/overview/checkout.svg';
import Share from 'assets/overview/share.svg';
import menuIcon from 'assets/overview/menu.svg';
import featureIcon from 'assets/overview/feature.svg';
import helpIcon from 'assets/overview/help.svg';
import twitterIcon from 'assets/overview/twitter.svg';
import linkedinIcon from 'assets/overview/linkedin.svg';
import instagramIcon from 'assets/overview/insta.svg';
import seoIcon from 'assets/overview/seo.svg';
import youtubeIcon from 'assets/overview/youtube.svg';
import facebookIcon from 'assets/overview/facebook.svg';
import errorIcon from 'assets/overview/error.svg';
import chatIcon from 'assets/overview/liveChat.svg';
import chevUp from 'assets/v2/orders/chevUpPrimary.svg';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import upgradeIcon from 'assets/images/subscriptions/rocket.svg';
import WebViewUtils from 'services/webviewUtils';
import Header from 'containers/products/Header';
import { share } from 'utils';
import { shareSellerApp, shareShop } from 'utils/share';
import CallIcon from '@material-ui/icons/Call';
import Email1Icon from '@material-ui/icons/Email';
import Radio from '@material-ui/core/Radio';
import WebView from 'services/webview';
import {
  Button as Btn, Clickable, ReactInput, Switch, Search
} from 'phoenix-components';
import {
  useCustomDomain,
  useIsAddressAdded,
  useIsBannersEnabled,
  useIsCouponsEnabled,
  useIsFreeTrialSubscribed,
  useIsHelloBarEnabled,
  useIsMarketingPixelEnabled,
  useIsMarketingPixelsAdded,
  useIsOnCustomDomain,
  useIsOnFreeTrial,
  useIsPaymentsEnabled,
  useIsPremiumFeatureRequestsEnabled,
  useIsPrioritySupportEnabled,
  useIsSocialMediaLinked,
  usePlan,
  useShopBaseUrl,
  useIsSeoEnabled,
  useUser,
  useIsCustomerCampaignEnabled,
  useIsShopContentLinked, useIsFreePlan, useOpenPlans,
  useIsChatEnabled
} from 'contexts/userContext';
import { useIsRatingsEnabled } from 'contexts';
import { InviteSeller } from 'components/profile/InviteSeller';
import { DesktopVersion } from 'components/profile/DesktopVersion';
import Loader from 'services/loader';
import { Becca } from 'api/index';
import { FeatureRequest } from 'containers/featureRequests/FeatureRequest';
import FaqModel from 'containers/faq/Faq';
import EventManager from 'utils/events';
import { useToggle } from 'hooks/common';
import { QRCode } from 'components/overview/lazy';
import { SnapMini } from 'components/snapShot/SnapMini';
import { HelpLine } from 'components/overview';
import ChatSettings from 'components/chat/ChatSettings';
import Seo from 'components/seo/Seo';
import ExpressCheckout from 'components/expressCheckout/ExpressCheckout';
import styles from './Profile.module.css';
import Menu from './Menu';
import DeliveryCalculator from './delivery/DeliveryCalculator';

function Profile() {
  const history = useHistory();
  const [shop, setShop] = useState(null);
  const [openHelpline, toggleHelpline] = useToggle();
  const params = useQueryParams();
  const user = useUser();
  const plan = usePlan();
  const isInFreeTrial = useIsOnFreeTrial();
  const isFree = useIsFreePlan();
  const isFreeTrialSubscribed = useIsFreeTrialSubscribed();
  const isFeatureRequestsEnabled = useIsPremiumFeatureRequestsEnabled();
  const isPrioritySupportEnabled = useIsPrioritySupportEnabled();
  const isAddressAdded = useIsAddressAdded();
  const isPaymentsEnabled = useIsPaymentsEnabled();
  const IsSocialMediaLinked = useIsSocialMediaLinked();
  const isMarketingPixelsAdded = useIsMarketingPixelsAdded();
  const isMarketingPixelsEnabled = useIsMarketingPixelEnabled();
  const isShopContentLinked = useIsShopContentLinked();
  const isSeoEnabled = useIsSeoEnabled();
  const isCustomerCampaignEnabled = useIsCustomerCampaignEnabled();
  const [menu, openMenu] = useState(false);
  const [enabled, setEnableGst] = useState(false);
  const [gstin, setGstIn] = useState('');
  const [slab, setSlab] = useState('');
  const isIND = shop?.country?.toLowerCase() === 'india';
  const isCouponsEnabled = useIsCouponsEnabled();
  const isHelloBarEnabled = useIsHelloBarEnabled();
  const isBannersEnabled = useIsBannersEnabled();
  const [openQRCode, toggleQRCode] = useToggle();
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const baseUrl = useShopBaseUrl();
  const enableRatings = useIsRatingsEnabled();
  const openPlans = useOpenPlans();
  const openPremiumPlans = useOpenPlans(false, 'generic', 'premium');
  const isChatEnabled = useIsChatEnabled();
  const [openProfile, toggleOpenProfile] = useToggle(false);

  const openDeliveryCharges = params.has('openDC');
  const openFaq = params.has('openFaq');
  const openSeo = params.has('openSeo');
  const openChat = params.has('openChat');
  const openTax = params.has('openTax');
  const openContact = params.has('openContact');
  const openInviteSeller = params.has('inviteSeller');
  const openDesktopVersion = params.has('desktopVersion');
  const openFeatureRequests = params.has('openFeatureRequests');
  const openCheckout = params.has('openCheckout');

  const openQrCode = () => {
    if (isFree) {
      openPlans();
      return;
    }
    toggleQRCode();
  };

  const taxLabel1 = 'Add Tax';
  const taxLabel2 = 'No Tax';
  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello
    We are now selling online. Please visit my WINDO Shop at
    ${shareShop(shop?.slug, isCustomDomain, domain)} to buy my products.
    Thank you
    ${shop.name}`);
  };

  const getShop = async () => {
    Loader.show();
    Becca.getShop()
      .then((shop) => {
        setShop(shop);
        // tax
        setEnableGst(get(shop, 'tax.enabled', false));
        setGstIn(get(shop, 'tax.gstin', ''));
        setSlab(get(shop, 'tax.slab', ''));
        Loader.hide();
      })
      .catch(() => {
        Snackbar.show('Network connectivity issue. Please check your internet and try again.', 'error');
        Loader.hide();
      });
  };

  const updateShop = async (payload, successMsg) => {
    try {
      const res = await Becca.updateShop(payload);
      getShop();
      Snackbar.show(successMsg);
      return res;
    } catch (exception) {
      Snackbar.showError(exception);
    }
  };

  const updateStatus = async (value) => {
    try {
      await Becca.updateShopStatus({ status: value });
      getShop();
    } catch (e) {
      Snackbar.show('Network connectivity issue. Please check your internet and try again.', 'error');
    }
  };

  const handleSwitchChange = async (event, val) => {
    let status = 'unlive';
    if (val) {
      status = 'live';
    }
    updateStatus(status);
  };

  useEffect(() => {
    getShop();
  }, []);

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
    <Grid item xs={4} className="flexCenter">
      <Clickable
        className={styles.tile}
        onClick={() => {
          if (primary === 'Payment Rules') {
            params.set('page', 'rules');
            history.push({
              search: params.toString(),
              pathname: to
            });
            return;
          }
          if (primary === 'Customer Login') {
            params.set('page', 'login');
            history.push({
              search: params.toString(),
              pathname: to
            });
            return;
          }
          if (primary === 'Live Chat Settings') {
            if (!isChatEnabled) {
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
              openPlans();
              return;
            }
            params.set('openCheckout', 'true');
            history.push({
              search: params.toString()
            });
            return;
          }

          if (primary === 'Ratings & Reviews') {
            if (!enableRatings) {
              params.set('openPlans', 'generic');
              params.set('planName', 'premium');
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
          if (primary === 'Hello Bar') {
            if (!isHelloBarEnabled) {
              params.set('openPlans', 'helloBar');
              history.push({
                search: params.toString(),
              });
              return;
            }
          }
          if (primary === 'SEO') {
            if (!isSeoEnabled) {
              params.set('openPlans', 'helloBar');
              params.set('planName', 'premium');
              history.push({
                search: params.toString(),
              });
              return;
            }
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
          if (primary === 'QR Code') {
            openQrCode();
            return;
          }
          if (primary === 'Help') {
            toggleHelpline();
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
          if (primary === 'Twitter') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://twitter.com/mywindoshop');
              return;
            }
            window.open('https://twitter.com/mywindoshop', '_blank');
            return;
          }
          if (primary === 'Linkedin') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://www.linkedin.com/company/mywindoshop/?viewAsMember=true');
              return;
            }
            window.open('https://www.linkedin.com/company/mywindoshop/?viewAsMember=true', '_blank');
            return;
          }
          if (primary === 'Instagram') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://www.instagram.com/mywindo.shop/');
              return;
            }
            window.open('https://www.instagram.com/mywindo.shop/', '_blank');
            return;
          }
          if (primary === 'Facebook') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://www.facebook.com/mywindo.shop');
              return;
            }
            window.open('https://www.facebook.com/mywindo.shop', '_blank');
            return;
          }
          if (primary === 'Youtube') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://www.youtube.com/channel/UCEFkdSXa1zSvTz-t7W2psJA');
              return;
            }
            window.open('https://www.youtube.com/channel/UCEFkdSXa1zSvTz-t7W2psJA', '_blank');
            return;
          }
          if (primary === 'Join Community') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://www.facebook.com/groups/901392637394533/');
              return;
            }
            window.open('https://www.facebook.com/groups/901392637394533/', '_blank');
            return;
          }
          if (primary === 'Blog') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://mywindo.shop/blog/resources/');
              return;
            }
            window.open('https://mywindo.shop/blog/resources/', '_blank');
            return;
          }
          if (primary === 'Refer & Earn') {
            if (WebView.isWebView()) {
              WebView.openUrl('https://windo.getrewardful.com/signup');
              return;
            }
            window.open('https://windo.getrewardful.com/signup', '_blank');
            return;
          }
          if (param) {
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

        <div classes={{ root: styles.minW }}>
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
    </Grid>
  );

  let subscriptionPlan = plan?.description;
  const planName = plan?.name;

  if (isInFreeTrial && !isFreeTrialSubscribed) {
    subscriptionPlan = 'Free Trial';
  }

  return (
    <div
      className={styles.section}
    >
      {openFaq && <FaqModel />}
      {openSeo && <Seo onClose={() => { params.delete('openSeo'); history.goBack(); }} />}
      {openChat && <ChatSettings onClose={() => { params.delete('openChat'); history.goBack(); }} />}
      {openInviteSeller && <InviteSeller />}
      {openDesktopVersion && <DesktopVersion />}
      {openFeatureRequests && <FeatureRequest />}
      {openQRCode && <QRCode url={baseUrl} onClose={toggleQRCode} />}
      {openHelpline && <HelpLine isDrawer={true} onClose={toggleHelpline} />}
      {openCheckout && <ExpressCheckout />}

      <div id="scroll" className={styles.content}>
        <Header onBack={() => history.push('/overview')} title="Settings" />
        <img src={menuIcon} alt="menu" className={styles.menu} onClick={() => openMenu(!menu)} />
        <div className={styles.body}>
          <div className={styles.profileHeader}>
            <div className={styles.planContainer}>
              <span className={styles.planText}>Current Plan :</span>
              &nbsp;
              {planName !== 'premium' ? (
                <span className={styles.planNameText}>
                  {subscriptionPlan}
                  {' '}
                  &nbsp;
                </span>
              ) : null}
              <Btn
                className={cx({
                  [styles.planBtn]: planName === 'premium',
                  [styles.upgradeBtn]: planName !== 'premium'
                })}
                primary={false}
                size="small"
                label={planName !== 'premium' ? 'Upgrade' : subscriptionPlan}
                endIcon={planName !== 'premium' ? upgradeIcon : null}
                onClick={planName !== 'premium' ? () => history.push('/subscriptions') : null}
              />
            </div>
            <div className={styles.profile}>
              <div className={cx('flexCenter', styles.img)}>
                {menu && <Menu onClose={() => openMenu(false)} />}
                <img src={shop?.icon && shop.icon[0] ? shop.icon[0] : blacky} className="avatar" alt="shop icon" />
                <div className={cx('fullWidth marginSTopBottom', styles.title)}>
                  <div translate="no">
                    {shop?.name}
                    <div className={styles.marginL}>
                      <span
                        className={cx(styles.statusDot, styles[shop?.status === 'created' ? 'live' : shop?.status])}
                      >
                        <span
                          className={cx(styles.dot1, styles[shop?.status === 'created' ? 'live' : shop?.status])}
                        >
                        </span>
                        {shop?.status === 'created' ? 'Live' : startCase(shop?.status)}
                      </span>
                      <img
                        className={styles.chevIcon}
                        src={openProfile ? chevUp : chevDown}
                        alt=""
                        onClick={() => toggleOpenProfile()} />
                    </div>
                  </div>
                  {user?.sellerId && (
                    <div className={styles.sellerIDContainer}>
                      <div>
                        Seller ID :
                        {' '}
                        {user.sellerId.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {openProfile && (
                <>
                  <div className={styles.line} />
                  <div
                    className={shop?.status === 'created' || shop?.status === 'live'
                      ? styles.status : styles.unliveStatus}
                  >
                    <div className={cx(styles.primary, styles[shop?.status === 'created' ? 'live' : shop?.status])}>
                      <span className={shop?.status === 'live' ? styles.liveText : styles.unLiveText}>
                        Shop status
                      </span>
                      <div className={styles.toggleSwitch}>
                        <Switch
                          active={shop?.status === 'live' || shop?.status === 'created'}
                          onChange={handleSwitchChange}
                        />
                      </div>
                    </div>
                    <div className={styles.secondary}>Make your shop live & unlive here.</div>
                    <div>
                    </div>
                  </div>
                  <div className={styles.line} />
                  <div className={cx('flexEnd')}>
                    <Btn
                      className={cx(styles.liveShareShopText, styles.shareShopBtn)}
                      primary={false}
                      startIcon={Share}
                      label="Share Shop"
                      onClick={shareToUser}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <>
            <SnapMini />
          </>
          <div className={styles.searchContainer}>
            <Search
              value=""
              placeholder="Search"
              onClick={() => history.push('/manage/search')}
            />
          </div>
          <div className={styles.heading}>
            Shop Settings
          </div>
          <div className={styles.shopSetting}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Address', addressIcon, null, '/manage/address', null, !isAddressAdded)}
                {getTile('Shop Profile', shopProfileIcon, null, '/manage/shop')}
                {getTile('Tax Details', taxIcon, null, '/settings/tax')}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Payments', paymentDetailIcon, null, '/manage/paymentModes', null, !isPaymentsEnabled)}
                {getTile('Shipping & Delivery', shippingIcon, null, '/shippingAndDelivery')}
                {getTile('Store Timings', storeTimeIcon, null, '/storeTimings')}
              </Grid>
            </Grid>
          </div>
          <div className={styles.heading}>
            My Account
          </div>
          <div className={styles.shopSetting}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Seller Account', sellerProfileIcon, null, '/sellerProfile')}
                {getTile('Subscriptions', subscriptionIcon, null, '/subscriptions')}
                {getTile('Invite Sellers', inviteSellerIcon, 'inviteSeller', null)}
                {/* {getTile('Add-On Users', addOnUserIcon, null, '/manage')} */}
              </Grid>
              <Grid item xs={12} className={styles.grid1}>
                {getTile('Desktop Version', desktopIcon, 'desktopVersion', null)}
                {getTile('Language', shopLanguageIcon, null, '/manage/language')}
                <Grid item xs={4}>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className={styles.heading}>
            Shop Website
          </div>
          <div className={styles.shopSetting}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Themes', themeIcon1, null, '/manage/theme')}
                {getTile('Shop Content', footerIcon, null, '/shopfootercontent', null, !isShopContentLinked)}
                {getTile('Social Media', socialMediaIcon, null, '/accounts', null, !IsSocialMediaLinked)}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Customer Login', loginSettingsIcon, null, '/manage/checkout')}
                {getTile('Custom Domain', coustomDomainIcon, null, '/manage/domain')}
                {getTile('Hello Bar', announcementsIcon, null, '/manage/helloBar', !isHelloBarEnabled)}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Banners', bannersIcon, null, '/manage/marketingBanners', !isBannersEnabled)}
                {getTile('Live Chat Settings', chatIcon, 'openChat', null, !isChatEnabled)}
                <Grid item xs={4} />
              </Grid>
            </Grid>
          </div>
          <div className={styles.heading}>
            Customers & Marketing
          </div>
          <div className={styles.shopSetting}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Ratings & Reviews', reviewIcon, null, '/manage/ratings', !enableRatings)}
                {getTile('QR Code', qrCodeIcon, null, 'qrCode', isFree)}
                {getTile('SEO', seoIcon, 'openSeo', null, !isSeoEnabled)}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Discount Coupons', dicountCouponsIcon, null, '/coupons', !isCouponsEnabled)}
                {getTile('Customers list & campaign', userIcon, null, '/manage/campaign', !isCustomerCampaignEnabled)}
                <Grid item xs={4} className="flexCenter"></Grid>
              </Grid>
            </Grid>
          </div>
          <div className={styles.heading}>
            Cart & Checkout
          </div>
          <div className={styles.shopSetting}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Payment Rules', paymentRulesIcon, null, '/manage/checkout')}
                {getTile('Checkout Flow', checkoutflowIcon1, null, null, isFree)}
                <Grid item xs={4} />
              </Grid>
            </Grid>
          </div>
          <div className={styles.heading}>
            Plugins & Integrations
          </div>
          <div className={styles.shopSetting}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Marketing Pixels', marketingIcon, null, '/manage/marketingPixels',
                  !isMarketingPixelsEnabled, !isMarketingPixelsAdded)}
                <Grid item xs={8} />
              </Grid>
            </Grid>
          </div>
          <div className={styles.heading}>
            Support
          </div>
          <div className={styles.shopSetting} elevation={4}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid2}>
                {getTile('Help', helpIcon, 'openHelpline', null,)}
                {getTile(
                  'Feature Requests', requestIcon, 'openFeatureRequests', null,
                )}
                {getTile('FAQ', faqIcon, 'openFaq', null)}
              </Grid>
              <Grid item xs={12} className={styles.grid2}>
                {getTile('Join Community', communityIcon, null, null)}
                {getTile('Blog', blogIcon, null, null)}
                {getTile('Refer & Earn', inviteSellerIcon, 'null', null)}
              </Grid>
              <Grid item xs={12} className={styles.grid2}>
                {getTile('Linkedin', linkedinIcon, null, null)}
                {getTile('Instagram', instagramIcon, null, null)}
                {getTile('Twitter', twitterIcon, null, null)}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Facebook', facebookIcon, null, null)}
                {getTile('Youtube', youtubeIcon, null, null)}
                <Grid item xs={4} className="flexCenter"></Grid>
              </Grid>
            </Grid>
          </div>
        </div>
        <Drawer
          title="Tax Details"
          open={openTax}
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
                      label="Tax Identification Number"
                      placeholder="Enter Tax Identification Number"
                      setValue={(e) => setGstIn(e)}
                      required={true}
                    />
                    {/* {isIND && (
                        <Select
                          className={styles.select}
                          label="Tax Percentage"
                          placeholder="Select Tax Percentage"
                          value={slabOptions.find(x => x.value === slab)}
                          onChange={(e) => setSlab(e.value)}
                          options={slabOptions}
                        />
                      )} */}
                    {isIND && (
                      <ReactInput
                        value={slab}
                        label="Tax Percentage(%)"
                        placeholder="Enter Tax Percentage"
                        type="number"
                        setValue={(e) => setSlab(e)}
                        required
                      />
                    )}
                  </>
                )}
                <FooterButton>
                  <Button
                    id="taxform"
                    hidden
                    className={styles.hidden}
                    type="submit"
                    size="large"
                  />
                </FooterButton>
                <div className={cx(styles.button_flex, 'fullWidth')}>
                  <Btn
                    fullWidth
                    bordered={false}
                    size="large"
                    label="Save"
                    onClick={() => {
                      const el = document.getElementById('taxform');
                      el.click();
                    }}
                  />
                </div>
              </Grid>
            </form>
          </div>
        </Drawer>
        <Drawer
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
          anchor="bottom"
          open={openDeliveryCharges}
          onClose={() => history.goBack()}
        >
          <DeliveryCalculator />
        </Drawer>
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

export default Profile;
