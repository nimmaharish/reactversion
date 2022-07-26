import { useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';

export function useInfiniteCarts(filters = {}, sorts = {}) {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchCarts = async (p) => {
    try {
      const data = await Becca.getAbandonCartList(p, filters, sorts);
      return data;
    } catch (e) {
      Snackbar.showError(e);
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
    try {
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await fetchCarts(page);
      setCarts([...carts, ...data]);
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
    setLoading(true);
    setPage(0);
    const data = await fetchCarts(0);
    setCarts([...(data || [])]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [carts, loadMore, hasMore, loading, refresh];
}

export function useCartDetails(id) {
  const [cart, setCart] = useState(null);

  const fetchDetails = async () => {
    try {
      Loader.show();
      const data = await Becca.getAbandonCart(id);
      setCart(data);
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  return [cart, fetchDetails];
}

export function useCartCount() {
  const [count, setCount] = useState(null);

  const fetchCount = async () => {
    try {
      Loader.show();
      const data = await Becca.getAbandonCartCount();
      setCount(data);
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return [count, fetchCount];
}
