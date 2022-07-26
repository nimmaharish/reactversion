import { useEffect, useState } from 'react';
import { Factory } from 'api';
import Snackbar from 'services/snackbar';
import { inParallelWithLimit } from 'utils/parallel';
import Loader from 'services/loader';

export function useInfinitePayments(type = 'all', filters = {}, sorts = {}) {
  const [items, setItems] = useState([]);
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
      const data = await Factory.getSettlements(type, page, filters, sorts);
      setItems([...items || [], ...data]);
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
    setItems([]);
    setTimeout(loadMore, 500);
  };

  useEffect(() => {
    setPage(0);
    refresh();
  }, [type, JSON.stringify(filters), JSON.stringify(sorts)]);

  return [items, loadMore, hasMore, loading, refresh, isEmptyProducts];
}

export function usePaymentStats(summaryFilters, statusFilters, modeWideFilters) {
  const [summary, setSummary] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [modeWiseSummary, setModeWiseSummary] = useState(null);

  const refreshSummary = async () => {
    try {
      Loader.show();
      setSummary(await Factory.paymentSummary(summaryFilters));
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    } finally {
      Loader.hide();
    }
  };

  const refreshStatusSummary = async () => {
    try {
      Loader.show();
      setStatusSummary(await Factory.paymentStatusSummary(statusFilters));
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    } finally {
      Loader.hide();
    }
  };

  const refreshModeSummary = async () => {
    try {
      Loader.show();
      const { modes = [], ...others } = modeWideFilters || {};
      if (modes) {
        const uploaded = await inParallelWithLimit(modes, 5, async file => {
          const mode = file['payments.paymentMode'];
          let name = file['payments.vendor'];
          const isCp = mode === 'custompayment';
          if (isCp) {
            name = file['payments.customPaymentDetails.mode'];
          }
          const isCod = mode === 'cod';
          if (isCod) {
            name = 'cash';
          }
          try {
            const res = await Factory.paymentSummary({ ...file, ...others });
            return { ...res, name };
          } catch (e) {
            console.log(e);
          }
        });
        setModeWiseSummary(uploaded);
        return;
      }
      setModeWiseSummary([await Factory.paymentSummary(modeWideFilters)]);
    } catch (e) {
      console.error(e);
      Snackbar.show('Errror Occured', 'error');
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    if (!statusFilters) {
      return;
    }
    console.log('status fire once', statusFilters);
    refreshStatusSummary();
  }, [JSON.stringify(statusFilters)]);

  useEffect(() => {
    if (!modeWideFilters) {
      return;
    }
    refreshModeSummary();
    console.log('mode fire once', modeWideFilters);
  }, [JSON.stringify(modeWideFilters)]);

  useEffect(() => {
    if (!summaryFilters) {
      return;
    }
    refreshSummary();
    console.log('summary fire once', summaryFilters);
  }, [JSON.stringify(summaryFilters)]);

  return [summary, statusSummary, modeWiseSummary];
}
