import { useCallback, useEffect, useState } from 'react';
import { Piggy } from 'api';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';

export function useWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setWallet((await Piggy.getWallet()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [wallet, refresh, loading];
}

export function useWalletLogs(filters = {}, sorts = {}) {
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const load = async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await Piggy.getWalletLogs(page, filters, sorts);
      setLogs([...logs, ...data]);
      if (data.length === 0) {
        setHasMore(false);
      }
      setPage(page + 1);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    } finally {
      Loader.hide();
      setLoading(false);
    }
  };

  const loadMore = async ({ stopIndex = 10 } = {}) => {
    if (loading) {
      return;
    }
    const newPage = Math.floor(stopIndex / 10);
    if (newPage <= page) {
      return;
    }
    if (!hasMore) {
      return;
    }
    await load();
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await Piggy.getWalletLogs(0, filters, sorts);
      setLogs([...data]);
      setPage(0);
      setHasMore(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [logs, loadMore, hasMore, loading, refresh];
}
