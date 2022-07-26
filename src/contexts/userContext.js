import { createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import moment from 'moment';
import CONFIG from 'config';
import { getCountries } from 'utils/countries';
import _, { get, isEmpty } from 'lodash';
import { capitalCase } from 'change-case';

export const UserContext = createContext({
  shop: null,
  overview: null,
  refreshShop: () => {
  },
  refreshOverview: () => {
  },
  templates: [],
  refreshTemplates: () => {
  },
  user: null,
  refreshUser: () => {
  },
  wallet: null,
  refreshWallet: () => {
  },
  partners: null,
  refreshPartners: () => {
  },
});

export function useShop() {
  return useContext(UserContext).shop;
}

export function isIND() {
  return useContext(UserContext)
    ?.shop
    ?.country
    ?.toLowerCase() === 'india';
}

export function useOverview() {
  return useContext(UserContext).overview;
}

export function useRefreshShop() {
  return useContext(UserContext).refreshShop;
}

export function useRefreshOverview() {
  return useContext(UserContext).refreshOverview;
}

export function useTemplates() {
  return useContext(UserContext).templates;
}

export function useRefreshTemplates() {
  return useContext(UserContext).refreshTemplates;
}

export function useUser() {
  return useContext(UserContext).user;
}

export function useUserRefresh() {
  return useContext(UserContext).refreshUser;
}

export function useWallet() {
  return useContext(UserContext).wallet;
}

export function useWalletRefresh() {
  return useContext(UserContext).refreshWallet;
}

export function usePartners() {
  return useContext(UserContext).partners;
}

export function usePartnersRefresh() {
  return useContext(UserContext).refreshPartners;
}

export function usePaymentAccounts() {
  const shop = useShop();
  return shop.accounts || [];
}

export function usePaymentAccount(name) {
  const accounts = usePaymentAccounts();
  const account = accounts.find(a => a.name === name);
  if (!account) {
    return {
      enabled: false,
    };
  }
  return account;
}

export function useStripeAccount() {
  return usePaymentAccount('stripe');
}

export function usePlan() {
  return useContext(UserContext).shop?.plan;
}

export function useIsFreePlan() {
  return usePlan()?.name === 'free';
}

export function useFeatureConfig() {
  return usePlan().config;
}

export function useIsFeatureEnabled(name) {
  const config = useFeatureConfig();
  return !!config?.[name];
}

export function useIsCouponsEnabled() {
  return useIsFeatureEnabled('coupons');
}

export function useIsSeoEnabled() {
  return useIsFeatureEnabled('seo');
}

export function useIsChatEnabled() {
  return usePlan()?.name === 'premium';
}

export function useIsCustomerCampaignEnabled() {
  return usePlan()?.name === 'premium';
}

export function useIsMarketingPixelEnabled() {
  return useIsFeatureEnabled('marketingPixels');
}

export function useIsCustomDomainEnabled() {
  return useIsFeatureEnabled('domain');
}

export function useIsThemeEnabled() {
  return useIsFeatureEnabled('multiple.themes');
}

export function useIsAnalyticsEnabled() {
  return useIsFeatureEnabled('analytics');
}

export function useIsBulkEnabled() {
  return useIsFeatureEnabled('bulk');
}

export function useIsHelloBarEnabled() {
  return useIsFeatureEnabled('helloBar');
}

export function useIsBannersEnabled() {
  return useIsFeatureEnabled('banner');
}

export function useIsDesktopEnabled() {
  return useIsFeatureEnabled('desktop');
}

export function useIsSocialMediaEnabled() {
  return useIsFeatureEnabled('socialMedia');
}

export function useIsAboutEnabled() {
  return useIsFeatureEnabled('about');
}

export function useIsInstantSyncEnabled() {
  return useIsFeatureEnabled('instant.instagram');
}

export function useIsConditionalChargesEnabled() {
  return useIsFeatureEnabled('delivery.conditional');
}

export function useIsPremiumFeatureRequestsEnabled() {
  return useIsFeatureEnabled('premiumFeatureRequest');
}

export function useIsPrioritySupportEnabled() {
  return useIsFeatureEnabled('priority.support');
}

export function useIsCartAbandonmentEnabled() {
  return useIsFeatureEnabled('cart.abandonment');
}

export function useIsRatingsEnabled() {
  return useIsFeatureEnabled('ratings');
}

export function IsShopRatingsEnabled() {
  const shop = useShop();
  return get(shop, 'config.ratings.enabled', true);
}

export function IsShopRatingsAutoApproved() {
  const shop = useShop();
  return get(shop, 'config.ratings.autoApprove', true);
}

export function useOpenPlans(replace = false, value = 'generic', plan = null) {
  const history = useHistory();
  const params = useQueryParams();
  return () => {
    params.set('openPlans', value);
    if (plan) {
      params.set('planName', plan);
    }
    if (replace) {
      history.replace({
        search: params.toString(),
      });
      return;
    }
    history.push({
      search: params.toString(),
    });
  };
}

export function useIsFreeTrialEnabled() {
  const shop = useShop();
  // if (shop.country !== 'india') {
  //   return false;
  // }
  return !shop?.settings?.freeTrial?.used;
}

export function useIsFreeTrialSubscribed() {
  const shop = useShop();
  // if (shop.country !== 'india') {
  //   return false;
  // }
  return !!shop?.settings?.freeTrial?.subscribed;
}

export function useIsOnFreeTrial() {
  const shop = useShop();
  if (shop?.plan?.name !== 'plus') {
    return false;
  }
  if (!shop?.settings?.freeTrial?.used) {
    return false;
  }
  const { startsAt, endsAt } = shop.settings.freeTrial;
  if (!endsAt) {
    return false;
  }
  const now = moment();
  return now.isAfter(moment(startsAt)) && now.isBefore(moment(endsAt));
}

export function useIsPaymentsEnabled() {
  const { paymentModes } = useShop();
  return paymentModes?.online?.enabled || paymentModes?.cod?.enabled || paymentModes?.custompayment?.enabled;
}

export function isPaymentPartnerConnected(name) {
  const accounts = usePaymentAccounts();
  const account = accounts.find(a => a.name === name);
  return account;
}

export function useIsOnCustomDomain() {
  const shop = useShop();
  return !!(shop?.domain?.host) && shop?.domain?.status === 'created';
}

export function useCustomDomain() {
  const shop = useShop();
  return shop?.domain?.host;
}

export function useIsAddressAdded() {
  const shop = useShop();
  return shop?.addresses?.length > 0 || false;
}

export function useDefaultAddress() {
  const shop = useShop();
  return shop?.addresses?.find(x => x.default);
}

export function useIsAboutAdded() {
  const shop = useShop();
  return shop?.about?.length > 0 || false;
}

export function useIsTermsAdded() {
  const shop = useShop();
  return shop?.tncs?.length > 0 || false;
}

export function useIsSocialMediaLinked() {
  const shop = useShop();
  return shop?.linkedAccounts?.length > 0 || false;
}

export function useIsStripeEnabledCountry() {
  const { country = '' } = useShop();
  return getCountries()
    .filter(x => x.stripeAllowed)
    .map(x => x.countryName)
    .includes(country?.toLowerCase());
}

export function useIsPayPalEnabledCountry() {
  const { country = '' } = useShop();
  return getCountries()
    .filter(x => !x.paypalAllowed)
    .map(x => x.countryName)
    .includes(country?.toLowerCase());
}

export function useIsMarketingPixelsAdded() {
  const shop = useShop();
  const pixels = shop?.config?.pixels || {};
  return !!(pixels?.fb?.id || pixels?.ga?.id);
}

export function useShopBaseUrl() {
  const isCustom = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const shop = useShop();
  if (isCustom) {
    return `https://${domain}`;
  }
  if (CONFIG.ENV === 'production') {
    return `https://mywindo.shop/${shop.slug}`;
  }
  return `https://staging.mywindo.shop/${shop.slug}`;
}

export function useIsRowCountry() {
  const { country = '' } = useShop();
  return getCountries().filter(x => x.stripeAllowed)
    .map(x => x.countryName).includes(country?.toLowerCase());
}

export function usePaymentRules(full = false) {
  const shop = useShop();
  const data = shop?.checkout?.paymentRules || [];
  const items = [];

  const accounts = _.uniqBy(shop?.accounts || [], 'name');

  const { paymentModes } = shop;
  const customPayments = shop?.paymentModes?.custompayment?.configured || [];

  if (accounts.length === 0 && !paymentModes?.cod?.enabled && customPayments.length === 0) {
    return items;
  }

  accounts.forEach((account) => {
    items.push({
      type: 'online',
      value: account.name,
      name: capitalCase(account.name),
      paymentEnabled: full ? account.enabled : undefined,
    });
  });

  customPayments.forEach((payment) => {
    items.push({
      type: 'customPayment',
      value: payment._id,
      name: payment.mode,
      details: full ? payment.details : undefined,
      paymentEnabled: full ? payment.status === 'live' : undefined,
    });
  });

  items.push({
    type: 'cod',
    value: 'default',
    name: 'Cash',
    paymentEnabled: full ? shop?.paymentModes?.cod?.enabled : undefined,
  });

  return items.map(item => {
    const found = data.find(x => x.type === item.type && x.value === item.value);
    return {
      ...item,
      enabled: found?.enabled || false,
      cartValue: {
        min: found?.cartValue?.min || '',
        max: found?.cartValue?.max || '',
      },
      advanced: {
        feeType: found?.advanced?.feeType || 'additional',
        type: found?.advanced?.type || 'percentage',
        value: found?.advanced?.value || '',
        maxValue: found?.advanced?.maxValue || '',
      },
      partial: {
        type: 'percentage',
        value: found?.partial?.value || '',
        maxValue: found?.partial?.maxValue || '',
      }
    };
  });
}

export function isAboutShopFilled() {
  const { about = '' } = useShop();
  return !isEmpty(about);
}

export function isLegalPrivacyFilled() {
  const { legalPrivacyPolicy = '' } = useShop();
  return !isEmpty(legalPrivacyPolicy);
}

export function isLegalTermsFilled() {
  const { legalTncs = '' } = useShop();
  return !isEmpty(legalTncs);
}

export function useIsShopContentLinked() {
  const isAboutAdded = useIsAboutAdded();
  const isTermsAdded = useIsTermsAdded();
  const legalPrivacyFilled = isLegalPrivacyFilled();
  const legalTermsFilled = isLegalTermsFilled();
  const aboutShopFilled = isAboutShopFilled();
  return isAboutAdded && isTermsAdded && legalPrivacyFilled && legalTermsFilled && aboutShopFilled;
}

export function useIsUserRated() {
  const { rated = false } = useShop();
  return rated;
}

export function useIsPremiumThemeEnabled() {
  return useIsFeatureEnabled('premium.themes');
}

export function useImagesLength(variants = false) {
  const { name } = usePlan();
  switch (name) {
    case 'premium':
      return -1;
    case 'plus':
      return variants ? 4 : 8;
    default:
      return variants ? 2 : 4;
  }
}

export function useShopTaxes() {
  const shop = useShop();
  const taxes = get(shop, 'taxes', []);
  return taxes.filter(x => !x.isDeleted);
}
