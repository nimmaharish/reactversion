import { useEffect, useState } from 'react';
import Loader from 'services/loader';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';

export function useFeatureRequests(filters = {}, sorts = {}) {
  const [requests, setRequests] = useState(null);
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
      const data = await Becca.getFeatureRequests(page, filters, sorts);
      setRequests([...requests, ...data]);
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
      const data = await Becca.getFeatureRequests(0, filters, sorts);
      setRequests([...data]);
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

  return [requests, loadMore, hasMore, loading, refresh];
}
