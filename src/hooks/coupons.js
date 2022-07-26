import { useEffect, useState } from 'react';
import { Snitch } from 'api';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';

export function useCoupon(id) {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!id) {
      return;
    }
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setCoupon(await Snitch.getCoupon(id));
    } catch (e) {
      console.error(e);
      Snackbar.show('error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return [coupon, refresh, loading];
}

export function useInfiniteCoupons(filters = {}, sorts = {}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const data = await Snitch.getAllCoupons(page, filters, sorts);
      setCoupons([...coupons, ...data]);
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
      const data = await Snitch.getAllCoupons(0, filters, sorts);
      setCoupons([...data]);
      setPage(0);
      setHasMore(true);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [coupons, loadMore, hasMore, loading, refresh];
}
