import { useEffect, useState } from 'react';
import { Factory } from 'api';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';
import { useOpenPlans } from 'contexts';

export function useOrders(page = 0, filters = {}, sorts = {}) {
  const [orders, setOrders] = useState(null);

  const refresh = async () => {
    try {
      setOrders((await Factory.getOrders(page, filters, sorts)) || []);
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return [orders, refresh];
}

export function useNewOrders() {
  return useOrders(0, {
    status: {
      $in: [
        'payment successful', 'payment cod', 'created', 'direct payment'
      ]
    }
  }, {
    createdAt: -1,
  });
}

export function useActiveOrders() {
  return useOrders(0, {
    status: {
      $not: {
        $in: [
          'payment successful', 'payment cod', 'created', 'delivered',
          'direct payment', 'cancelled', 'rto delivered', 'payment pending'
        ]
      }
    }
  });
}

export function useInfiniteOrders(filters = {}, sorts = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (p) => {
    try {
      const {
        api,
        ...other
      } = filters;
      if (api === 'incart') {
        const data = await Factory.getInCartOrders(p, other, sorts);
        return data;
      }
      const data = await Factory.getOrders(p, other, sorts);
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
      const data = await fetchOrders(page);
      setOrders([...orders, ...data]);
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
    const data = await fetchOrders(0);
    setOrders([...(data || [])]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [orders, loadMore, hasMore, loading, refresh];
}

export function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [ids, setIds] = useState(null);
  const openPlans = useOpenPlans(true, 'abandonCart');

  const refresh = async () => {
    if (!id) {
      return;
    }
    try {
      Loader.show();
      setOrder(await Factory.getOrder(id));
      setIds([]);
    } catch (e) {
      console.error(e);
      if (e?.response?.status === 403 && e?.response?.data.message === 'upgrade to premium plan') {
        openPlans();
        return;
      }
      Snackbar.show('Errror Occured', 'error');
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return [order, refresh, ids];
}

export function useTrackOrder(id, grpId) {
  const [history, setHistory] = useState([]);

  const refresh = async () => {
    if (!id) {
      return;
    }
    try {
      if (grpId.length > 0) {
        setHistory(await Factory.trackOrderWithGroup(id, grpId));
      } else {
        setHistory(await Factory.trackOrder(id));
      }
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return [history, refresh];
}
