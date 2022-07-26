import { useEffect, useState } from 'react';
import _ from 'lodash';
import { External } from 'api';
import { countryMap, getCurrencyByCountry } from 'utils/countries';

export function useCountryFromIP(initialCountry = '', initialCurrency = '', fetch = true) {
  const [country, setCountry] = useState(initialCountry);
  const [currency, setCurrency] = useState(initialCurrency);

  const fetchCountry = async () => {
    try {
      const { isoAlpha2: countryCode } = await External.getCountry();
      const name = countryMap[countryCode];
      if (name) {
        setCountry(name);
        setCurrency(getCurrencyByCountry(name));
      }
    } catch (e) {
      console.error(e);
      // Ignore error
    }
  };

  useEffect(() => {
    if (_.isEmpty(country) && fetch) {
      fetchCountry();
    }
  }, []);

  return [country, setCountry, currency, setCurrency];
}
