import { useCallback, useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';

export function useShop(error = true) {
  const [shop, setShop] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setShop(await Becca.getShop());
      setLoaded(true);
    } catch (e) {
      if (error) {
        console.error(e);
        Snackbar.show('Errror Occured', 'error');
      } else {
        setLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [shop, refresh, loading, loaded];
}

export function useShopOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setOverview((await Becca.overview()) || {});
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);
  return [overview, refresh, loading];
}

export function useShopTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const { templates: newTemplates } = await Becca.templates(0, 1000, {}, { createdAt: -1 });
      setTemplates(newTemplates);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occured', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [templates, refresh, loading];
}

export function useShopShippingPartners() {
  const [partners, setPartners] = useState({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const data = await Becca.getShippingPartners();
      setPartners(data);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occured', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [partners, refresh, loading];
}

export function useShopPaymentPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const { accounts = [] } = await Becca.getShop();
      const stripe = accounts.find(x => x.name === 'stripe');
      const rzpay = accounts.find(x => x.name === 'razorpay');
      const paypal = accounts.find(x => x.name === 'paypal');
      if (stripe) {
        stripe.config = {};
        const data = await Becca.getAccount('stripe');
        stripe.config = data;
      }
      if (rzpay) {
        rzpay.config = {};
        const data = await Becca.getAccount('razorpay');
        rzpay.config = data;
      }
      if (paypal) {
        paypal.config = {};
        const data = await Becca.getAccount('paypal');
        paypal.config = data;
      }
      setPartners(accounts);
    } catch (e) {
      Snackbar.show('Error Occured', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [partners, refresh, loading];
}
