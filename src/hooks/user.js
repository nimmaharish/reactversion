import { useCallback, useEffect, useState } from 'react';
import SnackBar from 'services/snackbar';
import { User } from 'api';
import * as Sentry from '@sentry/react';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const res = await User.getSeller();
      Sentry.setUser({
        username: res.sellerId.toUpperCase(),
        email: res.email,
      });
      setUser(res);
    } catch (e) {
      console.error(e);
      SnackBar.show('something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [user, refresh, loading];
}
