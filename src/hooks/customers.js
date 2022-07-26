import { useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';

export function useCustomersList(filters) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isAddressFetching, setAddressFetching] = useState(false);

  const getCustomerAddress = async (id) => {
    if (isAddressFetching) {
      return '';
    }
    setAddressFetching(true);
    const data = await Becca.getCustomerAddress(id);
    setAddressFetching(false);
    return data;
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
      const data = await Becca.getCustomerList(page, filters);
      setCustomers(cus => [...cus, ...data]);
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
      const data = await Becca.getCustomerList(page, filters);
      setCustomers(data);
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
  }, [JSON.stringify(filters)]);

  return [customers, loadMore, hasMore, loading, refresh, getCustomerAddress];
}
