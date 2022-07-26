import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  InfiniteLoader, List,
} from 'react-virtualized';
import { useInfiniteOrders, useQueryParams } from 'hooks';
import { OrderCard } from 'components/orders';
import { Loading } from 'components/shared/Loading';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import emptyOrder from 'assets/overview/newOrder.svg';
// import chevronLeftDesk from 'assets/images/products/create/back.svg';
import { Search } from 'phoenix-components';
import {
  useIsCartAbandonmentEnabled, useIsUserRated, useIsRatingsEnabled,
  useIsFreePlan,
} from 'contexts';
import cx from 'classnames';
import _ from 'lodash';
import Faq from 'components/faq/Custom';
import { customDateFilters, getText } from 'containers/utils';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { canTakeRating, setRatingShown } from 'utils/ratings';
import { RatingService } from 'services/ratings';
import { useCartCount } from 'hooks/cart';
import Details from './Details';
import {
  placedList,
  dateFilters,
  psStatusFilters,
  osStatusFilters,
  ssStatusFilters
} from './utils';
import Filters from './Filters';
// import Carts from './Carts';
import styles from './List.module.css';

function OrderList() {
  const params = useQueryParams();
  const [details] = useCartCount();
  const enableRating = useIsRatingsEnabled();
  const place = params.get('placed') || 'all';
  const [query, setQuery] = useState('');
  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });
  const rated = useIsUserRated();
  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  const psFilters = psStatusFilters(params.get('ps'));
  const ssFilters = ssStatusFilters(params.get('ss'));
  const osFilters = osStatusFilters(params.get('os'));

  const dateTimeFilters = () => {
    if (place !== 'custom') {
      return dateFilters[place];
    }
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to);
  };

  const searchFilters = () => {
    if (query.length > 0) {
      return { externalId: { $regex: `${query?.replace('#', '')}`, $options: 'i' } };
    }
    return {};
  };

  const filters = {
    ...dateTimeFilters(),
    ...psFilters,
    ...ssFilters,
    ...osFilters,
    ...searchFilters(),
  };

  const [orders, loadMore, hasMore, loading, refresh] = useInfiniteOrders(filters, {
    createdAt: -1,
  });

  useEffect(() => {
    if ((orders?.length || 0) < 1) {
      return;
    }
    if (rated) {
      return;
    }
    if (!canTakeRating()) {
      return;
    }
    RatingService.open();
    setRatingShown();
  }, [orders?.length > 1]);

  const isFree = useIsFreePlan();

  const history = useHistory();
  const isCartAbandonmentEnabled = useIsCartAbandonmentEnabled();
  const isLoading = orders.length === 0 && loading;

  const id = params.get('id');

  const rowCount = hasMore ? 10000 : orders.length;

  const isLoaded = i => !!orders[i];

  const height = window.screen.height - 78 - 36 - 8 - 56;

  if (isLoading && !params.has('placed')) {
    return (
      <Loading />
    );
  }

  const show = (item) => {
    if (item?.status === 'cart cancelled' || item?.orderStatus === 'cart cancelled') {
      return !isCartAbandonmentEnabled;
    }
    return false;
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <div key={item.key} style={item.style}>
      <OrderCard refresh={refresh} order={orders[item.index]} showAlert={show(orders[item.index])} />
    </div>
  );

  const onCreateChange = (val) => {
    setDateRangeFilters({
      from: null,
      to: null
    });
    params.set('placed', val);
    history.push({ search: params.toString() });
  };

  const getRowHeight = (x) => {
    const isNotMulti = _.get(orders[x.index], 'items', 1) === 1;
    return !isNotMulti ? 90 : 134;
  };

  const stateList = [
    {
      label: 'Orders',
      value: 'orders',
      isPremium: false,
    },
    {
      label: 'Carts',
      value: 'carts',
      isPremium: isFree,
      count: details?.count,
    },
    {
      label: 'Reviews',
      value: 'reviews',
      isPremium: isFree,
    },
  ];

  const onStateChange = (val) => {
    if (val === 'reviews') {
      if (!enableRating) {
        params.set('openPlans', 'generic');
        history.push({
          search: params.toString(),
        });
        return;
      }
      history.push({ pathname: '/reviews' });
    }
    if (val === 'carts') {
      if (isFree) {
        params.set('openPlans', 'generic');
        history.push({
          search: params.toString(),
        });
        return;
      }
      history.push({ pathname: '/carts' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="spacer" />
        <StatusSelectionBar
          tabClassName={styles.tabClassName1}
          items={stateList}
          seperator={true}
          onChange={onStateChange}
          active="orders"
        />
        <div className="spacer" />
        <Faq withText={false} showItems={['orders', 'cancellationsReturnsAndRefunds', 'shippingAndDelivery']} />
      </div>
      <div className={cx('flexBetween', styles.section)}>
        <div className={styles.picker}>
          <Picker
            label={getText(dateRangeFilters)}
            onSelect={(e) => {
              setDateRangeFilters(e);
              params.set('placed', 'custom');
              history.push({ search: params.toString() });
            }}
            inputStyle={styles.padd0}
          />
        </div>
        <div className={styles.search}>
          <Search
            value={query}
            placeholder="Search by order ID"
            onChange={(e) => setQuery(e.target.value)}
          // className={styles.searchCom}
          />
        </div>
      </div>
      <StatusSelectionBar
        tabClassName={styles.tabClassName}
        className={styles.tabClass}
        activeClass={styles.tabActive}
        items={placedList}
        onChange={onCreateChange}
        active={place}
      />
      <Filters />
      <div className={styles.orderHead}>
        Orders List
      </div>

      {orders.length > 0 ? (
        <InfiniteLoader
          loadMoreRows={loadMore}
          isRowLoaded={isLoaded}
          rowCount={rowCount}
          minimumBatchSize={10}
        >
          {({
            onRowsRendered,
            registerChild
          }) => (
            <List
              height={height}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={orders.length}
              rowHeight={getRowHeight}
              rowRenderer={renderItem}
              width={window.screen.width}
            />
          )}
        </InfiniteLoader>
      ) : (
        <div className={styles.emptyOrders}>
          <img src={emptyOrder} alt="" />
          <div className={styles.emptyProductText}>
            {Object.keys(filters).length
              ? 'No order match the filters, please try again.' : 'You haven\'t received any orders yet!'}
          </div>

        </div>
      )}
      <Details open={!!id} id={id} />

      {/* {openCarts && <Carts />} */}
    </div>
  );
}

export default OrderList;
