import { useEffect, useState } from 'react';
import Loader from 'services/loader';
import { Becca, Factory } from 'api';
import Snackbar from 'services/snackbar';

export function useInfiniteRatings(id, sorts = {}) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
    try {
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await Becca.getSkuRatings(id, page, sorts);
      setRatings([...ratings, ...data]);
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

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await Becca.getSkuRatings(id, 0, sorts);
      setRatings([...data]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(sorts)]);

  return [ratings, loadMore, hasMore, loading, refresh];
}

export function useOrdersInfiniteRatings(sorts = {}) {
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
    try {
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await Factory.getShopRatings(page, sorts);
      setRatings([...ratings, ...data]);
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

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await Factory.getShopRatings(0, sorts);
      setRatings([...data]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(sorts)]);

  return [ratings, loadMore, hasMore, loading, refresh];
}
