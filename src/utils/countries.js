import _ from 'lodash';
import { CountriesAndUnicodes } from './countriesDump';
// import { getParamByISO } from 'iso-country-currency';

export const getCountries = () => CountriesAndUnicodes;

const getISO = () => {
  const all = getCountries().map(x => ({
    [x.iso]: x.countryName
  }));
  return _.reduce(all, (memo, current) => _.assign(memo, current), {});
};

export const countryMap = Object.freeze(getISO());

export const inverseCountryMap = _.invert(countryMap);

export const getCurrencyByCountry = country => getCountries()
  .find(x => x.countryName.toLowerCase() === country)?.currency || 'INR';

export const getCurrencySymbolByCountry = country => {
  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: getCurrencyByCountry(country),
  }).format(1).charAt(0);
  return value;
};

export const isStripeAllowed = (country) => getCountries()
  .filter(x => x.stripeAllowed)
  .map(x => x.countryName)
  .includes(country?.toLowerCase());

export const isPayPalAllowed = (country) => getCountries()
  .filter(x => x.paypalAllowed)
  .map(x => x.countryName)
  .includes(country?.toLowerCase());

const flutterWaveSupported = ['NGN', 'GHS', 'ZAR', 'ARS', 'BRL', 'GBP', 'CAD', 'CVE', 'CLP', 'COP',
  'CDF', 'EGP', 'EUR', 'GMD', 'GNF', 'KES', 'LRD', 'MWK', 'MXN', 'MAD', 'MZN', 'RWF', 'SLL', 'STD',
  'TZS', 'UGX', 'XAF', 'XOF', 'ZMK'];

export const isFlutterWaveAllowed = (currency) => flutterWaveSupported.includes(currency?.toUpperCase());

export const isPayStackAllowed = (currency) => ['GHS', 'KES', 'NGN', 'TZS', 'UGX', 'ZAR']
  .includes(currency?.toUpperCase());
