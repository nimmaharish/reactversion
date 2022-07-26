import React, { useEffect } from 'react';
import { useWebData } from 'contexts/webContext';
import { Loading } from 'components/shared/Loading';
import { useHistory } from 'react-router-dom';
import Loader from 'services/loader';
import { Becca } from 'api';
import URL from 'utils/url';
import Stripe from 'services/stripe';
import SnackBar from 'services/snackbar';

export function Subscriptions() {
  const data = useWebData();
  const history = useHistory();

  useEffect(() => {
    const onBuy = async () => {
      Loader.show();
      try {
        const { id } = await Becca.subscribePlan(
          data.planId, data.priceId,
          URL.getUrl('/subscriptions'),
          URL.getUrl('/subscriptions'),
        );
        await Stripe.redirectToCheckout(id);
      } catch (e) {
        SnackBar.showError(e);
      } finally {
        Loader.hide();
      }
    };

    if (data?.planId && data?.priceId) {
      onBuy();
      return;
    }
    history.replace('/');
  }, []);

  return (
    <Loading />
  );
}

Subscriptions.propTypes = {};

Subscriptions.defaultProps = {};
