import { useEffect, useState } from 'react';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';

export function usePartner(name) {
  const [partner, setPartner] = useState(null);

  const fetchDetails = async () => {
    Loader.show();
    try {
      const { accounts = [] } = await Becca.getShop();
      const account = accounts.find(x => x.name === name);
      if (account) {
        account.config = {};
        const data = await Becca.getAccount(name);
        account.config = data;
      }
      setPartner(account);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    if (name) {
      fetchDetails();
    }
  }, [name]);

  return [partner, fetchDetails];
}
