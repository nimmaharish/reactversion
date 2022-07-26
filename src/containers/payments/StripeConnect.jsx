import React, { useEffect } from 'react';
import { Loading } from 'components/shared/Loading';
import { useQueryParams } from 'hooks';
import { SnackBar } from 'services';
import { useHistory } from 'react-router-dom';
import Loader from 'services/loader';
import { Becca } from 'api';
import { useRefreshShop } from 'contexts';

function StripeConnect() {
  const params = useQueryParams();
  const history = useHistory();
  const refresh = useRefreshShop();

  const checkStatus = async (pgTid, id, interval) => {
    try {
      const { enabled } = await Becca.pollAccountStatus('stripe');
      if (enabled) {
        clearInterval(interval);
        refresh();
        history.replace('/payments/?open=2');
        SnackBar.show('Connected to stripe account', 'success');
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  useEffect(() => {
    if (params.has('success')) {
      Loader.show();
      const interval = setInterval(async () => {
        checkStatus(interval);
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }

    if (params.has('cancel')) {
      SnackBar.show('Failed to connect with stripe try again', 'error', 10000);
      history.replace('/payments/?open=2');
    }
  }, []);
  return (
    <Loading />
  );
}

StripeConnect.propTypes = {};

StripeConnect.defaultProps = {};

export default StripeConnect;
