/* eslint-disable no-unused-vars */
import aboutD from 'assets/themes/aboutD.png';
import collectionsM from 'assets/themes/collectionsM.png';
import policiesD from 'assets/themes/policiesD.png';
import shopM from 'assets/themes/shopM.png';
import timingsD from 'assets/themes/timingsD.png';
import aboutM from 'assets/themes/aboutM.png';
import otherD from 'assets/themes/otherD.png';
import policiesM from 'assets/themes/policiesM.png';
import socialD from 'assets/themes/socialD.png';
import timingsM from 'assets/themes/timingsM.png';
import bannerD from 'assets/themes/bannerD.png';
import otherM from 'assets/themes/otherM.png';
import privacyD from 'assets/themes/privacyD.png';
import socialM from 'assets/themes/socialM.png';
import bannerM from 'assets/themes/bannerM.png';
import paymentsD from 'assets/themes/paymentsD.png';
import privacyM from 'assets/themes/privacyM.png';
import storeD from 'assets/themes/storeD.png';
import collectionsD from 'assets/themes/collectionsD.png';
import paymentsM from 'assets/themes/paymentsM.png';
import shopD from 'assets/themes/shopD.png';
import storeM from 'assets/themes/storeM.png';
import { get } from 'lodash';

const images = {
  banners: {
    celosia: 'https://profile.windo.live/seller__themes/mobile/dafodil/bannerImage.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/mobile/dafodil/bannerImage.original.png',
    carnation: 'https://profile.windo.live/seller__themes/mobile/carnation/bannerImage.original.png',
    calathea: 'https://profile.windo.live/seller__themes/mobile/calathea/bannerImage.original.png',
    lilac: 'https://profile.windo.live/seller__themes/mobile/lilac/bannerImage.original.png',
  },
  catalogs: {
    celosia: 'https://profile.windo.live/seller__themes/mobile/dafodil/catalogImage.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/mobile/dafodil/catalogImage.original.png',
    carnation: 'https://profile.windo.live/seller__themes/mobile/carnation/catalogImage.original.png',
    calathea: 'https://profile.windo.live/seller__themes/mobile/calathea/catalogImage.original.png',
    lilac: 'https://profile.windo.live/seller__themes/mobile/lilac/catalogImage.original.png',
  },
  productCard: {
    celosia: 'https://profile.windo.live/seller__themes/mobile/dafodil/productCard.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/mobile/dafodil/productCard.original.png',
    carnation: 'https://profile.windo.live/seller__themes/mobile/carnation/productCard.original.png',
    calathea: 'https://profile.windo.live/seller__themes/mobile/calathea/productCard.original.png',
    lilac: 'https://profile.windo.live/seller__themes/mobile/lilac/productCard.original.png',
  },
  shopProfile: {
    celosia: 'https://profile.windo.live/seller__themes/mobile/dafodil/shopProfile.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/mobile/dafodil/shopProfile.original.png',
    carnation: 'https://profile.windo.live/seller__themes/mobile/carnation/shopProfile.original.png',
    calathea: 'https://profile.windo.live/seller__themes/mobile/calathea/shopProfile.original.png',
    lilac: 'https://profile.windo.live/seller__themes/mobile/lilac/shopProfile.original.png',
  },
};

const desktopImages = {
  banners: {
    celosia: 'https://profile.windo.live/seller__themes/desktop/dafodil/bannerImage.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/desktop/dafodil/bannerImage.original.png',
    carnation: 'https://profile.windo.live/seller__themes/desktop/carnation/bannerImage.original.png',
    calathea: 'https://profile.windo.live/seller__themes/desktop/calathea/bannerImage.original.png',
    lilac: 'https://profile.windo.live/seller__themes/desktop/lilac/bannerImage.original.png',
  },
  catalogs: {
    celosia: 'https://profile.windo.live/seller__themes/desktop/dafodil/catalogImage.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/desktop/dafodil/catalogImage.original.png',
    carnation: 'https://profile.windo.live/seller__themes/desktop/carnation/catalogImage.original.png',
    calathea: 'https://profile.windo.live/seller__themes/desktop/calathea/catalogImage.original.png',
    lilac: 'https://profile.windo.live/seller__themes/desktop/lilac/catalogImage.original.png',
  },
  productCard: {
    celosia: 'https://profile.windo.live/seller__themes/desktop/dafodil/productCard.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/desktop/dafodil/productCard.original.png',
    carnation: 'https://profile.windo.live/seller__themes/desktop/carnation/productCard.original.png',
    calathea: 'https://profile.windo.live/seller__themes/desktop/calathea/productCard.original.png',
    lilac: 'https://profile.windo.live/seller__themes/desktop/lilac/productCard.original.png',
  },
  shopProfile: {
    celosia: 'https://profile.windo.live/seller__themes/desktop/dafodil/shopProfile.original.png',
    daffodil: 'https://profile.windo.live/seller__themes/desktop/dafodil/shopProfile.original.png',
    carnation: 'https://profile.windo.live/seller__themes/desktop/carnation/shopProfile.original.png',
    calathea: 'https://profile.windo.live/seller__themes/desktop/calathea/shopProfile.original.png',
    lilac: 'https://profile.windo.live/seller__themes/desktop/lilac/shopProfile.original.png',
  },
};

const getStyles = (component, isDesktop = false) => [
  {
    image: isDesktop ? desktopImages[component].celosia : images[component].celosia,
    title: 'celosia',
  },
  {
    image: isDesktop ? desktopImages[component].daffodil : images[component].daffodil,
    title: 'daffodil',
  },
  {
    image: isDesktop ? desktopImages[component].carnation : images[component].carnation,
    title: 'carnation',
  },
  {
    image: isDesktop ? desktopImages[component].calathea : images[component].calathea,
    title: 'calathea',
  },
  {
    image: isDesktop ? desktopImages[component].lilac : images[component].lilac,
    title: 'lilac',
  }
];

export const components = (themeName = null, isDesktop = false) => ({
  shopProfile: {
    title: 'Shop Profile Style',
    styles: !themeName ? getStyles('shopProfile', isDesktop)
      : getStyles('shopProfile', isDesktop).filter(style => style.title === themeName),
    key: 'shopProfile',
  },
  banners: {
    title: 'Shop Banner Style',
    styles: !themeName ? getStyles('banners', isDesktop)
      : getStyles('banners', isDesktop).filter(style => style.title === themeName),
    key: 'banners',
  },
  catalogs: {
    title: 'Collection Style',
    styles: !themeName ? getStyles('catalogs', isDesktop)
      : getStyles('catalogs', isDesktop).filter(style => style.title === themeName),
    key: 'catalogs',
  },
  productCard: {
    title: 'Product card Style',
    styles: !themeName ? getStyles('productCard', isDesktop)
      : getStyles('productCard', isDesktop).filter(style => style.title === themeName),
    key: 'productCard',
  },
  header: {
    title: 'Header Style',
    key: 'header',
  },
  footer: {
    title: 'Footer Style',
    key: 'footer',
  }
});

export const getDefaultValues = (componentType = null, themeName = null, isDesktop) => {
  if (!componentType) {
    return components(themeName, isDesktop);
  }
  return components(themeName, isDesktop)[componentType];
};

export function getInitialValues(values = {}) {
  return {
    shopProfile: {
      name: values?.shopProfile?.name || 'celosia',
      enabled: values?.shopProfile?.enabled || true,
    },
    banners: {
      name: values?.banners?.name || 'celosia',
      enabled: values?.banners?.enabled ?? true,
    },
    catalogs: {
      name: values?.catalogs?.name || 'celosia',
      enabled: values?.catalogs?.enabled ?? true,
    },
    productCard: {
      name: values?.productCard?.name || 'celosia',
    },
  };
}

export const LAYOUT_CONFIG = {
  shopProfile: {
    name: 'Shop Profile',
    images: {
      mobile: shopM,
      desktop: shopD,
    },
    key: 'shopProfile',
  },
  marketingBanners: {
    name: 'Marketing Banners',
    images: {
      mobile: bannerM,
      desktop: bannerD,
    },
    key: 'marketingBanners',
  },
  collections: {
    name: 'Collections',
    images: {
      mobile: collectionsM,
      desktop: collectionsD,
    },
    key: 'collections',
  },
  aboutUs: {
    name: 'About Us',
    images: {
      mobile: aboutM,
      desktop: aboutD,
    },
    key: 'aboutUs',
  },
  shopPolicies: {
    name: 'Shop Policies',
    images: {
      mobile: policiesM,
      desktop: policiesD,
    },
    key: 'shopPolicies',
  },
  shopTimings: {
    name: 'Shop Timings',
    images: {
      mobile: timingsM,
      desktop: timingsD,
    },
    key: 'shopTimings',
  },
  paymentMethods: {
    name: 'Payment Methods',
    images: {
      mobile: paymentsM,
      desktop: paymentsD,
    },
    key: 'paymentMethods',
  },
  storeInformation: {
    name: 'Store Information',
    images: {
      mobile: storeM,
      desktop: storeD,
    },
    key: 'storeInformation',
  },
  otherInformation: {
    name: 'Other Information',
    images: {
      mobile: otherM,
      desktop: otherD,
    },
    key: 'otherInformation',
  },
  socialMedia: {
    name: 'Social Media',
    images: {
      mobile: socialM,
      desktop: socialD,
    },
    key: 'socialMedia',
  },
  ppTncs: {
    name: 'Privacy Policy Terms & Conditions ',
    images: {
      mobile: privacyM,
      desktop: privacyD,
    },
    key: 'ppTncs',
  },
};

export function layoutConfig(values = {}) {
  return {
    shopProfile: {
      enabled: values?.shopProfile?.enabled ?? true,
    },
    marketingBanners: {
      enabled: values?.marketingBanners?.enabled ?? true,
    },
    collections: {
      enabled: values?.collections?.enabled ?? true,
    },
    aboutUs: {
      enabled: values?.aboutUs?.enabled ?? true,
    },
    shopPolicies: {
      enabled: values?.shopPolicies?.enabled ?? true,
    },
    shopTimings: {
      enabled: values?.shopTimings?.enabled ?? true,
    },
    paymentMethods: {
      enabled: values?.paymentMethods?.enabled ?? true,
    },
    storeInformation: {
      enabled: values?.storeInformation?.enabled ?? true,
    },
    otherInformation: {
      enabled: values?.otherInformation?.enabled ?? true,
    },
    socialMedia: {
      enabled: values?.socialMedia?.enabled ?? true,
    },
    ppTncs: {
      enabled: values?.ppTncs?.enabled ?? true,
    },
  };
}
