import { loadStripe } from '@stripe/stripe-js';
import CONFIG from 'config';

let stripe = null;

async function getStripe() {
  if (stripe !== null) {
    return stripe;
  }
  stripe = await loadStripe(CONFIG.STRIPE.key);
  return stripe;
}

async function redirectToCheckout(sessionId) {
  const instance = await getStripe();
  const result = await instance.redirectToCheckout({
    sessionId,
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}

const Stripe = {
  getStripe,
  redirectToCheckout,
};

export default Stripe;
