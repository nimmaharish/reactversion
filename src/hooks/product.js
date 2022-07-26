import { useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';

export function useProducts(page = 0, filters = {}, sorts = {}) {
  const [products, setProducts] = useState(null);

  const refresh = async () => {
    try {
      const { data = [] } = await Becca.getProducts(page, filters, sorts);
      setProducts(data);
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return [products, refresh];
}

export function useInfiniteProducts(filters = {}, sorts = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isEmptyProducts, setIsEmptyProducts] = useState(false);
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
      const { data = [] } = await Becca.getProducts(page, filters, sorts);
      setProducts([...products || [], ...data]);
      if (page === 0 && data?.length === 0) {
        setIsEmptyProducts(true);
      }
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

  const refresh = () => {
    setPage(0);
    setHasMore(true);
    setProducts([]);
    setTimeout(loadMore, 0);
  };

  useEffect(() => {
    setPage(0);
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [products, loadMore, hasMore, loading, refresh, isEmptyProducts];
}
