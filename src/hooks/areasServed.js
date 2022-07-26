import { useCallback, useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';

export function useAreaConfig(error = true) {
  const [areaConfig, setAreaConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setAreaConfig(await Becca.getAreaConfig());
    } catch (e) {
      if (error) {
        console.error(e);
        Snackbar.show('Errror Occured', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [areaConfig, refresh, loading];
}

export function useChargeConfig(error = true) {
  const [chargeConfig, setChargeConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setChargeConfig(await Becca.getChargeConfig());
    } catch (e) {
      if (error) {
        console.error(e);
        Snackbar.show('Errror Occured', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [chargeConfig, refresh, loading];
}
