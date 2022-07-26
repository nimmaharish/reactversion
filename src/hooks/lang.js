import { useEffect } from 'react';
import { useSetLanguage } from 'contexts';
import { Becca } from 'api';

export function useSyncLanguage(shop, refresh) {
  const setLanguage = useSetLanguage();

  useEffect(() => {
    const lang = localStorage.getItem('language');
    const shopLang = shop?.config?.sellerLang;
    if ((!lang && shopLang) || (lang === 'en' && shopLang !== 'en')) {
      setLanguage(shopLang);
      return;
    }
    if (lang && shopLang && lang !== shopLang && lang !== 'en') {
      const config = shop.config || {};
      config.sellerLang = lang;
      Becca.updateShop({ config }).then(() => refresh()).catch(console.error);
    }
  }, [shop?.config?.sellerLang]);
}
