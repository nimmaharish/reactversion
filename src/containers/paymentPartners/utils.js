import * as Yup from 'yup';
import _ from 'lodash';

const getBoolValue = (item = {}) => _.get(item, 'config.enabled', true);

export const getInitialValues = (values = {}) => {
  const val = {
    keyId: values?.config?.keyId || '',
    enabled: getBoolValue(values),
    keySecret: values?.config?.keySecret || '',
  };
  return val;
};

export const schema = Yup.object({
  keyId: Yup.string().required(),
  enabled: Yup.bool(),
  keySecret: Yup.string().required(),
});

export const isEmptyPartner = (name, list = []) => {
  const partner = list.find(x => x.name === name);
  if (partner) {
    return false;
  }
  return true;
};

export const replaceString = (str = '') => {
  // eslint-disable-next-line prefer-destructuring
  const length = str.length;
  const xStr = Array(length).join('X');
  return str.substring(0, 4) + xStr + str.substring(length - 4, length);
};

export const steps = {
  stripe: [
    'Payments done by the customer will be settled to your stripe account immediately. ',
    'You need to connect your bank account in your stripe dashboard to receive the payouts',
    'In most cases, the Stripe account approval process is nearly instantaneous and most users '
      + 'will be able to accept payments right away. If Stripe needs more information about a business '
      + 'or individual, '
      + 'expect a longer delay in processing an account approval, Stripe will reach out to you immediately.',
    'There will be payment gateway charges(as levied by Stripe, not a commission to WINDO) and '
     + ' will be visible in your stripe dashboard',
    'Your payout schedule will be as per the stripe payout schedule in your country. For more details, '
     + ' check here - https://stripe.com/docs/payouts',
    'You will get priority support if there is any dispute with regard to any of your transactions, '
    + ' just click on the help button.'
  ],
  razorpay: [
    'Go to Settings',
    'Click on API Keys',
    'Copy the Key ID and its corresponding Key Secret, and paste them here',
    {
      label: 'You must whitelist your shop website in Razorpay to start accepting payments '
      + ' once your account activation is done.',
      items: [
        'Please add ‘https://mywindo.shop’ or your custom domain to the whitelisted domains. ',
        'Go to Razorpay Dashboard → My Account → Profile → Update Website/Mobile App '
    + ' details to add the domain to be whitelisted',
      ]
    },
  ],
  paypal: [
    'Login to your PayPal developer dashboard https://developer.paypal.com',
    'Go to Profile > Dashboard',
    'Move your environment from Test to Live and click on Create App, if your app is not already created',
    // eslint-disable-next-line max-len
    'Enter the name of your app, set your app type as Merchant, specify the business account to be linked, and tap the Create App button ',
    'Click on the generated app. The client ID and secret will be available under the API credentials section',
  ],
  cashfree: [
    'Go to Developers',
    'Click on API Keys under payment gateway',
    'Click on generate API Keys',
    'Copy App Id and Secret key'
  ],
  flutterwave: [
    'Go to Settings',
    'Click on API',
    'Copy public key (Key Id) and Secret key'
  ],
  paystack: [
    'Go to Settings',
    'Click on API Keys & Webhooks',
    'Copy public key (Key Id) and Secret key'
  ],
  midtrans: [
    'Before integrating with Midtrans, you need to register for Account. https://account.midtrans.com/register',
    'Login to your account, go to Dashboard',
    'On the Dashboard, go to Settings > Access Keys.',
    'Copy client key (Key Id) and Server key (Secret key)',
  ],
  moncash: [
    'Before integrating with MonCash, you need to register for Account. '
     + ' https://moncashbutton.digicelgroup.com/',
    'Login to your account, go to Dashboard',
    'On the Dashboard, go to General Info, Add Business or Open existing business',
    'Click on Client create rest api',
    'Copy client id (Key Id) and client secret'
  ],
  paytm: [
    'Before integrating with Paytm, you need to register for Account.  https://dashboard.paytm.com/login/',
    'Login to your account, go to Dashboard',
    'Expand Developer Settings, Click on API Keys',
    'Go to Production API Details',
    'Copy merchant id (key id) and merchant key (key secret)'
  ]
};

export const heading = {
  stripe: 'How to Integrate Stripe',
  paypal: 'How to Integrate Paypal',
  razorpay: 'How to Integrate Razorpay',
  cashfree: 'How to Integrate Cashfree',
  flutterwave: 'How to Integrate Flutterwave',
  paystack: 'How to Integrate Paystack',
  moncash: 'How to Integrate Moncash',
  midtrans: 'How to Integrate Midtrans',
  paytm: 'How to Integrate Paytm',
};

export const title = {
  stripe: 'Stripe',
  paypal: 'Paypal',
  razorpay: 'Razorpay',
  cashfree: 'Cashfree',
  flutterwave: 'Flutterwave',
  paystack: 'Paystack',
  moncash: 'Moncash',
  midtrans: 'Midtrans',
  paytm: 'Paytm',
};

export const drawerTitle = {
  stripe: 'Stripe Details',
  paypal: 'Paypal Details',
  razorpay: 'Razorpay Details',
  cashfree: 'Cashfree Details',
  flutterwave: 'Flutterwave Details',
  paystack: 'Paystack Details',
  moncash: 'Moncash Details',
  midtrans: 'Midtrans Details',
  paytm: 'Paytm Details',
};

export const url = {
  stripe: 'https://www.stripe.com/',
  paypal: 'https://developer.paypal.com/',
  razorpay: 'https://www.razorpay.com/',
  cashfree: 'https://www.cashfree.com',
  flutterwave: 'https://dashboard.flutterwave.com/',
  paystack: 'https://dashboard.paystack.com/',
  moncash: 'https://moncashbutton.digicelgroup.com/',
  midtrans: 'https://account.midtrans.com/register',
  paytm: 'https://dashboard.paytm.com/'
};

export const PAYPAL_SUPPORTED_CURRENCY = new Set([
  'AUD', 'BRL', 'CAD', 'CNY', 'CZK', 'DKK', 'EUR', 'HKD', 'HUF', 'ILS', 'JPY', 'MYR', 'MXN',
  'TWD', 'NZD', 'NOK', 'PHP', 'PLN', 'GBP', 'RUB', 'SGD', 'SEK', 'CHF', 'THB', 'USD',
]);

export const MIDTRANS_SUPPORTED_CURRENCY = new Set(['IDR']);

export const MONCASH_SUPPORTED_CURRENCY = new Set(['HTG']);

export const PAYTM_SUPPORTED_CURRENCY = new Set(['INR']);

export const isMonCashAllowed = (currency) => MONCASH_SUPPORTED_CURRENCY
  .has(currency?.toUpperCase());

export const isMidtransAllowed = (currency) => MIDTRANS_SUPPORTED_CURRENCY
  .has(currency?.toUpperCase());

export const isPaytmAllowed = (currency) => PAYTM_SUPPORTED_CURRENCY
  .has(currency?.toUpperCase());
