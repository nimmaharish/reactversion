import { useEffect, useState } from 'react';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import _ from 'lodash';

export function useBankListDetails(params, method, key, def = []) {
  const [state, setState] = useState(def);

  const fetchData = async () => {
    Loader.show();
    try {
      const req = Object.entries(params).reduce((acc, [key, { value }]) => {
        acc[key] = value;
        return acc;
      }, {});
      setState(await Becca[method](req));
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    if (!key || !_.isEmpty(_.get(params, key))) {
      fetchData();
    }
  }, [JSON.stringify(params[key] || {}), method, key]);

  return state;
}

export function useBankDetailsByIFSC(ifsc) {
  const [state, setState] = useState({});

  const fetchData = async () => {
    try {
      setState(await Becca.getBankDetailsByIFSC({ ifsc }));
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };
  useEffect(() => {
    if (ifsc.length !== 11) {
      setState({});
    } else {
      fetchData();
    }
  }, [ifsc]);

  return state;
}
