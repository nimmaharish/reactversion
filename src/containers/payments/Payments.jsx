import React, { useState } from 'react';
import { Grid, InfiniteLoader, List } from 'react-virtualized';
import { useInfiniteOrders, useQueryParams, } from 'hooks';
import { Loading } from 'components/shared/Loading';
import { OrderCard } from 'components/payments/OrderCard';
// import cx from 'classnames';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import { customDateFilters, getText } from 'containers/utils';
import { useDesktop } from 'contexts';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { useHistory } from 'react-router-dom';
import { usePaymentRules } from 'contexts/userContext';
import emptyIcon from 'assets/images/payments/empty.svg';

import _ from 'lodash';
import {
  dateFilters, extractPmFilters, extractPsFilters, pmStatusFilters, psStatusFilters, stateList
} from './utils';
import PaymentModeWise from './PaymentModeWise';
import PaymentStatusWise from './PaymentStatusWise';
import Summary from './Summary';
import styles from './Payments.module.css';
import Filters from './Filters';

function PaymentsList() {
  const isDesktop = useDesktop();
  const params = useQueryParams();
  const history = useHistory();
  const rules = usePaymentRules(true);

  const psFilters = psStatusFilters(params.get('ps'));
  const pmFilters = pmStatusFilters(rules, params.get('pm'));

  const dateFilter = params.get('dateFilter') || 'all';
  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });

  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  const dateTimeFilters = () => {
    if (dateFilter !== 'custom') {
      return dateFilters[dateFilter];
    }
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to);
  };

  const paymentStatusFilters = _.get(psFilters, '$or[0].status', []).length ? psFilters.$or[0].status : undefined;

  const [orders, loadMore, hasMore, loading] = useInfiniteOrders(
    {
      ...dateTimeFilters(),
      ...pmFilters,
      status: { $nin: ['cart cancelled', 'cancelled'] },
      paymentStatus: paymentStatusFilters,
    },
    {
      createdAt: -1,
    }
  );

  const rowCount = hasMore ? 10000 : orders.length;

  const isLoaded = i => !!orders[i];

  const height = window.screen.height - isDesktop ? (90 + 50 + 65 + 93 + 34 + 98 + 18) : (76 + 72 + 99 + 57 + 58);

  const cellWidth = (window.screen.width - 420) / 2;

  const isEmpty = orders.length === 0 && loading;

  if (isEmpty) {
    return <Loading />;
  }

  const onStateChange = (val) => {
    params.set('dateFilter', val);
    history.push({ search: params.toString() });
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <div
      key={item.key}
      style={{
        ...item.style,
        marginBottom: 'var(--l-spacing)'
      }}>
      <OrderCard order={orders[item.index]} />
    </div>
  );

  const renderCell = (el) => {
    const idx = el.rowIndex * 2 + el.columnIndex;
    if (idx >= orders.length) {
      return null;
    }
    return (
      <div key={el.key} style={el.style}>
        <OrderCard noBorder={(idx % 2 === 0)} order={orders[idx]} />
      </div>
    );
  };

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

  const getEmptyContainer = () => (
    <div className={styles.emptyProducts}>
      <img src={emptyIcon} alt="" />
      <div className={styles.emptyText}>
        No Orders !!!
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <>
        <div className={styles.desktopContainer}>
          <div className={isDesktop && styles.datePickerForDesktop}>
            <div className={styles.flex}>
              <Picker
                label={getText(dateRangeFilters)}
                float="left"
                onSelect={(e) => {
                  setDateRangeFilters(e);
                  params.set('dateFilter', 'custom');
                  if (Object.keys(e).length === 0) {
                    params.delete('dateFilter');
                  }
                  history.push({ search: params.toString() });
                }}
                inputStyle={styles.input}
              />
              <div className={styles.flex}></div>
            </div>
          </div>
          <StatusSelectionBar
            tabClassName={styles.tabClassName}
            className={styles.tabClass}
            activeClass={styles.tabActive}
            items={stateList}
            onChange={onStateChange}
            active={dateFilter}
          />
          <Filters />
          <div className={styles.nestedContainer}>
            <Summary
              dateFilters={{ ...dateTimeFilters(), ...extractPsFilters(psFilters), ...pmFilters }}
            />
            <PaymentStatusWise
              psFilters={{ ...dateTimeFilters(), ...extractPsFilters(psFilters), ...pmFilters }}
            />
            <PaymentModeWise
              pmFilters={{ ...dateTimeFilters(), ...extractPsFilters(psFilters), ...extractPmFilters(pmFilters) }}
            />
          </div>
        </div>
        <div className={styles.orderHead}>
          Order List
        </div>
        {orders.length > 0 ? (
          !isDesktop ? (
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
                  rowHeight={130}
                  rowRenderer={renderItem}
                  className={styles.list}
                  width={window.screen.width}
                />
              )}
            </InfiniteLoader>
          )
            : (
              <div
                className={styles.marginLeft}
              >
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
                      columnWidth={cellWidth}
                      height={height}
                      rowCount={Math.ceil(rowCount / 2)}
                      rowHeight={120}
                      width={window.screen.width - 400}
                    />
                  )}
                </InfiniteLoader>
              </div>
            )
        ) : getEmptyContainer()}
      </>
    </div>
  );
}

export default PaymentsList;
