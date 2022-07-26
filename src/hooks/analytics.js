import { useCallback, useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';

export function useShopSummary(filters) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setSummary(await Becca.getSummary(filters));
    } catch (e) {
      console.error(e);
      Snackbar.show('unable to fetch analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    refresh();
  }, [refresh]);
  return [summary, refresh, loading];
}

export function useShopCohort(filters) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setSummary(await Becca.getCohort(filters));
    } catch (e) {
      console.error(e);
      Snackbar.show('unable to fetch analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    refresh();
  }, [refresh]);
  return [summary, refresh, loading];
}
