import { useCallback, useEffect, useState } from 'react';
import SnackBar from 'services/snackbar';
import { Nikon } from 'api';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setProfile(await Nikon.getProfile());
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

  return [profile, refresh, loading];
}
