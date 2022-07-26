import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { InfiniteLoader, Grid } from 'react-virtualized';
import { useInfiniteOrders, useQueryParams } from 'hooks';
import { OrderCard } from 'components/orders';
import { Loading } from 'components/shared/Loading';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import emptyOrder from 'assets/overview/newOrder.svg';
import _, { isEmpty } from 'lodash';
import { useIsCartAbandonmentEnabled } from 'contexts';
import cx from 'classnames';
import { customDateFilters, getText } from 'containers/utils';
import { Button, Search } from 'phoenix-components';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { Header } from 'components/shared/Header';
import Details from './Details';
import Filters from './Filters';
import { placedList, FilterMap, dateFilters } from './utils';
import styles from './ListDesktop.module.css';

function OrderList() {
  const params = useQueryParams();
  const state = params.get('state') || 'all';
  const place = params.get('placed') || 'week';
  const custom = params.has('custom') ? params.get('custom') : '';
  const [query, setQuery] = useState('');
  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });
  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  const screenWidth = window.screen.width - 320 - 80 - 160;

  const statusFilters = () => {
    // if (isEmpty(custom)) {
    //   return (FilterMap[state] || FilterMap.active);
    // }
    const selected = !isEmpty(custom) ? custom.split(',') : [state];
    const items = selected.map(y => FilterMap[y]);
    if (!isEmpty(items)) {
      return ({ $or: _.flatten(items) });
    }
    return {};
  };

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

  const [orders, loadMore, hasMore, loading, refresh] = useInfiniteOrders({
    ...dateTimeFilters(),
    ...statusFilters(),
    ...searchFilters(),
  }, {
    createdAt: -1,
  });
  const history = useHistory();
  const isCartAbandonmentEnabled = useIsCartAbandonmentEnabled();
  const isLoading = orders.length === 0 && loading;

  const id = params.get('id');

  const onSectionRendered = (onRowsRendered) => ({
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex
  }) => {
    const startIndex = rowStartIndex * 2 + columnStartIndex;
    const stopIndex = rowStopIndex * 2 + columnStopIndex;

    onRowsRendered({
      startIndex,
      stopIndex
    });
  };

  const rowCount = hasMore ? 10000 : orders.length;

  const isLoaded = i => !!orders[i];

  const height = window.screen.height - 90 - 350;

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

  const renderCell = (el) => {
    const idx = el.rowIndex * 2 + el.columnIndex;
    if (idx >= orders.length) {
      return null;
    }
    return (
      <div key={el.key} style={el.style}>
        <OrderCard
          refresh={refresh}
          showBorder={(idx % 2 === 0)}
          order={orders[idx]}
          showAlert={show(orders[idx])}
        />
      </div>
    );
  };

  const onCreateChange = (val) => {
    setDateRangeFilters({
      from: null,
      to: null
    });
    params.set('placed', val);
    history.push({ search: params.toString() });
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={cx('flexBetween', styles.section)}>
          <Picker
            label={getText(dateRangeFilters)}
            onSelect={(e) => {
              const isEmptyValue = Object.keys(e).length === 0;
              setDateRangeFilters(e);
              params.set('placed', !isEmptyValue ? 'custom' : 'all');
              history.push({ search: params.toString() });
            }}
          />
          <div className={styles.searchDiv}>
            <Search
              value={query}
              placeholder="Search by order ID"
              className={styles.searchBar}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button label="Search" size="small" primary={true} className={styles.Searchbutton} />
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
        <div className={styles.filters}>
          <Filters
            onSelect={(e) => {
              params.delete('state');
              params.set('custom', e.join(','));
              history.push({ search: params.toString() });
            }}
            selected={custom.length > 0 ? custom.split(',') : []}
            reset={custom.length === 0}
          />
        </div>
        <div className={styles.text}>
          Orders List
          {' '}
          <span className={styles.span}>
            (
            {' '}
            {orders.length}
            {' '}
            orders
            )
          </span>
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
              <Grid
                onSectionRendered={onSectionRendered(onRowsRendered)}
                ref={registerChild}
                cellRenderer={renderCell}
                columnCount={2}
                columnWidth={(screenWidth / 2)}
                height={height}
                rowCount={Math.ceil(rowCount / 2)}
                rowHeight={134}
                width={screenWidth}
              />
            )}
          </InfiniteLoader>
        ) : (
          <div className={styles.emptyOrders}>
            <img src={emptyOrder} alt="" />
            <div className={styles.emptyProductText}>
              You haven't received any orders yet!
            </div>

          </div>
        )}
      </div>
      <Details open={!!id} id={id} />
    </div>
  );
}

export default OrderList;
